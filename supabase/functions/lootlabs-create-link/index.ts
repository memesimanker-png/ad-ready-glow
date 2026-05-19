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

    const res = await fetch('https://creators.lootlabs.gg/api/public/content_locker', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: safeTitle,
        url: destination,
        tier_id: 3,
        number_of_tasks: 1,
        theme: 1,
        ...(thumbnail ? { thumbnail } : {}),
      }),
    });

    const data = await res.json();
    if (!res.ok || data?.type === 'error') {
      return new Response(JSON.stringify({ error: data?.message || 'Lootlabs error', raw: data }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const lootUrl = data?.message?.loot_url;
    if (!lootUrl) {
      return new Response(JSON.stringify({ error: 'No loot_url returned', raw: data }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ loot_url: lootUrl, short: data?.message?.short }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
