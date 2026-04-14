import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, XCircle, Copy, Check, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type KeyPurchase = {
  id: string;
  payment_id: string;
  tier: string;
  key_generated: string;
  amount: number;
  status: string;
  expires_at: string;
  created_at: string;
};

const tierNames: Record<string, string> = {
  "trial-7day": "7-Day Trial",
  monthly: "Monthly Access",
  lifetime: "Lifetime Access",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [keys, setKeys] = useState<KeyPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      setUser(data.user);
      supabase
        .from("premium_key_purchases")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .then(({ data: purchases }) => {
          setKeys((purchases as KeyPurchase[]) || []);
          setLoading(false);
        });
    });
  }, []);

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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
            <p className="text-muted-foreground mb-6">Sign in to view your purchased premium keys.</p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Sign In
            </Button>
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
            <p className="text-muted-foreground">Manage your premium keys and purchases</p>
          </div>

          <div className="flex items-center gap-3 mb-8 p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm">{user.email}</span>
          </div>

          <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Premium Keys ({keys.length})
          </h2>

          {keys.length === 0 ? (
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
                  <Card
                    key={purchase.id}
                    className={`p-6 transition-all hover:shadow-lg ${
                      isExpired ? "border-red-500/20" : "border-primary/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <Key className={`h-5 w-5 ${isExpired ? "text-red-500" : "text-primary"}`} />
                          <div>
                            <h3 className="font-bold text-lg">{tierNames[purchase.tier] || purchase.tier}</h3>
                            <div className="flex items-center gap-2 text-sm">
                              {isExpired ? (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="text-red-500 font-medium">Expired</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                  <span className="text-green-500 font-medium">Active</span>
                                </>
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyKey(purchase.key_generated, purchase.id)}
                      >
                        {copied === purchase.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
