import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiToken = Deno.env.get('Lootlabs_apikey');
    if (!apiToken) {
      return new Response(JSON.stringify({ error: 'Missing Lootlabs_apikey' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { title, destination, thumbnail } = await req.json();
    if (!title || !destination) {
      return new Response(JSON.stringify({ error: 'title and destination required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const safeTitle = String(title).slice(0, 30);

    // Decoy URL set on the locker itself (anti-bypass: real destination passed via &data=)
    const decoyUrl = new URL(destination).origin;

    // 1. Create content locker pointing at decoy
    const lockerRes = await fetch('https://creators.lootlabs.gg/api/public/content_locker', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: safeTitle,
        url: decoyUrl,
        tier_id: 3,
        number_of_tasks: 1,
        theme: 1,
        ...(thumbnail ? { thumbnail } : {}),
      }),
    });
    const lockerData = await lockerRes.json();
    if (!lockerRes.ok || lockerData?.type === 'error') {
      return new Response(JSON.stringify({ error: lockerData?.message || 'Lootlabs locker error', raw: lockerData }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const msg = lockerData?.message;
    const entry = Array.isArray(msg) ? msg[0] : msg;
    const baseUrl = entry?.loot_url;
    if (!baseUrl) {
      return new Response(JSON.stringify({ error: 'No loot_url returned', raw: lockerData }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Encrypt the real destination via anti-bypass endpoint
    const encRes = await fetch('https://creators.lootlabs.gg/api/public/url_encryptor', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination_url: destination }),
    });
    const encData = await encRes.json();
    if (!encRes.ok || encData?.type === 'error' || !encData?.message) {
      // Fall back to plain locker URL if encryption fails
      return new Response(JSON.stringify({ loot_url: baseUrl, short: entry?.short, anti_bypass: false }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // encData.message is already URL-encoded per Lootlabs docs
    const encrypted = String(encData.message);
    const sep = baseUrl.includes('?') ? '&' : '?';
    const finalUrl = `${baseUrl}${sep}data=${encrypted}`;

    return new Response(JSON.stringify({ loot_url: finalUrl, short: entry?.short, anti_bypass: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
