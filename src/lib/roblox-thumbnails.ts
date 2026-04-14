const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const CACHE_KEY = "roblox_thumb_cache_v5";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry { url: string; ts: number; }

function getCache(): Record<string, CacheEntry> {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}

function setCache(cache: Record<string, CacheEntry>) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
}

export async function fetchGameThumbnailByUniverseId(universeId: number): Promise<string | null> {
  if (!universeId) return null;
  const key = String(universeId);
  const cache = getCache();
  const entry = cache[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.url;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/cache-thumbnail?id=${universeId}`,
      { headers: { Authorization: `Bearer ${SUPABASE_KEY}`, apikey: SUPABASE_KEY } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const thumbnailUrl: string | undefined = json?.url;
    if (thumbnailUrl) {
      const c = getCache();
      c[key] = { url: thumbnailUrl, ts: Date.now() };
      setCache(c);
      return thumbnailUrl;
    }
    return null;
  } catch { return null; }
}
