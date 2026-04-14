import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "game-thumbnails";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const universeId = url.searchParams.get("id");

    if (!universeId || !/^\d+$/.test(universeId)) {
      return new Response(JSON.stringify({ error: "Missing or invalid id parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const filePath = `${universeId}.png`;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;

    // Check if file already exists
    const { data: existing } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(filePath, 1);

    if (existing?.signedUrl) {
      return new Response(JSON.stringify({ url: publicUrl, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch from Roblox thumbnails API directly
    const robloxRes = await fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`
    );

    if (!robloxRes.ok) {
      return new Response(JSON.stringify({ error: "Roblox API error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const robloxData = await robloxRes.json();
    const thumbnailUrl = robloxData?.data?.[0]?.imageUrl;

    if (!thumbnailUrl) {
      return new Response(JSON.stringify({ error: "No thumbnail found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download and cache
    const imgRes = await fetch(thumbnailUrl);
    if (!imgRes.ok) {
      return new Response(JSON.stringify({ url: thumbnailUrl, cached: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imgBlob = await imgRes.blob();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, imgBlob, { contentType: "image/png", upsert: true });

    if (uploadError) {
      return new Response(JSON.stringify({ url: thumbnailUrl, cached: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: publicUrl, cached: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
