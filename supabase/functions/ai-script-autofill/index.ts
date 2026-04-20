import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getClientIp, rateLimit, tooManyRequests } from "../_shared/throttle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Throttle: AI auto-fill is expensive — max 10/min per IP
  const ip = getClientIp(req);
  if (!rateLimit(`ai-autofill:${ip}`, 10, 60_000)) return tooManyRequests(corsHeaders);

  try {
    const { code, existing } = await req.json();
    if (!code || typeof code !== "string") {
      return new Response(JSON.stringify({ error: "code is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const existingHints = existing && typeof existing === "object"
      ? Object.entries(existing).filter(([_, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => `- ${k}: ${JSON.stringify(v)}`).join("\n")
      : "";

    const systemPrompt = `You are a Roblox script metadata generator. Given a Lua script, analyze it and return structured metadata.

CRITICAL RULES:
1. The user may have already filled some fields manually. Their manual input is the source of truth and MUST be respected.
2. If "existing" hints are provided, treat them as authoritative — do NOT contradict, rewrite, or replace them.
3. For fields the user already filled, you may leave them as-is OR slightly enhance them, but never change the meaning or the wording substantially.
4. For fields not provided by the user, generate accurate metadata from the script.
5. Always call the extract_script_metadata function with your analysis.`;

    const userContent = `Analyze this Roblox Lua script and extract metadata.

${existingHints ? `The user has already manually filled these fields — respect them and DO NOT change their wording:\n${existingHints}\n\n` : ""}Script:
${code.slice(0, 8000)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_script_metadata",
            description: "Extract metadata from a Roblox Lua script. Respect any user-provided existing values verbatim.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "A descriptive title (e.g. 'Blox Fruits Auto Farm V3'). If existing.title is provided, return it UNCHANGED." },
                description: { type: "string", description: "A short 1-2 sentence description. If existing.description is provided, return it unchanged." },
                longDescription: { type: "string", description: "A detailed 3-4 sentence description. If existing.longDescription is provided, return it unchanged." },
                game: { type: "string", description: "The Roblox game (e.g. 'Blox Fruits', 'Universal'). If existing.game is provided, return it unchanged." },
                category: { type: "string", enum: ["Auto Farm", "ESP", "Aimbot", "Speed Hack", "Infinite Jump", "Kill Aura", "Admin", "Trolling", "Utility"], description: "The primary category. If existing.category is provided, return it." },
                tags: { type: "array", items: { type: "string" }, description: "5-8 relevant search tags. If existing.tags is provided, return them unchanged." },
                slug: { type: "string", description: "URL-friendly slug (lowercase, hyphens). If existing.slug is provided, return it unchanged." },
                faqs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      answer: { type: "string" }
                    },
                    required: ["question", "answer"]
                  },
                  description: "2-3 relevant FAQs about this script"
                }
              },
              required: ["title", "description", "longDescription", "game", "category", "tags", "slug", "faqs"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "extract_script_metadata" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No structured output from AI");
    }

    const metadata = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(metadata), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-script-autofill error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
