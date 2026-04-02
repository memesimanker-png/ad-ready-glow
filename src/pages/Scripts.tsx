import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Key, Clock, Shield, Zap, ChevronRight } from "lucide-react";

const scripts = [
  { id: 1, name: "Prison Life", gameId: "155615604", description: "Escape prison instantly, speed boost, fly mode, ESP for guards and prisoners, auto-farm money, and teleport to locations.", features: ["Instant Escape", "Guard ESP", "Fly Mode", "Speed Boost", "Teleport"], category: "Action" },
  { id: 2, name: "[2X] FLASHPOINT", gameId: "13796645198", description: "Speed multiplier, kill aura, ESP for enemies, and instant reload for competitive edge.", features: ["Auto Aim", "Kill Aura", "ESP", "Speed Multiplier", "Instant Reload"], category: "FPS" },
  { id: 3, name: "Plants Vs Brainrots", gameId: "127742093697776", description: "Auto plant sunflowers, unlimited sun, instant kill all brainrots, god mode, freeze waves, and unlock all plants instantly.", features: ["Unlimited Sun", "God Mode", "Instant Kill", "Freeze Waves", "Auto Plant"], category: "Strategy" },
  { id: 4, name: "99 Nights in the Forest", gameId: "126509999114328", description: "Auto gather resources, infinite health, teleport between camps, fast build, and night skip mode.", features: ["Infinite Health", "Auto Gather", "Teleport", "Fast Build", "Night Skip"], category: "Survival" },
  { id: 5, name: "Anime Rails [Alpha]", gameId: "86494299160089", description: "Auto ride rails, infinite stamina, unlock all characters, speed boost, damage multiplier, and boss auto-farm.", features: ["Auto Ride", "Infinite Stamina", "Unlock Characters", "Damage Multiplier", "Boss Farm"], category: "Anime" },
  { id: 6, name: "[Dark Forest] Hunty Zombie", gameId: "95512431395349", description: "Zombie ESP, auto kill all zombies, infinite ammo, god mode, teleport to loot, and wave skipper.", features: ["Zombie ESP", "Auto Kill", "Infinite Ammo", "God Mode", "Wave Skip"], category: "Horror" },
  { id: 7, name: "Build A Plane", gameId: "137925884276740", description: "Instant plane build, unlimited parts, fly any plane, no gravity mode, and unlock all blueprints.", features: ["Instant Build", "Unlimited Parts", "Fly Mode", "No Gravity", "Unlock Blueprints"], category: "Simulator" },
  { id: 8, name: "Build My Car!", gameId: "128711871547209", description: "Auto build vehicles, unlimited money, unlock all parts, speed multiplier, and fly cars.", features: ["Auto Build", "Unlimited Money", "Unlock All Parts", "Fly Cars"], category: "Simulator" },
  { id: 9, name: "Sleepy Brainrots", gameId: "88116343972246", description: "Wake up brainrots instantly, auto collect rewards, infinite energy, teleport all areas, and unlock all skins.", features: ["Instant Wake", "Auto Collect", "Infinite Energy", "Teleport", "Unlock Skins"], category: "Simulator" },
  { id: 10, name: "Desert War [UPDATE]", gameId: "14741568638", description: "Auto aim, ESP for enemies, infinite bullets, god mode, vehicle spawner, and teleport to objectives.", features: ["Auto Aim", "ESP", "Infinite Bullets", "God Mode", "Vehicle Spawn"], category: "Action" },
  { id: 11, name: "[WEAPON WEDNESDAY] Hypershot", gameId: "131008473296170", description: "Aimbot, silent aim, no recoil, infinite ammo, rapid fire, and enemy ESP for competitive play.", features: ["Aimbot", "Silent Aim", "No Recoil", "Infinite Ammo", "Rapid Fire"], category: "FPS" },
  { id: 12, name: "Be Dino - Jurassic Dinosaur Simulation", gameId: "129907317028750", description: "Instant grow dinosaur, infinite health, speed boost, auto hunt prey, fly mode, and unlock all dinosaur species.", features: ["Instant Grow", "Infinite Health", "Speed Boost", "Auto Hunt", "Fly Mode"], category: "Simulation" },
  { id: 13, name: "[!] Train to be the Fastest", gameId: "96589898149075", description: "Auto train stats, instant max speed, infinite stamina, teleport to races, and unlock all gear.", features: ["Auto Train", "Max Speed", "Infinite Stamina", "Teleport", "Unlock Gear"], category: "Racing" },
  { id: 14, name: "Baseplate", gameId: "168556275", description: "Full sandbox control, noclip, fly mode, speed hack, teleport anywhere, and spawn any item.", features: ["Noclip", "Fly Mode", "Speed Hack", "Teleport", "Spawn Items"], category: "Sandbox" },
  { id: 15, name: "Bomb Chip", gameId: "82084053899394", description: "Auto defuse bombs, ESP for chips and players, infinite time, speed boost, and teleport to bomb locations.", features: ["Auto Defuse", "Chip ESP", "Infinite Time", "Speed Boost", "Teleport"], category: "Action" },
  { id: 16, name: "Gun Simulator", gameId: "124341151851732", description: "Infinite coins, auto click, unlock all guns, max damage multiplier, and auto prestige system.", features: ["Infinite Coins", "Auto Click", "Unlock All Guns", "Max Damage", "Auto Prestige"], category: "Simulator" },
  { id: 17, name: "Snow Shovel Battle", gameId: "127718588961610", description: "Auto shovel, infinite snowballs, speed boost, kill aura, ESP for opponents, and instant fort builder.", features: ["Auto Shovel", "Infinite Snowballs", "Kill Aura", "ESP", "Speed Boost"], category: "Battle" },
  { id: 18, name: "Drill Block Simulator!", gameId: "13722853585", description: "Auto drill blocks, infinite gems, speed multiplier, teleport to layers, unlock all drills, and auto sell resources.", features: ["Auto Drill", "Infinite Gems", "Speed Multiplier", "Teleport Layers", "Auto Sell"], category: "Simulator" },
];

const categoryColors: Record<string, string> = {
  Action: "bg-destructive/20 text-destructive border-destructive/40",
  FPS: "bg-warning/20 text-warning border-warning/40",
  Strategy: "bg-primary/20 text-primary border-primary/40",
  Survival: "bg-warning/20 text-warning border-warning/40",
  Anime: "bg-pink-500/20 text-pink-400 border-pink-500/40",
  Horror: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  Simulator: "bg-success/20 text-success border-success/40",
  Simulation: "bg-success/20 text-success border-success/40",
  Racing: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  Sandbox: "bg-muted text-muted-foreground border-border",
  Battle: "bg-indigo-500/20 text-indigo-400 border-indigo-500/40",
};

export default function Scripts() {
  return (
    <Layout>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-heading text-4xl font-bold mb-3">Roblox Scripts</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Free, daily-updated scripts for the most popular Roblox games. Compatible with all major executors on Mobile and PC.
            </p>
            <div className="flex items-center justify-center gap-6 mt-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated Daily</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> {scripts.length} Scripts</span>
              <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Mobile & PC</span>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Need a key to use these scripts?</p>
              <p className="text-muted-foreground text-sm">Get your free 24-hour access key in minutes.</p>
            </div>
            <Link to="/keys">
              <Button>
                <Key className="mr-2 h-4 w-4" />
                Get Free Key
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {scripts.map((script, index) => (
              <div key={script.id} className="bg-card border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-muted-foreground text-xs font-mono">#{index + 1}</span>
                      <h3 className="font-heading font-semibold truncate">{script.name}</h3>
                      <Badge variant="outline" className={categoryColors[script.category] || ""}>{script.category}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{script.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {script.features.map((f) => (
                        <span key={f} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground font-mono">ID: {script.gameId}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
