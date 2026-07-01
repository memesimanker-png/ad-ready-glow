// Public, read-only, cached announcements API for the Roblox script loader.
// GET -> JSON array of active announcements, newest first.
// Never writes, never accepts a body, ignores query params.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const TTL_MS = 60 * 1000;

type Announcement = {
  title: string;
  message: string;
  enabled: boolean;
  createdAt: string;
};

let cache: { at: number; data: Announcement[] } | null = null;

const ipHits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const b = ipHits.get(ip);
  if (!b || b.reset < now) {
    ipHits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  b.count += 1;
  return b.count > 60;
}

async function loadAnnouncements(): Promise<Announcement[]> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("announcements")
    .select("title,message,enabled,created_at,expires_at")
    .eq("enabled", true)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((r: any) => ({
    title: r.title ?? "",
    message: r.message,
    enabled: r.enabled === true,
    createdAt: r.created_at,
  }));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const headers = {
    ...corsHeaders,
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=60",
  };

  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown";

  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...headers, "Retry-After": "30" },
    });
  }

  try {
    const now = Date.now();
    if (!cache || now - cache.at > TTL_MS) {
      cache = { at: now, data: await loadAnnouncements() };
    }
    return new Response(JSON.stringify(cache.data), { status: 200, headers });
  } catch (e: any) {
    console.error("announcements error:", e?.message || e);
    return new Response("[]", { status: 200, headers });
  }
});
