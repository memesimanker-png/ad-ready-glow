import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET")!;
  const auth = btoa(`${clientId}:${clientSecret}`);

  const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`PayPal auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

function generateKey(tier: string): string {
  const prefix = tier === "trial-7day" ? "TRIAL" : tier === "monthly" ? "MONTH" : "LIFE";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = prefix + "-";
  for (let i = 0; i < 20; i++) {
    if (i > 0 && i % 5 === 0) key += "-";
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function calculateExpiry(tier: string): string {
  const now = new Date();
  if (tier === "trial-7day") return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  if (tier === "monthly") return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(); // lifetime
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { order_id, tier, amount, customer_email, user_id } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ error: "Missing order_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = await getPayPalAccessToken();

    const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${order_id}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureRes.json();
    if (!captureRes.ok || captureData.status !== "COMPLETED") {
      return new Response(JSON.stringify({ error: "Payment not completed", details: captureData }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate key and store purchase
    const generatedKey = generateKey(tier || "lifetime");
    const expiresAt = calculateExpiry(tier || "lifetime");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("premium_key_purchases").insert({
      payment_id: order_id,
      tier: tier || "lifetime",
      key_generated: generatedKey,
      amount: Number(amount) || 0,
      currency: "USD",
      status: "completed",
      customer_email: customer_email || captureData.payer?.email_address || null,
      user_id: user_id || null,
      expires_at: expiresAt,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    return new Response(JSON.stringify({
      status: "COMPLETED",
      key: generatedKey,
      expires_at: expiresAt,
      tier,
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
