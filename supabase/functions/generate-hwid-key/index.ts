import { corsHeaders } from "@supabase/supabase-js/cors";

const HWID_KEY_API_ENDPOINT =
  "https://v0-remix-of-roblox-executor-system.vercel.app/api/generate-hwid-key";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { username } = body;

    const requestBody: { username?: string; hours: number } = {
      hours: 11,
    };

    if (username && typeof username === "string" && username.trim().length > 0) {
      requestBody.username = username.trim();
    }

    console.log("[generate-hwid-key] Calling external API:", HWID_KEY_API_ENDPOINT);
    console.log("[generate-hwid-key] Request body:", JSON.stringify(requestBody));

    const response = await fetch(HWID_KEY_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[generate-hwid-key] Response status:", response.status);

    const responseData = await response.json();
    console.log("[generate-hwid-key] Response data:", JSON.stringify(responseData));

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: responseData.message || responseData.error || "Failed to generate key",
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        key: responseData.key,
        expiresAt: responseData.expiresAt,
        hours: 11,
        username: responseData.username,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[generate-hwid-key] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
