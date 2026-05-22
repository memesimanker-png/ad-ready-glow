import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Monitor, Smartphone, Apple, ExternalLink, MessageCircle, ShoppingCart, RefreshCw, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";

type Executor = {
  _id: string;
  title: string;
  version?: string;
  updatedDate?: string;
  uncStatus?: boolean;
  free?: boolean;
  detected?: boolean;
  rbxversion?: string | false;
  updateStatus?: boolean;
  websitelink?: string;
  discordlink?: string;
  purchaselink?: string;
  platform?: string;
  uncPercentage?: number;
  suncPercentage?: number;
  decompiler?: boolean;
  multiInject?: boolean;
  clientmods?: boolean;
  keysystem?: boolean;
  cost?: string | number;
  hidden?: boolean;
  beta?: boolean;
  slug?: { logo?: string; owner?: string };
};

const CACHE_KEY = "executors-online-cache-v1";
const CACHE_TTL = 30_000; // 30s client cache
const POLL_INTERVAL = 60_000; // never poll faster than 60s

function PlatformIcon({ p }: { p: string }) {
  const key = p.trim().toLowerCase();
  if (key.includes("ios") || key.includes("mac")) return <Apple className="h-3.5 w-3.5" aria-label={p} />;
  if (key.includes("android")) return <Smartphone className="h-3.5 w-3.5" aria-label={p} />;
  return <Monitor className="h-3.5 w-3.5" aria-label={p} />;
}

function UncBar({ value, label }: { value: number; label: string }) {
  const color = value >= 95 ? "bg-success" : value >= 80 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground w-10 shrink-0">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-1.5 max-w-24">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <span className="text-muted-foreground w-9 text-right">{value}%</span>
    </div>
  );
}

export default function Executors() {
  const { t } = useTranslation();
  const [executors, setExecutors] = useState<Executor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const load = async (force = false) => {
    // client cache
    if (!force) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { fetchedAt: number; data: Executor[] };
          if (Date.now() - parsed.fetchedAt < CACHE_TTL) {
            setExecutors(parsed.data);
            setFetchedAt(parsed.fetchedAt);
            setLoading(false);
            return;
          }
        }
      } catch { /* ignore */ }
    }
    try {
      const { data, error: fnError } = await supabase.functions.invoke("executors-online");
      if (fnError) throw fnError;
      if (!data?.ok || !Array.isArray(data.data)) {
        throw new Error(data?.error || "Invalid response");
      }
      const list = data.data as Executor[];
      setExecutors(list);
      setFetchedAt(data.fetchedAt || Date.now());
      setError(null);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data: list }));
      } catch { /* ignore */ }
    } catch (e: any) {
      setError(e?.message || "Failed to load executors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(() => load(true), POLL_INTERVAL);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(
    () => executors.filter((e) => showHidden || !e.hidden),
    [executors, showHidden],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Executor[]>();
    for (const e of visible) {
      const platforms = (e.platform || "Unknown").split(",").map((p) => p.trim()).filter(Boolean);
      const primary = platforms[0] || "Unknown";
      if (!map.has(primary)) map.set(primary, []);
      map.get(primary)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [visible]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Live Roblox Executors Status",
    description: "Live list of Roblox script executors with working status, UNC/SUNC scores and platform support, powered by executors.online.",
    numberOfItems: visible.length,
    itemListElement: visible.slice(0, 50).map((exec, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: exec.title,
        operatingSystem: exec.platform || "Unknown",
        applicationCategory: "GameApplication",
        softwareVersion: exec.version || undefined,
      },
    })),
  }), [visible]);

  return (
    <Layout>
      <SEOHead
        title="Live Roblox Executors Status 2026 — Working/Patched | ComboWick"
        description="Real-time Roblox executor status: working vs patched, UNC/SUNC scores, detection state and platform support. Live data from executors.online."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Executors", url: "/executors" },
        ]}
        jsonLd={jsonLd}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl font-bold mb-3">{t("Roblox Executors")}</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Live working/patched status, UNC & SUNC scores and detection state for every major Roblox executor — updated continuously.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5 text-xs">
              <Button size="sm" variant="outline" onClick={() => load(true)} disabled={loading} className="h-8">
                <RefreshCw className={`h-3 w-3 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <label className="flex items-center gap-1.5 text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} className="h-3.5 w-3.5 accent-primary" />
                Show hidden
              </label>
              {fetchedAt && (
                <span className="text-muted-foreground">
                  Updated {Math.max(0, Math.round((Date.now() - fetchedAt) / 1000))}s ago
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Couldn't reach the live status feed.</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
            </div>
          )}

          {loading && executors.length === 0 ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-card border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : (
            groups.map(([platform, list]) => (
              <div key={platform} className="mb-10">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2 mb-4">
                  <PlatformIcon p={platform} /> {platform}
                  <span className="text-sm font-normal text-muted-foreground">({list.length})</span>
                </h2>
                <div className="space-y-2">
                  {list.map((exec) => {
                    const working = exec.updateStatus === true;
                    const detected = exec.detected === true;
                    const platforms = (exec.platform || "").split(",").map((p) => p.trim()).filter(Boolean);
                    return (
                      <div key={exec._id} className="bg-card border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {exec.slug?.logo && (
                                <img src={exec.slug.logo} alt="" loading="lazy" className="h-6 w-6 rounded" />
                              )}
                              <h3 className="font-semibold truncate">{exec.title}</h3>
                              {exec.version && (
                                <span className="text-xs text-muted-foreground">v{exec.version.replace(/^v/i, "")}</span>
                              )}
                              <Badge variant="outline" className={working ? "bg-success/20 text-success border-success/40" : "bg-destructive/20 text-destructive border-destructive/40"}>
                                {working ? "Working" : "Patched / Updating"}
                              </Badge>
                              <Badge variant="outline" className={detected ? "bg-destructive/20 text-destructive border-destructive/40" : "bg-success/20 text-success border-success/40"}>
                                {detected ? "Detected" : "Undetected"}
                              </Badge>
                              {exec.free === true && (
                                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40">Free</Badge>
                              )}
                              {exec.beta && (
                                <Badge variant="outline" className="bg-warning/20 text-warning border-warning/40">Beta</Badge>
                              )}
                              {exec.keysystem && (
                                <Badge variant="outline" className="bg-warning/20 text-warning border-warning/40">Key</Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {platforms.map((p) => (
                                <span key={p} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                  <PlatformIcon p={p} /> {p}
                                </span>
                              ))}
                              {exec.decompiler && <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Decompiler</span>}
                              {exec.multiInject && <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Multi-Inject</span>}
                              {exec.clientmods && <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Client Mods</span>}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>Roblox: {exec.rbxversion && exec.rbxversion !== false ? exec.rbxversion : "Unknown"}</span>
                              {exec.cost != null && exec.cost !== "" && !exec.free && (
                                <span>· Cost: {String(exec.cost)}</span>
                              )}
                              {exec.updatedDate && <span>· {exec.updatedDate}</span>}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {exec.websitelink && (
                                <a href={exec.websitelink} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-primary/40 text-primary hover:bg-primary/10 transition">
                                  <ExternalLink className="h-3 w-3" /> Website
                                </a>
                              )}
                              {exec.discordlink && (
                                <a href={exec.discordlink} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-border hover:border-primary/40 hover:text-primary transition">
                                  <MessageCircle className="h-3 w-3" /> Discord
                                </a>
                              )}
                              {exec.purchaselink && (
                                <a href={exec.purchaselink} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-border hover:border-primary/40 hover:text-primary transition">
                                  <ShoppingCart className="h-3 w-3" /> Purchase
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="w-full sm:w-44 shrink-0 space-y-1.5">
                            {typeof exec.uncPercentage === "number" && <UncBar value={exec.uncPercentage} label="UNC" />}
                            {typeof exec.suncPercentage === "number" && <UncBar value={exec.suncPercentage} label="SUNC" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <Shield className="inline h-3 w-3 mr-1" />
            Live data powered by{" "}
            <a href="https://executors.online" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              executors.online
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
