// SEO landing pages for high-volume game keywords.
// Even without a script live yet, these pages capture traffic and funnel
// users into the Discord / waitlist / scripts catalog.

export type GameLanding = {
  slug: string;
  game: string;
  keyword: string;          // primary keyword we want to rank for
  volume: string;           // monthly searches (display only)
  difficulty: string;       // SEO difficulty (display only)
  title: string;            // <title>
  metaDescription: string;  // <meta description>
  h1: string;
  intro: string;
  features: string[];
  status: "live" | "coming-soon" | "in-development";
  faqs: { q: string; a: string }[];
};

export const GAME_LANDINGS: Record<string, GameLanding> = {
  "blox-fruits": {
    slug: "blox-fruits",
    game: "Blox Fruits",
    keyword: "blox fruits script",
    volume: "6,600/mo",
    difficulty: "Easy (22/100)",
    title: "Blox Fruits Script — Auto Farm, Devil Fruit & No Key | ComboWick",
    metaDescription:
      "Free Blox Fruits script with auto farm, devil fruit sniper, auto raid and ESP. HWID-locked, undetected and updated for the latest Blox Fruits patch.",
    h1: "Blox Fruits Script",
    intro:
      "ComboWick is preparing a complete Blox Fruits exploit pack — auto farm, devil fruit sniper, sea event, raid auto, mastery grind and ESP. Built on the same secure HWID key system used across our catalog and patched within hours of every Blox Fruits update.",
    features: [
      "Auto Farm Level (works to max level)",
      "Devil Fruit Sniper + Notifier",
      "Sea Event Auto (Tide Keeper, Rip Indra)",
      "Raid Auto Farm",
      "Mastery Auto + Stat Reset",
      "Player ESP and Boss ESP",
      "Anti-AFK and Anti-Ban routine",
      "Works on Hydrogen, Delta, Wave and other top executors",
    ],
    status: "in-development",
    faqs: [
      {
        q: "Is this Blox Fruits script free?",
        a: "Yes. The base script is free with a 24-hour HWID key obtained through the standard ComboWick verification flow. Premium keys remove the daily refresh.",
      },
      {
        q: "Does it work without a key?",
        a: "All ComboWick scripts use HWID keys to prevent leaking and abuse. The free key takes ~30 seconds to claim and lasts 11 hours.",
      },
      {
        q: "Will I get banned using this Blox Fruits script?",
        a: "We use anti-detection routines and patch within hours of any Blox Fruits update, but no exploit is 100% safe. Use an alt account if you care about your main.",
      },
      {
        q: "Which executors are supported?",
        a: "Hydrogen (Android), Delta, Wave, Solara, Xeno and any executor with full UNC support.",
      },
    ],
  },

  "arsenal": {
    slug: "arsenal",
    game: "Arsenal",
    keyword: "arsenal script",
    volume: "2,900/mo",
    difficulty: "Easy (18/100)",
    title: "Arsenal Script — Aimbot, ESP, Silent Aim 2026 | ComboWick",
    metaDescription:
      "Free Arsenal script with aimbot, silent aim, ESP, auto-shoot and no recoil. HWID-key protected, undetected and updated for the latest Arsenal patch.",
    h1: "Arsenal Script",
    intro:
      "ComboWick is wrapping up the cleanest Arsenal pack on the market — silent aim with FOV control, full ESP, hitbox extender and auto-shoot. Built to survive Arsenal's monthly anti-cheat passes and works on all major executors.",
    features: [
      "Silent Aim with adjustable FOV",
      "Aimbot (lock to head, body, torso)",
      "Player ESP — name, health, distance, box",
      "Hitbox Extender (multiplier slider)",
      "Auto-Shoot and No Recoil",
      "Camera Lock and Trigger Bot",
      "Anti-AFK + key-on-execute UI",
      "Works on Hydrogen, Delta, Wave, Solara",
    ],
    status: "in-development",
    faqs: [
      {
        q: "Is the Arsenal script free?",
        a: "Yes. Free with a 24-hour HWID key. Premium keys ($5 / 7 days) remove the daily refresh and unlock priority updates.",
      },
      {
        q: "Will the aimbot get me banned?",
        a: "Silent aim is the safest mode (no visible snap). Avoid lock-on aimbot in public servers if you want to stay clean.",
      },
      {
        q: "Does it work on mobile (Hydrogen / Delta Mobile)?",
        a: "Yes. The UI scales for mobile and all features work on Hydrogen Android.",
      },
      {
        q: "How fast do you patch after Arsenal updates?",
        a: "Usually within 4-12 hours. Drop schedule is Mon/Wed/Fri 18:00 UTC.",
      },
    ],
  },

  "pet-simulator": {
    slug: "pet-simulator",
    game: "Pet Simulator",
    keyword: "pet simulator script",
    volume: "110/mo",
    difficulty: "Easy (21/100)",
    title: "Pet Simulator Script — Auto Farm, Auto Hatch, Dupe Pets | ComboWick",
    metaDescription:
      "Free Pet Simulator 99 / X script with auto farm, auto hatch, auto break, pet dupe and best-area teleport. HWID-locked and patched daily.",
    h1: "Pet Simulator Script",
    intro:
      "Auto-farm coins, auto-hatch every egg in the game, auto-break boxes and teleport to the best area for your current pet rank. ComboWick's Pet Sim pack covers PS99, PSX and the legacy Pet Simulator games with one unified UI.",
    features: [
      "Auto Farm Coins (best zone selector)",
      "Auto Hatch (filters: rarity, exclusive, mythical)",
      "Auto Break Breakables",
      "Auto Open Chests and Lucky Blocks",
      "Pet Dupe and Trade Helpers",
      "Teleport to Best Area for Damage Tier",
      "Auto Quest and Auto Claim Rewards",
      "Anti-AFK + cloud-saved settings",
    ],
    status: "in-development",
    faqs: [
      {
        q: "Does this work on Pet Simulator 99?",
        a: "Yes — full PS99 support including the latest worlds, plus PSX and legacy Pet Sim games.",
      },
      {
        q: "Can I dupe pets safely?",
        a: "The dupe routine uses a side-server method. We can't guarantee zero risk, so dupe on alts only.",
      },
      {
        q: "Is it free?",
        a: "Yes. Free with a 24-hour HWID key. Premium ($5 / 7d, $9.99/mo, $49.99/lifetime) removes refresh and unlocks priority updates.",
      },
      {
        q: "Which executors work?",
        a: "Hydrogen, Delta, Wave, Solara, Xeno and any UNC-compliant executor.",
      },
    ],
  },

  "jurassic-blocky": {
    slug: "jurassic-blocky",
    game: "Jurassic Blocky",
    keyword: "jurassic blocky script",
    volume: "170/mo",
    difficulty: "Easy",
    title: "Jurassic Blocky Script — Auto Farm, Dino ESP, Auto Hunt | ComboWick",
    metaDescription:
      "Free Jurassic Blocky script with auto farm, dino ESP, auto-hunt, infinite stamina and resource teleport. HWID-locked and updated weekly.",
    h1: "Jurassic Blocky Script",
    intro:
      "The first proper Jurassic Blocky exploit pack — auto-hunt the big dinos, auto-craft, infinite stamina and full ESP for every dino spawn. ComboWick already ranks page 1 for Jurassic Blocky Discord — this is the script the community has been asking for.",
    features: [
      "Auto Farm XP and Resources",
      "Dino ESP — type, level, distance, health",
      "Auto-Hunt (target rare/legendary dinos)",
      "Infinite Stamina + Speed",
      "Auto-Craft Tools and Food",
      "Resource Teleport (wood, stone, iron)",
      "Anti-AFK + Auto-Reconnect",
      "Works on all major executors",
    ],
    status: "in-development",
    faqs: [
      {
        q: "When does the Jurassic Blocky script release?",
        a: "Active development. Join the Discord to be notified the moment it drops on the Mon/Wed/Fri 18:00 UTC schedule.",
      },
      {
        q: "Will it have key support?",
        a: "Yes — same HWID key flow as the rest of ComboWick. Free 24-hour keys, premium keys for no-refresh access.",
      },
      {
        q: "Does it work on mobile?",
        a: "Yes. Tested on Hydrogen Android and Delta Mobile.",
      },
      {
        q: "Where do I report bugs?",
        a: "Our Discord — linked in the footer. Bug reports are usually fixed within the next drop window.",
      },
    ],
  },
};

export const GAME_SLUGS = Object.keys(GAME_LANDINGS);
