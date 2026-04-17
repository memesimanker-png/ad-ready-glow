import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield, Zap, Check, Lock, HeadphonesIcon,
  ChevronDown, ChevronUp, Download, Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AccountsCheckoutModal } from "@/components/AccountsCheckoutModal";

const packages = [
  { size: 50, price: 11, perAccount: "0.22", label: "Popular", popular: true },
  { size: 100, price: 20, perAccount: "0.20", label: "Pro", popular: false },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors rounded-lg"
      >
        <span className="font-medium pr-4">{q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function RobloxAccounts() {
  const [selected, setSelected] = useState<typeof packages[number] | null>(null);
  const [paypalClientId, setPaypalClientId] = useState<string>("");
  const [stock, setStock] = useState<Record<number, number>>({});

  useEffect(() => {
    supabase.functions.invoke("paypal-config").then(({ data }) => {
      if (data?.client_id) setPaypalClientId(data.client_id);
    });

    // Live stock counts via public RPC
    Promise.all(
      packages.map(p =>
        supabase.rpc("get_account_stock", { _package_size: p.size })
      )
    ).then(results => {
      const map: Record<number, number> = {};
      results.forEach((r, i) => { map[packages[i].size] = (r.data as number) ?? 0; });
      setStock(map);
    });
  }, []);

  return (
    <Layout>
      <section className="py-16 sm:py-20 bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-success uppercase tracking-wider">In Stock • Instant Delivery</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Verified <span className="text-gradient-primary">Roblox Accounts</span> in Bulk
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            ComboWick provides verified, ready-to-use Roblox accounts. Pay with PayPal and your accounts are delivered instantly to your dashboard.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">What's Included</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">Every account goes through a rigorous verification process.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Manual Verification", desc: "Each account is individually checked to ensure credentials work correctly and the account isn't flagged." },
              { icon: Zap, title: "Instant Delivery", desc: "Automated delivery to your dashboard within seconds of payment confirmation." },
              { icon: Lock, title: "Secure Storage", desc: "Credentials stored securely in your dashboard. We recommend changing passwords immediately." },
              { icon: Download, title: "Bulk Export", desc: "Download all credentials as a formatted text file directly from your dashboard." },
              { icon: Eye, title: "Full Transparency", desc: "View each account's username and password in your dashboard." },
              { icon: HeadphonesIcon, title: "24/7 Support", desc: "Discord support team available around the clock for replacements or issues." },
            ].map((item) => (
              <Card key={item.title} className="p-6 bg-glass hover:border-primary/30 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">Account Packages & Pricing</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
            All packages include verified accounts with instant delivery to your dashboard.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {packages.map((pkg) => {
              const remaining = stock[pkg.size];
              const inStock = remaining === undefined || remaining >= pkg.size;
              return (
                <Card
                  key={pkg.size}
                  className={`p-6 sm:p-8 relative transition-all duration-300 ${
                    pkg.popular
                      ? "border-primary/50 bg-primary/5 animate-glow scale-105"
                      : "bg-glass hover:border-primary/30"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">{pkg.label}</h3>
                    <div className="text-4xl font-bold mb-1">${pkg.price}</div>
                    <p className="text-sm text-muted-foreground">{pkg.size} Accounts • ${pkg.perAccount}/account</p>
                    {remaining !== undefined && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        {inStock ? `${remaining} accounts in stock` : `Only ${remaining} left — out of stock for full pack`}
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Verified accounts</li>
                    <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Instant dashboard delivery</li>
                    <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> PayPal buyer protection</li>
                    <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Bulk export from dashboard</li>
                    {pkg.size >= 100 && <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Priority support</li>}
                  </ul>
                  <Button
                    className="w-full"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => setSelected(pkg)}
                    disabled={!inStock || !paypalClientId}
                  >
                    {!paypalClientId ? "Loading…" : !inStock ? "Out of Stock" : "Purchase Now"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-3">
            <FAQItem q="What do I receive after purchasing?" a="Account credentials (username and password) delivered directly to the Accounts tab in your dashboard. Each account has a verified email and working login." />
            <FAQItem q="How long does delivery take?" a="Delivery is fully automated and happens within seconds of payment confirmation — your accounts will appear in your dashboard immediately." />
            <FAQItem q="Do I need an account to purchase?" a="Yes — you must be signed in so we can deliver the accounts to your dashboard. If you don't have an account yet, we'll prompt you to sign up." />
            <FAQItem q="What if an account doesn't work?" a="Contact our 24/7 Discord support team for a replacement or resolution." />
            <FAQItem q="Do you offer custom bulk orders?" a="Yes. For orders exceeding 100 accounts, contact us through Discord for custom pricing." />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8">Browse our packages and get started today.</p>
          <a href="#pricing">
            <Button size="lg" className="text-base px-8 py-6">View Packages</Button>
          </a>
        </div>
      </section>

      {selected && paypalClientId && (
        <AccountsCheckoutModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          pkg={selected}
          paypalClientId={paypalClientId}
        />
      )}
    </Layout>
  );
}
