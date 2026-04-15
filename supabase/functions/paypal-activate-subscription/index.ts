import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HWID_KEY_API = "https://v0-remix-of-roblox-executor-system.vercel.app/api/generate-hwid-key";

async function generateKeyFromAPI(subscriptionId: string): Promise<string> {
  const response = await fetch(HWID_KEY_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
    body: JSON.stringify({ username: `Sub-${subscriptionId}`, hours: 720 }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[subscription] External API error:", errText);
    throw new Error("Failed to generate key from external API");
  }

  const data = await response.json();
  return data.key || data.licenseKey;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { subscription_id, tier, amount, customer_email, user_id } = await req.json();

    if (!subscription_id) {
      return new Response(JSON.stringify({ error: "Missing subscription_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const generatedKey = await generateKeyFromAPI(subscription_id);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("premium_key_purchases").insert({
      payment_id: subscription_id,
      tier: tier || "monthly",
      key_generated: generatedKey,
      amount: Number(amount) || 8,
      currency: "USD",
      status: "completed",
      customer_email: customer_email || null,
      user_id: user_id || null,
      expires_at: expiresAt,
    });

    return new Response(JSON.stringify({
      status: "COMPLETED",
      key: generatedKey,
      expires_at: expiresAt,
      tier: "monthly",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
