import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { extendKey, deactivateKey } from "../_shared/shop-key-api.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_API = "https://api-m.paypal.com";
const HWID_KEY_API = "https://v0-remix-of-roblox-executor-system.vercel.app/api/generate-hwid-key";

async function verifyWebhookSignature(req: Request, body: string): Promise<boolean> {
  const webhookSecret = Deno.env.get("PAYPAL_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("[webhook] PAYPAL_WEBHOOK_SECRET not set");
    return false;
  }

  const clientId = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET")!;

  // Get access token
  const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const tokenData = await tokenRes.json();

  const verifyRes = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: req.headers.get("paypal-auth-algo"),
      cert_url: req.headers.get("paypal-cert-url"),
      transmission_id: req.headers.get("paypal-transmission-id"),
      transmission_sig: req.headers.get("paypal-transmission-sig"),
      transmission_time: req.headers.get("paypal-transmission-time"),
      webhook_id: webhookSecret,
      webhook_event: JSON.parse(body),
    }),
  });

  const verifyData = await verifyRes.json();
  return verifyData.verification_status === "SUCCESS";
}

async function generateKey(identifier: string, hours: number): Promise<string> {
  const res = await fetch(HWID_KEY_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
    body: JSON.stringify({ username: identifier, hours }),
  });
  if (!res.ok) throw new Error("Key generation failed");
  const data = await res.json();
  return data.key || data.licenseKey;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const event = JSON.parse(body);
    const eventType = event.event_type;

    console.log(`[webhook] Event: ${eventType}`);

    // Verify signature
    const isValid = await verifyWebhookSignature(req, body);
    if (!isValid) {
      console.error("[webhook] Invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Handle payment capture completed (one-time purchases).
    // This fires for instant payments AND when a slow eCheck finally clears.
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id || capture.id;
      const amount = parseFloat(capture.amount?.value || "0");
      const email = capture.payer?.email_address || null;

      // Was this order already recorded (e.g. a pending eCheck)? If so, reuse its
      // tier and don't create a duplicate / don't re-issue an already-issued key.
      const { data: existing } = await supabase
        .from("premium_key_purchases")
        .select("id, tier, status, key_generated, customer_email")
        .eq("payment_id", orderId)
        .maybeSingle();

      if (existing && existing.status === "completed" && existing.key_generated) {
        console.log(`[webhook] Order ${orderId} already completed — skipping`);
      } else {
        let tier = existing?.tier || "trial-7day";
        let hours = 72;
        if (!existing) {
          if (amount >= 40) { tier = "lifetime"; hours = 876000; }
          else if (amount >= 8) { tier = "monthly"; hours = 720; }
        } else {
          if (tier === "lifetime") hours = 876000;
          else if (tier === "monthly") hours = 720;
          else hours = 72;
        }

        const key = await generateKey(`PayPal-${orderId}`, hours);
        const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
        const finalEmail = email || existing?.customer_email || null;

        if (existing) {
          await supabase.from("premium_key_purchases")
            .update({ key_generated: key, status: "completed", expires_at: expiresAt })
            .eq("id", existing.id);
        } else {
          await supabase.from("premium_key_purchases").insert({
            payment_id: orderId,
            tier,
            key_generated: key,
            amount,
            currency: capture.amount?.currency_code || "USD",
            status: "completed",
            customer_email: finalEmail,
            expires_at: expiresAt,
          });
        }

        // Email the key to the buyer (important for eCheck: they left long ago).
        if (finalEmail) {
          try {
            await supabase.functions.invoke("send-transactional-email", {
              body: {
                templateName: "key-delivery",
                recipientEmail: finalEmail,
                templateData: {
                  premiumKey: key,
                  tier,
                  expiresAt: new Date(expiresAt).toLocaleDateString(),
                },
              },
            });
          } catch (e) {
            console.error("[webhook] key-delivery email failed:", e);
          }
        }

        console.log(`[webhook] Key issued for order ${orderId}: ${tier}`);
      }
    }

    // eCheck (or any capture) was denied/reversed — mark the row failed AND
    // revoke the key on the key server if one was already issued (refund/chargeback).
    if (eventType === "PAYMENT.CAPTURE.DENIED" || eventType === "PAYMENT.CAPTURE.REVERSED") {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id || capture.id;

      const { data: rows } = await supabase.from("premium_key_purchases")
        .select("id, key_generated")
        .eq("payment_id", orderId);

      for (const row of rows || []) {
        if (row.key_generated) {
          try {
            await deactivateKey(row.key_generated);
            console.log(`[webhook] Revoked key for reversed order ${orderId}`);
          } catch (e) {
            console.error("[webhook] deactivateKey failed:", e);
          }
        }
      }

      await supabase.from("premium_key_purchases")
        .update({ status: "failed" })
        .eq("payment_id", orderId)
        .in("status", ["pending", "completed"]);
      console.log(`[webhook] Capture ${orderId} denied/reversed`);
    }

    // Handle subscription activated / renewed.
    // First activation issues a key. RENEWALS EXTEND the existing key by 30 days
    // instead of issuing a brand new one — one stable key for the life of the sub.
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED" || eventType === "BILLING.SUBSCRIPTION.RENEWED") {
      const subscription = event.resource;
      const subId = subscription.id;
      const email = subscription.subscriber?.email_address || null;

      const { data: existing } = await supabase.from("premium_key_purchases")
        .select("id, key_generated, expires_at")
        .eq("payment_id", subId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing?.key_generated) {
        // Renewal: extend the existing key by 720 hours (30 days).
        let newExpiry: string | null = null;
        try {
          const ext = await extendKey(existing.key_generated, 720);
          newExpiry = ext.ok ? (ext.data?.new_expires_at || null) : null;
        } catch (e) {
          console.error("[webhook] extendKey on renewal failed:", e);
        }
        // Fallback: compute +30d from current expiry if API didn't return one.
        if (!newExpiry) {
          const base = existing.expires_at && new Date(existing.expires_at) > new Date()
            ? new Date(existing.expires_at) : new Date();
          newExpiry = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        }
        await supabase.from("premium_key_purchases")
          .update({ status: "completed", expires_at: newExpiry })
          .eq("id", existing.id);
        console.log(`[webhook] Subscription ${subId} renewed — key extended to ${newExpiry}`);
      } else {
        // First activation: issue the key.
        const key = await generateKey(`Sub-${subId}`, 720);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from("premium_key_purchases").insert({
          payment_id: subId,
          tier: "monthly",
          key_generated: key,
          amount: 8,
          currency: "USD",
          status: "completed",
          customer_email: email,
          expires_at: expiresAt,
        });
        console.log(`[webhook] Subscription key generated for ${subId}`);
      }
    }

    // Handle subscription cancelled
    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.SUSPENDED") {
      const subId = event.resource.id;
      console.log(`[webhook] Subscription ${subId} cancelled/suspended`);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[webhook] Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
