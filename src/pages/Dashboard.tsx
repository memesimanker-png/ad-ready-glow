import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Key, XCircle, Copy, Check, LogIn, User2, Download, Eye, EyeOff, Crown, Sparkles, Zap, ShieldCheck, Mail, Link2, AlertCircle, LifeBuoy, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type KeyPurchase = {
  id: string;
  payment_id: string;
  tier: string;
  key_generated: string;
  amount: number;
  status: string;
  expires_at: string;
  created_at: string;
  user_id: string | null;
  customer_email: string | null;
};

type RobloxAccount = {
  id: string;
  username: string;
  password: string;
  package_size: number;
  claimed_at: string;
};

const tierNames: Record<string, string> = {
  "trial-7day": "7-Day Trial",
  monthly: "Monthly Access",
  lifetime: "Lifetime Access",
};

type BadgeInfo = {
  label: string;
  icon: typeof Crown;
  className: string;
};

// Highest tier wins (lifetime > monthly > trial). Only counts non-expired keys.
function getUserBadge(keys: KeyPurchase[], accountsCount: number): BadgeInfo | null {
  const now = Date.now();
  const active = keys.filter(k => !k.expires_at || new Date(k.expires_at).getTime() > now);
  if (active.some(k => k.tier === "lifetime")) {
    return { label: "Lifetime Member", icon: Crown, className: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40" };
  }
  if (active.some(k => k.tier === "monthly")) {
    return { label: "Monthly Subscriber", icon: Sparkles, className: "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/40" };
  }
  if (active.some(k => k.tier === "trial-7day")) {
    return { label: "Trial Member", icon: Zap, className: "bg-success/15 text-success border-success/40" };
  }
  if (accountsCount > 0) {
    return { label: "Verified Buyer", icon: ShieldCheck, className: "bg-secondary text-secondary-foreground border-border" };
  }
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [keys, setKeys] = useState<KeyPurchase[]>([]);
  const [accounts, setAccounts] = useState<RobloxAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<"keys" | "accounts">("keys");
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({ paypalEmail: "", orderId: "", message: "" });
  const [supportSubmitting, setSupportSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return; }
      setUser(data.user);
      const email = (data.user.email || "").toLowerCase();

      // Query by user_id OR matching customer_email (covers guest checkouts that
      // didn't capture a user_id but used the same email as the buyer's account).
      const keysQuery = email
        ? supabase
            .from("premium_key_purchases")
            .select("*")
            .or(`user_id.eq.${data.user.id},customer_email.eq.${email}`)
            .order("created_at", { ascending: false })
        : supabase
            .from("premium_key_purchases")
            .select("*")
            .eq("user_id", data.user.id)
            .order("created_at", { ascending: false });

      const [keysRes, accountsRes] = await Promise.all([
        keysQuery,
        supabase.from("roblox_accounts").select("id,username,password,package_size,claimed_at").eq("claimed_by", data.user.id).order("claimed_at", { ascending: false }),
      ]);

      // Dedupe by id in case a row matches both filters
      const rawKeys = (keysRes.data as KeyPurchase[]) || [];
      const seen = new Set<string>();
      const uniqKeys = rawKeys.filter(k => (seen.has(k.id) ? false : (seen.add(k.id), true)));

      setKeys(uniqKeys);
      setAccounts((accountsRes.data as RobloxAccount[]) || []);
      setLoading(false);
    });
  }, []);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const exportAccounts = () => {
    const txt = accounts.map(a => `${a.username}:${a.password}`).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `combowick-accounts-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const submitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.paypalEmail.trim()) {
      toast({ title: "Missing PayPal email", description: "Please enter the email address shown on your PayPal receipt.", variant: "destructive" });
      return;
    }
    setSupportSubmitting(true);
    const subject = `[Missing Key Support] ${supportForm.paypalEmail}`;
    const body =
`A buyer needs help locating their purchase.

Account email: ${user?.email || "unknown"}
PayPal receipt email: ${supportForm.paypalEmail}
PayPal Order/Transaction ID: ${supportForm.orderId || "(not provided)"}
Message: ${supportForm.message || "(none)"}

— Sent from /dashboard support form`;

    // Best-effort: open email client AND Discord invite so the buyer reaches us either way.
    const mailto = `mailto:support@combowick.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_self");
    setTimeout(() => {
      window.open("https://discord.com/invite/ufrz9Zaqs8", "_blank", "noopener,noreferrer");
      toast({
        title: "Support request prepared",
        description: "Email draft opened + Discord invite launched. We respond fastest in Discord.",
      });
      setSupportSubmitting(false);
      setSupportOpen(false);
      setSupportForm({ paypalEmail: "", orderId: "", message: "" });
    }, 400);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">Sign in to view your purchased premium keys and Roblox accounts.</p>
            <Button onClick={() => navigate("/login")} className="w-full">Sign In</Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your premium keys and Roblox accounts</p>
          </div>

          {(() => {
            const badge = getUserBadge(keys, accounts.length);
            const Icon = badge?.icon;
            return (
              <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-muted/30 border border-border/50 flex-wrap">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium">{user.email}</span>
                {badge && Icon && (
                  <Badge variant="outline" className={`gap-1.5 px-2.5 py-1 text-xs font-semibold ${badge.className}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {badge.label}
                  </Badge>
                )}
              </div>
            );
          })()}

          {/* Purchase link status — explains how each key was matched to this account */}
          {keys.length > 0 && (() => {
            const emailLower = (user.email || "").toLowerCase();
            const linkedById = keys.filter(k => k.user_id === user.id).length;
            const linkedByEmail = keys.filter(
              k => k.user_id !== user.id && (k.customer_email || "").toLowerCase() === emailLower
            ).length;
            return (
              <Card className="p-4 mb-6 border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <Link2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1">Purchase Link Status</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {linkedById > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-success/15 text-success border border-success/30">
                          <Check className="h-3 w-3" /> {linkedById} linked to your account
                        </span>
                      )}
                      {linkedByEmail > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/15 text-primary border border-primary/30">
                          <Mail className="h-3 w-3" /> {linkedByEmail} matched by email
                        </span>
                      )}
                    </div>
                    {linkedByEmail > 0 && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        These keys were purchased as a guest using <span className="font-mono text-foreground">{user.email}</span> and have been automatically attached to your account.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })()}

          {/* Missing keys helper — for visitors arriving from a PayPal email with the wrong account */}
          {keys.length === 0 && (
            <Card className="p-5 mb-6 border-warning/30 bg-warning/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">Don't see a key you paid for?</p>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    If you got a PayPal receipt but no key shows here, your purchase was likely made as a guest with a different email.
                    Sign in with the <span className="font-semibold text-foreground">same email address</span> shown on your PayPal receipt — your key will appear instantly.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Currently signed in as: <span className="font-mono text-foreground">{user.email}</span>
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Button size="sm" variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>
                      Sign in with different email
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">Contact support</a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setTab("keys")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "keys" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <Key className="h-4 w-4" /> Premium Keys ({keys.length})
            </button>
            <button
              onClick={() => setTab("accounts")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "accounts" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <User2 className="h-4 w-4" /> Roblox Accounts ({accounts.length})
            </button>
          </div>

          {tab === "keys" && (
            keys.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Key className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">No Premium Keys Yet</p>
                <p className="text-muted-foreground mb-6">Purchase a premium key to get started</p>
                <Button onClick={() => navigate("/premium-keys")}>Browse Premium Keys</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {keys.map((purchase) => {
                  const isExpired = new Date(purchase.expires_at) < new Date();
                  return (
                    <Card key={purchase.id} className={`p-6 transition-all hover:shadow-lg ${isExpired ? "border-destructive/20" : "border-primary/20"}`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <Key className={`h-5 w-5 ${isExpired ? "text-destructive" : "text-primary"}`} />
                            <div>
                              <h3 className="font-bold text-lg">{tierNames[purchase.tier] || purchase.tier}</h3>
                              <div className="flex items-center gap-2 text-sm">
                                {isExpired ? (
                                  <><XCircle className="h-4 w-4 text-destructive" /><span className="text-destructive font-medium">Expired</span></>
                                ) : (
                                  <><div className="w-2 h-2 bg-success rounded-full animate-pulse" /><span className="text-success font-medium">Active</span></>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="bg-background/50 p-4 rounded-lg mb-3 border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">License Key:</p>
                            <code className="text-sm font-mono break-all font-semibold">{purchase.key_generated}</code>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Purchased: {new Date(purchase.created_at).toLocaleDateString()}</span>
                            <span>Expires: {new Date(purchase.expires_at).toLocaleDateString()}</span>
                            <span>${purchase.amount}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyText(purchase.key_generated, purchase.id)}>
                          {copied === purchase.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )
          )}

          {tab === "accounts" && (
            accounts.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <User2 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">No Roblox Accounts Yet</p>
                <p className="text-muted-foreground mb-6">Purchase an account package to get started</p>
                <Button onClick={() => navigate("/accounts")}>Browse Account Packages</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{accounts.length} accounts delivered</p>
                  <Button variant="outline" size="sm" onClick={exportAccounts}>
                    <Download className="h-4 w-4 mr-2" /> Export as .txt
                  </Button>
                </div>
                <div className="grid gap-3">
                  {accounts.map((acc) => {
                    const visible = !!showPwd[acc.id];
                    return (
                      <Card key={acc.id} className="p-4 border-primary/20">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Pkg {acc.package_size}</span>
                              <span className="text-xs text-muted-foreground">Delivered {new Date(acc.claimed_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                              <code className="text-sm font-mono font-semibold">{acc.username}</code>
                              <code className="text-xs font-mono text-muted-foreground break-all">
                                {visible ? acc.password : "•".repeat(Math.min(16, acc.password.length))}
                              </code>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setShowPwd(p => ({ ...p, [acc.id]: !p[acc.id] }))} title={visible ? "Hide password" : "Show password"}>
                              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => copyText(acc.username, `u-${acc.id}`)} title="Copy username">
                              {copied === `u-${acc.id}` ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => copyText(acc.password, `p-${acc.id}`)} title="Copy password">
                              {copied === `p-${acc.id}` ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </Layout>
  );
}
