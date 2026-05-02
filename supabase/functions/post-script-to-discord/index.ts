// Posts a script announcement to a Discord webhook with a rich, branded embed.
// Admin-only. Triggered manually from the admin dashboard per script.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://combowick.com'
const BRAND_COLOR = 0x7C3AED // violet-600
const BOT_USERNAME = 'Combo_WICK'
// Fallback branding avatar (Roblox logo PNG hosted on Wikipedia commons — always reachable by Discord CDN)
const FALLBACK_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Roblox_Logo.svg/512px-Roblox_Logo.svg.png'

function extractFeatures(longDescription: string | null | undefined, fallback: string): string[] {
  if (!longDescription) return splitBullets(fallback)
  const lines = longDescription.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const bullets = lines
    .filter(l => /^([-*•+]|\d+[.)])\s+/.test(l))
    .map(l => l.replace(/^([-*•+]|\d+[.)])\s+/, ''))
  if (bullets.length >= 2) return bullets.slice(0, 6)
  return splitBullets(fallback)
}

function splitBullets(text: string): string[] {
  if (!text) return []
  return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean).slice(0, 4)
}

// Resolves the actual square game icon image URL (Roblox API returns JSON)
async function resolveGameIcon(universeId: number | null | undefined): Promise<string | undefined> {
  if (!universeId) return undefined
  try {
    const r = await fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`,
    )
    if (!r.ok) return undefined
    const j = await r.json()
    const url = j?.data?.[0]?.imageUrl
    return typeof url === 'string' ? url : undefined
  } catch { return undefined }
}

// Resolves the actual landscape image URL via Roblox API (returns first thumbnail)
async function resolveBanner(universeId: number | null | undefined): Promise<string | undefined> {
  if (!universeId) return undefined
  try {
    const r = await fetch(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=1&defaults=true&size=768x432&format=Png`,
    )
    if (!r.ok) return undefined
    const j = await r.json()
    const url = j?.data?.[0]?.thumbnails?.[0]?.imageUrl
    return typeof url === 'string' ? url : undefined
  } catch { return undefined }
}

function fmtDate(d: string | null | undefined): string {
  try { return new Date(d || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return 'Today' }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL')
    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: 'Discord webhook not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } },
    })
    const admin = createClient(supabaseUrl, serviceKey)

    const { data: userRes, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: userRes.user.id, _role: 'admin' })
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json().catch(() => ({}))
    const scriptId: string | undefined = body.scriptId
    if (!scriptId) {
      return new Response(JSON.stringify({ error: 'scriptId required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: script, error: scriptErr } = await admin
      .from('scripts').select('*').eq('id', scriptId).maybeSingle()
    if (scriptErr || !script) {
      return new Response(JSON.stringify({ error: 'Script not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const features = extractFeatures(script.long_description, script.description)
    const url = `${SITE_URL}/scripts/${script.slug}`
    const [icon, resolvedBanner] = await Promise.all([
      resolveGameIcon(script.game_universe_id),
      resolveBanner(script.game_universe_id),
    ])
    const banner = resolvedBanner || icon || FALLBACK_AVATAR
    const avatar = icon || FALLBACK_AVATAR
    const tagList = Array.isArray(script.tags) ? script.tags.filter(Boolean).slice(0, 6) : []
    const status = script.verified ? '✅ Verified' : '🆕 New'
    const trending = script.trending ? ' • 🔥 Trending' : ''
    const paid = script.is_paid ? ' • 💎 Premium' : ' • 🆓 Free'

    const fields: { name: string; value: string; inline?: boolean }[] = [
      { name: '🎮 Game', value: script.game || 'Roblox', inline: true },
      { name: '📂 Category', value: script.category || 'Script', inline: true },
      { name: '⚡ Status', value: `${status}${trending}${paid}`, inline: true },
    ]

    if (features.length) {
      fields.push({
        name: '✨ Features',
        value: features.map(f => `🔥 ${f}`).join('\n').slice(0, 1024),
      })
    }

    if (tagList.length) {
      fields.push({
        name: '🏷️ Tags',
        value: tagList.map((t: string) => `\`${t}\``).join(' '),
        inline: false,
      })
    }

    fields.push({
      name: '🔗 Get the Script',
      value: `**[▶ Open Script Page](${url})** • [🌐 combowick.com](${SITE_URL})`,
      inline: false,
    })

    const embed: Record<string, unknown> = {
      author: {
        name: 'Combo_WICK • Premium Scripts',
        url: SITE_URL,
        icon_url: avatar,
      },
      title: `${script.title}`,
      url,
      description:
        `> ${(script.description || 'New script just dropped.').slice(0, 380)}\n\n` +
        `📅 Released **${fmtDate(script.created_at)}** • [View on site →](${url})`,
      color: BRAND_COLOR,
      fields,
      image: { url: banner },
      footer: {
        text: `Combo_WICK Scripts • ${script.game || 'Roblox'} • Always run on a trusted executor`,
        icon_url: avatar,
      },
      timestamp: new Date().toISOString(),
    }
    if (icon) (embed as any).thumbnail = { url: icon }

    // Discord components v2 — link button under the embed
    const components = [
      {
        type: 1,
        components: [
          { type: 2, style: 5, label: '▶  Open Script', url },
          { type: 2, style: 5, label: '🌐  combowick.com', url: SITE_URL },
          ...(script.youtube_url
            ? [{ type: 2, style: 5, label: '📺  Watch Tutorial', url: script.youtube_url }]
            : []),
          ...(script.game_url
            ? [{ type: 2, style: 5, label: '🎮  Play Game', url: script.game_url }]
            : []),
        ].slice(0, 5),
      },
    ]

    const payload = {
      username: BOT_USERNAME,
      avatar_url: avatar,
      content: body.mention ? String(body.mention).slice(0, 200) : undefined,
      embeds: [embed],
      components,
      // allowed_mentions guards against accidental @everyone
      allowed_mentions: { parse: ['roles', 'users'] },
    }

    const resp = await fetch(`${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}with_components=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) {
      const txt = await resp.text()
      console.error('Discord webhook failed', resp.status, txt)
      // Retry once without components (older webhooks may reject them)
      if (resp.status === 400) {
        const { components: _drop, ...fallback } = payload
        const retry = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallback),
        })
        if (retry.ok) {
          return new Response(JSON.stringify({ success: true, fallback: true }), {
            status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }
      return new Response(JSON.stringify({ error: `Discord error ${resp.status}`, detail: txt }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('post-script-to-discord error', e)
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
