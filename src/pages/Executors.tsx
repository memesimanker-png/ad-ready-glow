import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Shield, Monitor, Smartphone } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

type Executor = {
  name: string;
  platform: "Windows" | "Android" | "iOS" | "Mac";
  type: "Free" | "Paid" | "Free (Key)";
  unc?: number;
  sunc?: number;
  features: string[];
  category: "Internal" | "External";
};

const executors: Executor[] = [
  { name: "Velocity", platform: "Windows", type: "Free", unc: 99, sunc: 94, features: ["Decompiler", "Multi-Instance", "Client Mod Bypass"], category: "Internal" },
  { name: "Xeno", platform: "Windows", type: "Free", unc: 82, sunc: 32, features: ["Decompiler", "Multi-Instance", "Client Mod Bypass"], category: "Internal" },
  { name: "Solara", platform: "Windows", type: "Free", unc: 67, sunc: 39, features: ["Decompiler", "Multi-Instance", "Client Mod Bypass"], category: "Internal" },
  { name: "Bunni.fun", platform: "Windows", type: "Free (Key)", unc: 99, sunc: 100, features: ["Decompiler", "Key System"], category: "Internal" },
  { name: "Potassium", platform: "Windows", type: "Paid", unc: 99, sunc: 100, features: ["Decompiler", "Multi-Instance", "Client Mod Bypass"], category: "Internal" },
  { name: "Wave", platform: "Windows", type: "Paid", unc: 99, sunc: 100, features: ["Decompiler", "Multi-Instance", "Client Mod Bypass"], category: "Internal" },
  { name: "Synapse Z", platform: "Windows", type: "Paid", unc: 99, sunc: 97, features: ["Decompiler", "Multi-Instance"], category: "Internal" },
  { name: "DX9WARE V2", platform: "Windows", type: "Paid", features: [], category: "External" },
  { name: "Photon", platform: "Windows", type: "Paid", features: [], category: "External" },
  { name: "Matrix Hub", platform: "Windows", type: "Paid", features: [], category: "External" },
  { name: "Codex", platform: "Android", type: "Free", unc: 98, sunc: 96, features: ["Decompiler"], category: "Internal" },
  { name: "Cryptic", platform: "Android", type: "Free (Key)", unc: 98, sunc: 97, features: ["Decompiler", "Key System"], category: "Internal" },
  { name: "Delta", platform: "Android", type: "Free (Key)", unc: 99, sunc: 100, features: ["Decompiler", "Key System"], category: "Internal" },
  { name: "Vega X", platform: "Android", type: "Free (Key)", unc: 98, sunc: 98, features: ["Decompiler", "Key System"], category: "Internal" },
  { name: "Delta", platform: "iOS", type: "Free (Key)", unc: 99, sunc: 100, features: ["Decompiler", "Key System"], category: "Internal" },
  { name: "Hydrogen", platform: "Mac", type: "Free (Key)", unc: 99, sunc: 90, features: ["Decompiler", "Key System"], category: "Internal" },
  { name: "MacSploit", platform: "Mac", type: "Paid", unc: 99, sunc: 100, features: ["Decompiler", "Multi-Instance", "Client Mod Bypass"], category: "Internal" },
  { name: "Opiumware", platform: "Mac", type: "Free", unc: 99, sunc: 100, features: ["Decompiler", "Multi-Instance"], category: "Internal" },
];

const typeColors: Record<string, string> = {
  Free: "bg-success/20 text-success border-success/40",
  Paid: "bg-destructive/20 text-destructive border-destructive/40",
  "Free (Key)": "bg-warning/20 text-warning border-warning/40",
};

const categoryColors: Record<string, string> = {
  Internal: "bg-primary/20 text-primary border-primary/40",
  External: "bg-purple-500/20 text-purple-400 border-purple-500/40",
};

function UncBar({ value, label }: { value: number; label: string }) {
  const color = value >= 95 ? "bg-success" : value >= 80 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground w-10 shrink-0">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-1.5 max-w-24">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-muted-foreground w-8 text-right">{value}%</span>
    </div>
  );
}

export default function Executors() {
  const { t } = useTranslation();

  const platformGroups = [
    { label: "Windows", platform: "Windows" as const, icon: <Monitor className="h-4 w-4" /> },
    { label: "Android", platform: "Android" as const, icon: <Smartphone className="h-4 w-4" /> },
    { label: "iOS", platform: "iOS" as const, icon: <Smartphone className="h-4 w-4" /> },
    { label: "Mac", platform: "Mac" as const, icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <Layout>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-heading text-4xl font-bold mb-3">{t("Roblox Executors")}</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              {t("executors_subtitle")}
            </p>
            <div className="flex items-center justify-center gap-6 mt-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> {executors.length} {t("Executors")}</span>
              <span className="flex items-center gap-1"><Monitor className="h-3 w-3" /> Windows</span>
              <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> Android & iOS</span>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-lg p-4 mb-8">
            <p className="text-muted-foreground text-xs mb-3 font-semibold uppercase tracking-wider">{t("Legend")}</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={typeColors["Free"]}>{t("Free")}</Badge>
                <span className="text-muted-foreground">{t("No cost")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={typeColors["Free (Key)"]}>{t("Free (Key)")}</Badge>
                <span className="text-muted-foreground">{t("Requires key system")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={typeColors["Paid"]}>{t("Paid")}</Badge>
                <span className="text-muted-foreground">{t("Requires purchase")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={categoryColors["Internal"]}>{t("Internal")}</Badge>
                <span className="text-muted-foreground">{t("Injects into process")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={categoryColors["External"]}>{t("External")}</Badge>
                <span className="text-muted-foreground">{t("Runs externally")}</span>
              </div>
            </div>
          </div>

          {platformGroups.map((group) => {
            const platformExecutors = executors.filter((e) => e.platform === group.platform);
            if (platformExecutors.length === 0) return null;
            return (
              <div key={group.platform} className="mb-10">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2 mb-4">
                  {group.icon} {group.label}
                  <span className="text-sm font-normal text-muted-foreground">({platformExecutors.length})</span>
                </h2>
                <div className="space-y-2">
                  {platformExecutors.map((exec, i) => (
                    <div key={`${exec.name}-${i}`} className="bg-card border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{exec.name}</h3>
                            <Badge variant="outline" className={typeColors[exec.type]}>{t(exec.type)}</Badge>
                            <Badge variant="outline" className={categoryColors[exec.category]}>{t(exec.category)}</Badge>
                          </div>
                          {exec.features.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {exec.features.map((f) => (
                                <span key={f} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{t(f)}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="w-40 shrink-0 space-y-1">
                          {exec.unc !== undefined && <UncBar value={exec.unc} label="UNC" />}
                          {exec.sunc !== undefined && <UncBar value={exec.sunc} label="SUNC" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
