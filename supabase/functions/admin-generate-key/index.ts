import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  return new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify admin role from auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { tier, customer_email } = await req.json();

    if (!tier) {
      return new Response(JSON.stringify({ error: "Missing tier" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const generatedKey = generateKey(tier);
    const expiresAt = calculateExpiry(tier);

    const tierPrices: Record<string, number> = {
      "trial-7day": 5,
      "monthly": 9.99,
      "lifetime": 49.99,
    };

    const { error: dbError } = await supabase.from("premium_key_purchases").insert({
      payment_id: `ADMIN-${Date.now()}`,
      tier,
      key_generated: generatedKey,
      amount: tierPrices[tier] || 0,
      currency: "USD",
      status: "completed",
      customer_email: customer_email || null,
      user_id: null,
      expires_at: expiresAt,
    });

    if (dbError) {
      return new Response(JSON.stringify({ error: "Database error", details: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
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
