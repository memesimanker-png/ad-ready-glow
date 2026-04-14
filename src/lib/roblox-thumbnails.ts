const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const GAME_UNIVERSE_IDS: Record<string, number> = {
  "Blox Fruits": 994732206,
  "Arsenal": 111958650,
  "Murder Mystery 2": 66654135,
  "Adopt Me": 383310974,
  "Brookhaven": 1686885941,
  "Da Hood": 1008451066,
  "Pet Simulator X": 2316994223,
  "Universal": 0,
};

const CACHE_KEY = "roblox_thumb_cache_v2";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry { url: string; ts: number; }

function getCache(): Record<string, CacheEntry> {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}

function setCache(cache: Record<string, CacheEntry>) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
}

export function getGameUniverseId(gameName: string): number {
  return GAME_UNIVERSE_IDS[gameName] ?? 0;
}

export async function fetchGameThumbnail(gameName: string): Promise<string | null> {
  const cache = getCache();
  const entry = cache[gameName];
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.url;

  const universeId = getGameUniverseId(gameName);
  if (!universeId) return null;

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
      c[gameName] = { url: thumbnailUrl, ts: Date.now() };
      setCache(c);
      return thumbnailUrl;
    }
    return null;
  } catch { return null; }
}
