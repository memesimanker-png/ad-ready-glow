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

    const { title, destination, thumbnail } = await req.json();
    if (!title || !destination) {
      return new Response(JSON.stringify({ error: 'title and destination required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const safeTitle = String(title).slice(0, 30);

    // Cache by title+destination so all users hitting the same unlock share one Lootlabs link.
    // TTL 60 min — Lootlabs links remain valid much longer; this just bounds memory.
    const cacheKey = `loot:${safeTitle}|${destination}`;
    const cached = memCacheGet<{ loot_url: string; short?: string }>(cacheKey);
    if (cached) {
      return new Response(JSON.stringify({ ...cached, cached: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

    return new Response(JSON.stringify({ loot_url: lootUrl, short: entry?.short }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
