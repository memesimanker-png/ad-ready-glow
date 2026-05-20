import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { redisGet, redisSet } from '../_shared/redis.ts';

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

// Cache loot_url for 10 minutes keyed by destination URL.
// Since destination already includes the per-user nonce, this is safe:
// only the same user retrying the same step gets the same link.
const CACHE_TTL_SECONDS = 600;

async function hashKey(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
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
    const cacheKey = `ll:${await hashKey(String(destination))}`;

    // Cache hit → skip Lootlabs API (saves credits + avoids upstream failures on retry).
    const cached = await redisGet(cacheKey);
    if (cached) {
      console.log('[lootlabs-create-link] cache hit');
      return new Response(JSON.stringify({ loot_url: cached, cached: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Retry Lootlabs up to 3x with exponential backoff to handle transient 5xx / network errors.
    let lastError: unknown = null;
    let lootUrl: string | null = null;
    let short: string | undefined;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 8000);
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
          signal: ctrl.signal,
        });
        clearTimeout(timeout);
        const data = await res.json();
        if (!res.ok || data?.type === 'error') {
          lastError = data?.message || `Lootlabs ${res.status}`;
          // Don't retry 4xx client errors
          if (res.status >= 400 && res.status < 500) break;
          throw new Error(typeof lastError === 'string' ? lastError : 'Lootlabs error');
        }
        const msg = data?.message;
        const entry = Array.isArray(msg) ? msg[0] : msg;
        if (entry?.loot_url) {
          lootUrl = entry.loot_url as string;
          short = entry?.short;
          break;
        }
        lastError = 'No loot_url returned';
      } catch (e) {
        lastError = (e as Error).message;
        console.warn(`[lootlabs-create-link] attempt ${attempt + 1} failed:`, lastError);
      }
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }

    if (!lootUrl) {
      return new Response(JSON.stringify({ error: lastError || 'Lootlabs error' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fire-and-forget cache write
    redisSet(cacheKey, lootUrl, CACHE_TTL_SECONDS).catch(() => {});

    return new Response(JSON.stringify({ loot_url: lootUrl, short }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
