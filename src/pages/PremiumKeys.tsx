import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Key, Shield, Zap, Check, Clock, Star,
  ChevronDown, ChevronUp, Unlock, RefreshCw, Award
} from "lucide-react";
import { useState } from "react";

const tiers = [
  {
    name: "7-Day Trial",
    price: "$2.99",
    duration: "7 days",
    features: ["Full premium feature access", "Standard support", "Single device activation", "Manual renewal"],
    popular: false,
  },
  {
    name: "Monthly Access",
    price: "$7.99",
    period: "/month",
    duration: "30 days",
    features: ["Full premium feature access", "Priority Discord support", "Up to 3 device activations", "Auto-renewal option", "10% loyalty discount after 3 months"],
    popular: true,
  },
  {
    name: "Lifetime Access",
    price: "$24.99",
    duration: "Forever",
    features: ["Full premium feature access", "VIP Discord support channel", "Unlimited device activations", "Never expires", "Free future feature updates", "Early access to new products"],
    popular: false,
  },
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

export default function PremiumKeys() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Key className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Premium Features</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Unlock <span className="text-gradient-primary">Premium Keys</span> for Enhanced Access
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            ComboWick Premium Keys give you enhanced access to exclusive features, priority support, and special perks across our platform. Choose from a 7-day trial, monthly subscription, or one-time lifetime purchase. Every key is generated instantly and delivered to your dashboard.
          </p>
        </div>
      </section>

      {/* What Are Premium Keys */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">What Are Premium Keys?</h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
            Premium Keys are unique activation codes that unlock enhanced features on the ComboWick platform. When you purchase a Premium Key, it's generated instantly and tied to your account. Here's what you get access to:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Unlock, title: "Early Access to New Products", desc: "Premium members get first access to new account batches and product launches before they're available to the general public. Never miss a restock again." },
              { icon: Zap, title: "Priority Queue Processing", desc: "Your orders are processed with priority during high-demand periods. While free users may experience brief delays during peak times, Premium members always get instant delivery." },
              { icon: Shield, title: "Extended Replacement Warranty", desc: "Premium members receive an extended 30-day replacement warranty on all purchased accounts, compared to the standard 7-day window for free users." },
              { icon: RefreshCw, title: "Auto-Renewal & Notifications", desc: "Monthly subscribers can enable auto-renewal to never lose access. You'll also receive email notifications about restocks, sales, and new product announcements." },
              { icon: Award, title: "VIP Discord Channel", desc: "Lifetime and Monthly members get access to an exclusive VIP Discord channel with direct access to our team, exclusive giveaways, and a community of verified buyers." },
              { icon: Star, title: "Loyalty Rewards Program", desc: "The longer you stay premium, the better it gets. Monthly subscribers receive a 10% loyalty discount after 3 consecutive months, increasing to 15% after 6 months." },
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

      {/* Pricing Tiers */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">Choose Your Premium Plan</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
            Start with a 7-day trial or go straight to Monthly or Lifetime. All plans include the same premium features — the only difference is duration and value.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`p-6 sm:p-8 relative transition-all duration-300 ${
                  tier.popular
                    ? "border-primary/50 bg-primary/5 animate-glow scale-105"
                    : "bg-glass hover:border-primary/30"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                    Best Value
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold mb-1">
                    {tier.price}
                    {tier.period && <span className="text-lg text-muted-foreground">{tier.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" /> {tier.duration}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login">
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                    Get {tier.name}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">How Premium Keys Work</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Choose a Plan", desc: "Select the Premium plan that best fits your needs — Trial, Monthly, or Lifetime." },
              { step: "2", title: "Complete Payment", desc: "Pay securely through PayPal. All transactions are encrypted and covered by buyer protection." },
              { step: "3", title: "Receive Your Key", desc: "Your unique Premium Key is generated instantly and appears in your ComboWick dashboard." },
              { step: "4", title: "Enjoy Benefits", desc: "Your premium features activate immediately. Access VIP channels, priority support, and more." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-lg font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-heading text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Premium Keys FAQ</h2>
          <div className="space-y-3">
            <FAQItem
              q="Can I upgrade from a Trial to Monthly or Lifetime?"
              a="Yes! You can upgrade at any time from your dashboard. If you upgrade during an active trial, the remaining trial days are credited proportionally toward your new plan. Many customers start with the 7-day trial to experience premium features before committing to a longer plan."
            />
            <FAQItem
              q="What happens when my Premium Key expires?"
              a="When your key expires, you'll revert to a free account. Your purchase history, account credentials, and dashboard data remain intact — you just lose access to premium features like priority support, VIP channels, and extended warranties. You can renew at any time to restore premium access."
            />
            <FAQItem
              q="Can I use my Premium Key on multiple devices?"
              a="It depends on your plan. The 7-Day Trial allows activation on a single device. Monthly Access supports up to 3 devices simultaneously. Lifetime Access provides unlimited device activations. Your key is tied to your ComboWick account, so simply log in on any device to activate."
            />
            <FAQItem
              q="Is there a refund policy for Premium Keys?"
              a="Yes. If you're unsatisfied with your Premium Key purchase, you can request a refund within 24 hours of purchase, provided the key hasn't been extensively used. Contact our support team on Discord for refund processing. Full details are in our Refund Policy page."
            />
            <FAQItem
              q="Do Premium Keys work with all ComboWick products?"
              a="Premium Keys enhance your entire ComboWick experience. The benefits apply across all products — Roblox accounts, future product launches, and platform features. Premium members get priority access and extended warranties on everything we sell."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Upgrade to Premium Today</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start with a 7-day trial for just $2.99 and experience the full range of premium benefits. No commitment required.
          </p>
          <Link to="/login">
            <Button size="lg" className="text-base px-8 py-6">Get Started</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
