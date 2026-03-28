import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const packages = [
  { size: 25, price: 6, perAccount: "0.24", label: "Starter", popular: false },
  { size: 50, price: 11, perAccount: "0.22", label: "Popular", popular: true },
  { size: 100, price: 20, perAccount: "0.20", label: "Pro", popular: false },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Choose Your Package
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            All packages include verified accounts with instant automated delivery. Larger packages offer better per-account value.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg) => (
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
                  Best Value
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">{pkg.label}</h3>
                <div className="text-4xl font-bold mb-1">${pkg.price}</div>
                <p className="text-sm text-muted-foreground">{pkg.size} Accounts • ${pkg.perAccount}/account</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Verified accounts</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Instant delivery</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> PayPal buyer protection</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Dashboard access</li>
                {pkg.size >= 50 && <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Bulk discount applied</li>}
                {pkg.size >= 100 && <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Priority support</li>}
              </ul>
              <Link to="/login">
                <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                  Purchase Now
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
