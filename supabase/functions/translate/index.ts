import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getClientIp, rateLimit, tooManyRequests } from "../_shared/throttle.ts";
import { getExternalSupabase } from "../_shared/external-supabase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  // Cloudflare-style stale-while-revalidate: cache identical translation batches for 1h,
  // serve stale up to 24h while a background refresh hits the AI gateway.
  "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
  "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

// Tiny in-memory hot cache (per isolate). Skips DB roundtrip for repeated batches
// from the same warm worker — the DB cache is still authoritative for cold starts.
const HOT_TTL_MS = 5 * 60 * 1000;
const hot = new Map<string, { value: Record<string, string>; ts: number }>();
function hotKey(lang: string, texts: string[]) {
  return lang + "|" + texts.slice().sort().join("\u0001");
}

const LANG_NAMES: Record<string, string> = {
  fr: "French", th: "Thai", ko: "Korean", "zh-CN": "Simplified Chinese",
  de: "German", ru: "Russian", id: "Indonesian", pt: "Portuguese",
  fil: "Filipino", es: "Spanish", vi: "Vietnamese",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Throttle: max 30 translate requests per IP per minute
  const ip = getClientIp(req);
  if (!rateLimit(`translate:${ip}`, 30, 60_000)) return tooManyRequests(corsHeaders);

  try {
    const { texts, language } = await req.json();

    if (!texts || !Array.isArray(texts) || !language || language === "en") {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langName = LANG_NAMES[language];
    if (!langName) {
      return new Response(JSON.stringify({ error: "Unsupported language" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Hot in-memory cache: skip DB hit entirely if this exact batch was served recently.
    const hk = hotKey(language, texts);
    const hotHit = hot.get(hk);
    if (hotHit && Date.now() - hotHit.ts < HOT_TTL_MS) {
      return new Response(JSON.stringify({ translations: hotHit.value }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Offloaded to EXTERNAL Supabase (reduces egress + storage on main project).
    const supabase = getExternalSupabase();

    // Check cache first
    const { data: cached } = await supabase
      .from("translations")
      .select("source_text, translated_text")
      .eq("language", language)
      .in("source_text", texts);

    const cachedMap: Record<string, string> = {};
    (cached || []).forEach((r: any) => { cachedMap[r.source_text] = r.translated_text; });

    const missing = texts.filter((t: string) => !cachedMap[t]);

    if (missing.length === 0) {
      return new Response(JSON.stringify({ translations: cachedMap }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Batch translate missing texts via AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Process in chunks of 40 to avoid token limits
    const chunks: string[][] = [];
    for (let i = 0; i < missing.length; i += 40) {
      chunks.push(missing.slice(i, i + 40));
    }

    const allTranslated: Record<string, string> = {};

    for (const chunk of chunks) {
      const numbered = chunk.map((t, i) => `${i + 1}. ${t}`).join("\n");

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the numbered texts from English to ${langName}. Return ONLY a JSON object mapping each original English text to its ${langName} translation. Keep brand names like "ComboWick", "Combo_WICK", "PayPal", "Discord", "Roblox" unchanged. Keep formatting symbols like bullet points. Be natural and fluent.`
            },
            {
              role: "user",
              content: `Translate these texts to ${langName}:\n\n${numbered}`
            }
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited", translations: { ...cachedMap, ...allTranslated } }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted", translations: { ...cachedMap, ...allTranslated } }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) continue;

      try {
        const parsed = JSON.parse(content);
        Object.assign(allTranslated, parsed);
      } catch {
        console.error("Failed to parse AI response:", content);
      }
    }

    // Cache results in DB
    const rows = Object.entries(allTranslated).map(([source, translated]) => ({
      source_text: source,
      language,
      translated_text: translated as string,
    }));

    if (rows.length > 0) {
      await supabase.from("translations").upsert(rows, {
        onConflict: "source_text,language",
      });
    }

    const merged = { ...cachedMap, ...allTranslated };
    // Populate hot cache & lightly bound its size so isolates don't leak memory.
    hot.set(hk, { value: merged, ts: Date.now() });
    if (hot.size > 500) {
      const oldest = hot.keys().next().value;
      if (oldest) hot.delete(oldest);
    }

    return new Response(JSON.stringify({ translations: merged }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
