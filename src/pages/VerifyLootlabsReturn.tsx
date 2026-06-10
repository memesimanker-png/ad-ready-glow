import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { NoIndex } from "@/components/NoIndex";
import { supabase } from "@/integrations/supabase/client";

const APPROVED_DOMAINS = [
  "lootlabs.gg", "loot-link.com", "loot-links.com", "links.lootlabs.gg",
  "lootdest.org", "lootdest.com",
];
const BLOCKED_DOMAINS = [
  "link-bypass.com", "thebypasser.com", "bypass.city", "adbypass.org",
  "freebypass.com", "loot-bypass.com",
];
const NONCE_TTL_MS = 30 * 60 * 1000;

function extractDomain(url: string): string {
  try { const h = new URL(url).hostname.toLowerCase(); return h.startsWith("www.") ? h.slice(4) : h; } catch { return ""; }
}
const isApproved = (d: string) => APPROVED_DOMAINS.some((a) => d === a || d.endsWith(`.${a}`));
const isBlocked = (d: string) => BLOCKED_DOMAINS.some((b) => d === b || d.endsWith(`.${b}`));

export default function VerifyLootlabsReturn() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("Validating verification…");

  useEffect(() => {
    const hash = params.get("hash");
    if (!hash) {
      navigate("/blocked?reason=missing_params&redirect=/verify/provider-select", { replace: true });
      return;
    }

    const pendingRaw = localStorage.getItem("verify_lootlabs_pending");
    let pending: { nonce: string; ts: number } | null = null;
    try { pending = pendingRaw ? JSON.parse(pendingRaw) : null; } catch { /* noop */ }

    if (!pending || pending.nonce !== hash) {
      navigate("/blocked?reason=suspicious_activity&redirect=/verify/provider-select", { replace: true });
      return;
    }
    if (Date.now() - pending.ts > NONCE_TTL_MS) {
      localStorage.removeItem("verify_lootlabs_pending");
      navigate("/blocked?reason=session_expired&redirect=/verify/provider-select", { replace: true });
      return;
    }

    const refDomain = extractDomain(document.referrer);
    if (isBlocked(refDomain) || !refDomain || !isApproved(refDomain)) {
      navigate("/blocked?reason=suspicious_activity&redirect=/verify/provider-select", { replace: true });
      return;
    }

    localStorage.removeItem("verify_lootlabs_pending");

    (async () => {
      // How many LootLabs hops are required (admin-configurable).
      let required = 1;
      try {
        const { data } = await supabase.from("verify_settings").select("lootlabs_clicks").eq("id", 1).maybeSingle();
        if (data?.lootlabs_clicks) required = data.lootlabs_clicks;
      } catch { /* default 1 */ }

      const done = Number(localStorage.getItem("lootlabs_done_count") || "0") + 1;
      localStorage.setItem("lootlabs_done_count", String(done));

      if (done < required) {
        setDone(true);
        setMsg(`Step ${done} of ${required} complete. Continuing…`);
        toast({ title: "Step Complete", description: `Step ${done} of ${required} done.` });
        setTimeout(() => navigate("/verify/provider-select?ll=1", { replace: true }), 800);
        return;
      }

      localStorage.removeItem("lootlabs_done_count");
      localStorage.setItem("step1_completed", "true");
      localStorage.setItem("step2_completed", "true");
      localStorage.setItem("step3_completed", "true");
      localStorage.removeItem("verification_step");

      setDone(true);
      setMsg("Verification complete. Issuing token…");
      toast({ title: "Verification Successful", description: "Redirecting to access key…" });

      try {
        const { data, error } = await supabase.functions.invoke("issue-verify-token", { body: {} });
        if (!error && data?.success && data?.token) {
          localStorage.setItem("verify_token", JSON.stringify({ token: data.token, expires_at: data.expires_at }));
        } else {
          console.warn("[VerifyLootlabsReturn] issue-verify-token failed", error || data);
        }
      } catch (e) {
        console.warn("[VerifyLootlabsReturn] issue-verify-token error", e);
      } finally {
        setTimeout(() => navigate("/access-key", { replace: true }), 800);
      }
    })();
  }, [params, navigate, toast]);

  return (
    <div className="min-h-screen bg-black/70 flex flex-col">
      <NoIndex />
      <header className="container py-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">ComboWick Verify</h1>
        </div>
      </header>
      <main className="flex-1 container flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verification</CardTitle>
            <CardDescription>Finalizing your access…</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              {done ? <CheckCircle className="h-16 w-16 text-green-500" /> : <Loader2 className="h-12 w-12 text-primary animate-spin" />}
              <p className="mt-4 text-center text-muted-foreground">{msg}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
