// Posts a script announcement to a Discord webhook (HaxHell-style rich embed).
// Admin-only. Triggered manually from the admin dashboard per script.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://combowick.com'
const BRAND_COLOR = 0x7C3AED // violet-600 — matches site

function extractFeatures(longDescription: string | null | undefined, fallback: string): string[] {
  if (!longDescription) return splitBullets(fallback);
  // Look for lines that look like bullets/features
  const lines = longDescription.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const bullets = lines.filter(l => /^([-*•+]|\d+[.)])\s+/.test(l)).map(l => l.replace(/^([-*•+]|\d+[.)])\s+/, ''));
  if (bullets.length >= 2) return bullets.slice(0, 6);
  // Otherwise take the first 1-2 sentences from short desc
  return splitBullets(fallback);
}

function splitBullets(text: string): string[] {
  if (!text) return [];
  return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean).slice(0, 4);
}

function thumbForGame(universeId: number | null | undefined): string | undefined {
  if (!universeId) return undefined;
  return `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: 'Discord webhook not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization') ?? '';
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(supabaseUrl, serviceKey);

    // Auth check — admin only
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: userRes.user.id, _role: 'admin' });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const scriptId: string | undefined = body.scriptId;
    if (!scriptId) {
      return new Response(JSON.stringify({ error: 'scriptId required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: script, error: scriptErr } = await admin
      .from('scripts').select('*').eq('id', scriptId).maybeSingle();
    if (scriptErr || !script) {
      return new Response(JSON.stringify({ error: 'Script not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const features = extractFeatures(script.long_description, script.description);
    const url = `${SITE_URL}/scripts/${script.slug}`;
    const thumb = thumbForGame(script.game_universe_id);

    const fields: { name: string; value: string; inline?: boolean }[] = [
      { name: '🎮 Game', value: script.game || 'Roblox', inline: true },
      { name: '📂 Category', value: script.category || 'Script', inline: true },
    ];
    if (features.length) {
      fields.push({
        name: '✨ Features',
        value: features.map(f => `🔥 ${f}`).join('\n').slice(0, 1000),
      });
    }

    const embed: Record<string, unknown> = {
      title: script.title,
      url,
      description: (script.description || '').slice(0, 400),
      color: BRAND_COLOR,
      fields,
      footer: { text: 'Combo_WICK Scripts' },
      timestamp: new Date().toISOString(),
    };
    if (thumb) embed.thumbnail = { url: thumb };

    const payload = {
      username: 'Combo_WICK',
      content: body.mention ? String(body.mention).slice(0, 200) : undefined,
      embeds: [embed],
    };

    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Discord webhook failed', resp.status, txt);
      return new Response(JSON.stringify({ error: `Discord error ${resp.status}`, detail: txt }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('post-script-to-discord error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
