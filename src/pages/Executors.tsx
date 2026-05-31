import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Monitor, Smartphone, Apple, ExternalLink, MessageCircle, ShoppingCart, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
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
  elementCertified?: boolean;
  longestRunning?: boolean;
  hasIssues?: boolean;
  slug?: { logo?: string; owner?: string } | string;
};

type InjectVersions = {
  Windows?: { Version: string; Date: string };
  Macintosh?: { Version: string; Date: string };
};

type InjectCheat = {
  Identifier?: string;
  Name?: string;
  Tags?: Record<string, { Rank?: string; Parent?: string }>;
  Attributes?: Record<string, { Score?: number; Type?: string; Access?: string; PricingModel?: string[]; ReleaseDate?: string }>;
  Cost?: Record<string, string>;
  Links?: Record<string, { Discord?: string; Purchase?: string; Website?: string }>;
  Platforms?: Record<string, {
    Detection?: { Raw?: number; Readable?: string; Tracked?: boolean };
    Versions?: { Software?: string | null; Roblox?: string | null };
  }>;
};

const CACHE_KEY = "executors-online-cache-v2";
const CACHE_TTL = 30_000;
const POLL_INTERVAL = 60_000;

function cacheLogo(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.includes("wsrv.nl")) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=80&h=80&fit=cover&output=webp&q=82&maxage=1y`;
}

function parseExecutorDate(value?: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/\s+at\s+/i, " ").replace(/\s+UTC$/i, " UTC");
  const direct = new Date(cleaned).getTime();
  if (!Number.isNaN(direct)) return direct;
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+at\s+(\d{1,2}):(\d{2})\s*(AM|PM)\s*UTC$/i);
  if (!match) return null;
  const [, month, day, year, hourRaw, minute, period] = match;
  let hour = Number(hourRaw) % 12;
  if (period.toUpperCase() === "PM") hour += 12;
  return Date.UTC(Number(year), Number(month) - 1, Number(day), hour, Number(minute));
}

function normalizeExternalUrl(url?: string): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(discord\.gg|www\.|[a-z0-9-]+\.)/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function formatRelative(ts: number, now: number): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function formatAbsolute(ts: number): string {
  try {
    return new Date(ts).toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  } catch { return new Date(ts).toString(); }
}

function ExecutorUpdated({ value }: { value?: string }) {
  const ts = parseExecutorDate(value);
  if (!ts) return <span className="text-[10px] text-muted-foreground">Updated Unknown</span>;
  return (
    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
      Updated <span className="text-foreground">{formatRelative(ts, Date.now())}</span> <span className="opacity-80">{formatAbsolute(ts)}</span>
    </span>
  );
}

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

const FAQS = [
  {
    q: "What is the best Roblox executor in 2026?",
    a: "The 'best' executor changes weekly because Roblox patches frequently. Right now, top community picks include Delta, Solara, Xeno, Codex and Wave on Windows, and Delta and Hydrogen on iOS/Mac. The live table above shows real-time UNC/SUNC scores and Working vs Patched status from executors.online and inject.today, so you can always see which one is actually working today.",
  },
  {
    q: "Are Roblox executors safe to use?",
    a: "Reputable executors (Delta, Solara, Xeno, Codex, Wave) don't contain malware, but Roblox can issue account bans for using them. Use an alt account, never run executors as admin, and only download from the official website or Discord links shown in the table — most malware spreads through fake YouTube downloads.",
  },
  {
    q: "What does UNC and SUNC mean for Roblox executors?",
    a: "UNC (Unified Naming Convention) and SUNC (Secure UNC) are standardized benchmarks that measure how many script functions an executor supports. 95%+ UNC means almost every public script will run; below 80% means many modern scripts will silently fail.",
  },
  {
    q: "What Roblox executors work on Mac / iOS / Android?",
    a: "Delta is the most popular cross-platform executor with native iOS, Android and Mac builds. Hydrogen is another solid Mac/iOS option. Windows still has the widest ecosystem (Solara, Xeno, Codex, Wave, Severe, Volt).",
  },
  {
    q: "Why is my executor showing as Patched?",
    a: "Roblox pushes a new client version every few weeks. When the executor's last update is older than the current Roblox version (shown in the banner above), it's almost certainly patched and you need to wait for the developer to push an update.",
  },
  {
    q: "Where do I get free working scripts to use with my executor?",
    a: "Pair any executor on this page with our free script hub — every script lists the games it works in and the executors it's been tested with. Start at /scripts or browse the featured games on the homepage.",
  },
];

export default function Executors() {
  const { t } = useTranslation();
  const [executors, setExecutors] = useState<Executor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const [versions, setVersions] = useState<InjectVersions | null>(null);
  const [cheats, setCheats] = useState<Record<string, InjectCheat> | null>(null);

  const load = async (force = false) => {
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
      if (!data?.ok || !Array.isArray(data.data)) throw new Error(data?.error || "Invalid response");
      const list = data.data as Executor[];
      setExecutors(list);
      setFetchedAt(data.fetchedAt || Date.now());
      setError(null);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data: list })); } catch { /* ignore */ }
    } catch (e: any) {
      setError(e?.message || "Failed to load executors");
    } finally {
      setLoading(false);
    }
  };

  const loadInject = async () => {
    try {
      const base = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/inject-today`;
      const [v, c] = await Promise.all([
        fetch(`${base}?part=versions`).then((r) => r.json()).catch(() => null),
        fetch(`${base}?part=cheats`).then((r) => r.json()).catch(() => null),
      ]);
      if (v?.ok) setVersions(v.data as InjectVersions);
      if (c?.ok) setCheats(c.data as Record<string, InjectCheat>);
    } catch { /* optional section */ }
  };

  useEffect(() => {
    load();
    loadInject();
    const id = setInterval(() => load(true), POLL_INTERVAL);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 20_000);
    return () => clearInterval(id);
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

  // Inject.Today entries not already covered by executors.online (dedupe by lowercased title)
  const injectExtras = useMemo(() => {
    if (!cheats) return [] as Array<{ name: string; cheat: InjectCheat }>;
    const existing = new Set(executors.map((e) => e.title.toLowerCase().trim()));
    return Object.entries(cheats)
      .map(([name, cheat]) => ({ name, cheat }))
      .filter(({ name, cheat }) => {
        const display = (cheat.Name || name).toLowerCase().trim();
        if (existing.has(display)) return false;
        // only show Windows-rank Reputable+ to keep noise down
        const rank = cheat.Tags?.Windows?.Rank?.toLowerCase() || "";
        return rank === "reputable" || rank === "trusted" || rank === "verified";
      })
      .sort((a, b) => (b.cheat.Attributes?.Windows?.Score ?? 0) - (a.cheat.Attributes?.Windows?.Score ?? 0))
      .slice(0, 24);
  }, [cheats, executors]);

  const jsonLd = useMemo(() => {
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Live Roblox Executors Status 2026",
      description: "Live list of Roblox script executors with working status, UNC/SUNC scores and platform support. Includes Delta, Solara, Xeno, Codex, Wave and more.",
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
    };
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return [itemList, faq];
  }, [visible]);

  return (
    <Layout>
      <SEOHead
        title="Roblox Executors List 2026 — Delta, Solara, Xeno, Codex Working Status | ComboWick"
        description="Live Roblox executor list: Delta, Solara, Xeno, Codex, Wave, Hydrogen & more. Real-time working/patched status, UNC & SUNC scores, free vs paid, Windows / Mac / iOS / Android. Updated every minute."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Executors", url: "/executors" },
        ]}
        jsonLd={jsonLd}
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">
              {t("Roblox Executors List")} <span className="text-primary">2026</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Live working/patched status, UNC & SUNC scores and detection state for every major Roblox executor —
              <strong className="text-foreground"> Delta, Solara, Xeno, Codex, Wave, Hydrogen, Severe</strong> and more.
              Updated every minute from executors.online and inject.today.
            </p>

            {/* Current Roblox version banner */}
            {versions && (
              <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-xs">
                <span className="font-heading uppercase tracking-wider text-primary">Current Roblox</span>
                {versions.Windows && (
                  <span className="inline-flex items-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5" />
                    <code className="text-foreground">{versions.Windows.Version}</code>
                  </span>
                )}
                {versions.Macintosh && (
                  <span className="inline-flex items-center gap-1.5">
                    <Apple className="h-3.5 w-3.5" />
                    <code className="text-foreground">{versions.Macintosh.Version}</code>
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-5 text-xs flex-wrap">
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
                  Feed refreshed {formatRelative(fetchedAt, Date.now())}
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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-[156px] rounded-md bg-card border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : (
            groups.map(([platform, list]) => (
              <div key={platform} className="mb-8">
                <h2 className="font-heading text-sm uppercase tracking-wider text-primary flex items-center gap-2 mb-3 border-b border-border/40 pb-2">
                  <PlatformIcon p={platform} /> {platform} {t("Roblox Executors")}
                  <span className="text-xs font-normal text-muted-foreground">({list.length})</span>
                </h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((exec) => {
                    const working = exec.updateStatus === true;
                    const detected = exec.detected === true;
                    const website = normalizeExternalUrl(exec.websitelink);
                    const discord = normalizeExternalUrl(exec.discordlink);
                    const purchase = normalizeExternalUrl(exec.purchaselink);
                    return (
                      <article key={exec._id} className="min-w-0 rounded-md border border-border/50 bg-card p-2.5 text-xs transition-colors hover:border-primary/40 [transform:translateZ(0)]">
                        <div className="mb-2 flex min-w-0 items-start gap-2">
                          {exec.slug?.logo ? (
                            <img
                              src={cacheLogo(exec.slug.logo)}
                              alt={`${exec.title} Roblox executor logo`}
                              loading="lazy"
                              decoding="async"
                              width={34}
                              height={34}
                              referrerPolicy="no-referrer"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                              className="h-8 w-8 shrink-0 rounded object-cover bg-muted"
                            />
                          ) : (
                            <div className="h-8 w-8 shrink-0 rounded bg-muted" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <h3 className="min-w-0 truncate text-sm font-semibold leading-tight">{exec.title}</h3>
                              {exec.version && <span className="shrink-0 text-[10px] text-muted-foreground">v{exec.version.replace(/^v/i, "")}</span>}
                            </div>
                            <ExecutorUpdated value={exec.updatedDate} />
                          </div>
                        </div>

                        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] text-muted-foreground">
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${working ? "bg-success" : "bg-destructive"}`} />
                          <span className={working ? "text-success" : "text-destructive"}>{working ? "Working" : "Patched"}</span>
                          <span>·</span>
                          <span className={detected ? "text-destructive" : "text-success"}>{detected ? "Detected" : "Undetected"}</span>
                          <span>·</span>
                          {exec.free ? (
                            <span className="rounded-sm bg-success/15 px-1.5 py-px font-semibold text-success">Free</span>
                          ) : (
                            <span className="rounded-sm bg-primary/15 px-1.5 py-px font-semibold text-primary">
                              Paid{exec.cost ? ` · ${String(exec.cost)}` : ""}
                            </span>
                          )}
                          {exec.keysystem && <><span>·</span><span className="text-warning">Key</span></>}
                        </div>

                        {(typeof exec.uncPercentage === "number" || typeof exec.suncPercentage === "number") && (
                          <div className="mb-2 space-y-1">
                            {typeof exec.uncPercentage === "number" && <UncBar value={exec.uncPercentage} label="UNC" />}
                            {typeof exec.suncPercentage === "number" && <UncBar value={exec.suncPercentage} label="SUNC" />}
                          </div>
                        )}

                        <div className="flex min-w-0 items-center justify-between gap-2 border-t border-border/30 pt-2">
                          <span className="min-w-0 truncate text-[10px] text-muted-foreground">
                            RBX {exec.rbxversion ? String(exec.rbxversion) : "Unknown"}
                          </span>
                          <div className="flex shrink-0 items-center gap-1">
                            {website && (
                              <a href={website} target="_blank" rel="noopener noreferrer" title="Website" className="inline-flex h-6 w-6 items-center justify-center rounded border border-primary/40 text-primary hover:bg-primary/10">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {discord && (
                              <a href={discord} target="_blank" rel="noopener noreferrer" title="Discord" className="inline-flex h-6 w-6 items-center justify-center rounded border border-border hover:border-primary/40 hover:text-primary">
                                <MessageCircle className="h-3 w-3" />
                              </a>
                            )}
                            {purchase && (
                              <a href={purchase} target="_blank" rel="noopener noreferrer" title="Purchase" className="inline-flex h-6 w-6 items-center justify-center rounded border border-border hover:border-primary/40 hover:text-primary">
                                <ShoppingCart className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Inject.Today extras */}
          {injectExtras.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-sm uppercase tracking-wider text-primary flex items-center gap-2 mb-3 border-b border-border/40 pb-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> More Reputable Roblox Cheats
                <span className="text-xs font-normal text-muted-foreground">via inject.today ({injectExtras.length})</span>
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {injectExtras.map(({ name, cheat }) => {
                  const display = cheat.Name || name;
                  const winAttr = cheat.Attributes?.Windows;
                  const winPlat = cheat.Platforms?.Windows;
                  const winLinks = cheat.Links?.Windows;
                  const cost = cheat.Cost?.Windows || winAttr?.PricingModel?.join(", ") || "—";
                  const det = winPlat?.Detection?.Readable;
                  const detTracked = winPlat?.Detection?.Tracked;
                  const score = winAttr?.Score;
                  return (
                    <article key={name} className="min-w-0 rounded-md border border-border/50 bg-card p-2.5 text-xs hover:border-primary/40">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold">{display}</h3>
                        {typeof score === "number" && (
                          <span className="shrink-0 text-[10px] font-mono text-primary">{score}/100</span>
                        )}
                      </div>
                      <div className="mb-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-muted-foreground">
                        <Monitor className="h-3 w-3" />
                        {winAttr?.Type && <span>{winAttr.Type}</span>}
                        {winAttr?.Access && <><span>·</span><span>{winAttr.Access}</span></>}
                        {winAttr?.ReleaseDate && <><span>·</span><span>Since {winAttr.ReleaseDate}</span></>}
                      </div>
                      {det && (
                        <div className="mb-1.5 text-[10px]">
                          <span className="text-muted-foreground">Detection: </span>
                          <span className={detTracked ? (det.toLowerCase().includes("undetected") ? "text-success" : "text-warning") : "text-muted-foreground"}>{det}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-1.5">
                        <span className="truncate text-[10px] text-muted-foreground">{cost}</span>
                        <div className="flex shrink-0 items-center gap-1">
                          {winLinks?.Website && (
                            <a href={normalizeExternalUrl(winLinks.Website)} target="_blank" rel="noopener noreferrer" title="Website" className="inline-flex h-6 w-6 items-center justify-center rounded border border-primary/40 text-primary hover:bg-primary/10">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {winLinks?.Discord && (
                            <a href={normalizeExternalUrl(winLinks.Discord)} target="_blank" rel="noopener noreferrer" title="Discord" className="inline-flex h-6 w-6 items-center justify-center rounded border border-border hover:border-primary/40 hover:text-primary">
                              <MessageCircle className="h-3 w-3" />
                            </a>
                          )}
                          {winLinks?.Purchase && (
                            <a href={normalizeExternalUrl(winLinks.Purchase)} target="_blank" rel="noopener noreferrer" title="Purchase" className="inline-flex h-6 w-6 items-center justify-center rounded border border-border hover:border-primary/40 hover:text-primary">
                              <ShoppingCart className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEO long-form content */}
          <div className="mt-10 max-w-3xl mx-auto space-y-8 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                What is a Roblox executor?
              </h2>
              <p>
                A Roblox executor is a script-running tool that lets you inject Lua code into Roblox games — automating
                farming, unlocking abilities, exploring maps and running community scripts. Most modern executors
                (Delta, Solara, Xeno, Codex, Wave) target a 95%+ <strong className="text-foreground">UNC/SUNC</strong>
                score, which is the industry benchmark for how many script functions they fully support.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                Best Roblox executors right now
              </h2>
              <p className="mb-2">
                Roblox patches frequently, so the "best executor" rotates. Use the live table above to see which ones
                are currently <span className="text-success font-semibold">Working</span> versus
                <span className="text-destructive font-semibold"> Patched</span>. Community staples in 2026:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong className="text-foreground">Delta</strong> — Free, cross-platform (Windows / iOS / Android / Mac), key system.</li>
                <li><strong className="text-foreground">Solara</strong> — Free Windows executor, native UI, fast updates.</li>
                <li><strong className="text-foreground">Xeno</strong> — Free open-source Windows executor with strong UNC.</li>
                <li><strong className="text-foreground">Codex</strong> — Popular free mobile executor (Android / iOS).</li>
                <li><strong className="text-foreground">Wave</strong> — Paid Windows option with custom DLL and stable updates.</li>
                <li><strong className="text-foreground">Hydrogen</strong> — Free Mac/iOS executor with good script compatibility.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                FAQ — Roblox Executors
              </h2>
              <div className="space-y-4">
                {FAQS.map((f) => (
                  <div key={f.q}>
                    <h3 className="text-foreground font-semibold mb-1">{f.q}</h3>
                    <p className="text-sm">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <Shield className="inline h-3 w-3 mr-1" />
            Live data powered by{" "}
            <a href="https://executors.online" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">executors.online</a>
            {" "}and{" "}
            <a href="https://inject.today" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">inject.today</a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
