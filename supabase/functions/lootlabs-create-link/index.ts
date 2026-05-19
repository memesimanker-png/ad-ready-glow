import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { memCacheGet, memCacheSet } from '../_shared/throttle.ts';


const ALLOWED_ORIGINS = [
  'https://shop-ready.lovable.app',
  'https://combowick.com',
  'https://www.combowick.com',
];
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try { return /\.lovable\.app$/.test(new URL(origin).hostname); } catch { return false; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const origin = req.headers.get('origin');
  if (!isAllowedOrigin(origin)) {
    console.warn('[lootlabs-create-link] blocked origin:', origin);
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }



  try {
    const apiToken = Deno.env.get('Lootlabs_apikey');
    if (!apiToken) {
      return new Response(JSON.stringify({ error: 'Missing Lootlabs_apikey' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { title, destination, thumbnail, cacheKey } = await req.json();
    if (!title || !destination) {
      return new Response(JSON.stringify({ error: 'title and destination required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const safeTitle = String(title).slice(0, 30);

    // Cache by explicit cacheKey (e.g. "s1:slug"). Destination keeps a per-user
    // nonce for anti-bypass, so we can't cache by destination directly.
    // Lootlabs redirects to whatever destination the FIRST caller registered,
    // but our return pages validate nonce against localStorage, so a stale URL
    // still passes for the legitimate user whose nonce is in their browser.
    const key = cacheKey ? `loot:${cacheKey}` : null;
    if (key) {
      const cached = memCacheGet<{ loot_url: string; short?: string }>(key);
      if (cached) {
        return new Response(JSON.stringify({ ...cached, cached: true }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }



    const res = await fetch('https://creators.lootlabs.gg/api/public/content_locker', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: safeTitle,
        url: destination,
        tier_id: 3,
        number_of_tasks: 1,
        theme: 1,
        ...(thumbnail ? { thumbnail } : {}),
      }),
    });
    const data = await res.json();
    if (!res.ok || data?.type === 'error') {
      return new Response(JSON.stringify({ error: data?.message || 'Lootlabs error', raw: data }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const msg = data?.message;
    const entry = Array.isArray(msg) ? msg[0] : msg;
    const lootUrl = entry?.loot_url;
    if (!lootUrl) {
      return new Response(JSON.stringify({ error: 'No loot_url returned', raw: data }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = { loot_url: lootUrl, short: entry?.short };
    memCacheSet(cacheKey, payload, 60 * 60 * 1000);

    return new Response(JSON.stringify(payload), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
