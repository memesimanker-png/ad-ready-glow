import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Key, Shield, Zap, Check, Clock, Star,
  ChevronDown, ChevronUp, Unlock, RefreshCw, Award, MessageCircle
} from "lucide-react";
import { useState } from "react";
import { VideoBackground } from "@/components/VideoBackground";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "7-Day Trial",
    price: "$5",
    originalPrice: null,
    discount: null,
    period: "",
    duration: "7 Days Full Access",
    color: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    bgColor: "bg-yellow-500/5",
    features: [
      { icon: "zap", text: "7 Days Full Access" },
      { icon: "circle", text: "Instant Activation" },
      { icon: "check", text: "Great for Trying Out" },
    ],
    buttonText: "Purchase Now",
    buttonStyle: "bg-primary hover:bg-primary/90",
    popular: false,
    paypalType: "onetime" as const,
    paypalAmount: "5.00",
  },
  {
    name: "Monthly Access",
    price: "$9.99",
    originalPrice: "$20",
    discount: "20% OFF",
    period: "",
    duration: "30 Days Access",
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/5",
    features: [
      { icon: "zap", text: "30 Days Access" },
      { icon: "circle", text: "Priority Support" },
      { icon: "check", text: "Premium Support" },
    ],
    buttonText: "Choose Payment Option",
    buttonStyle: "bg-green-600 hover:bg-green-700",
    popular: true,
    paypalType: "subscription" as const,
    paypalAmount: "9.99",
    subscribeText: "Subscribe & Save $2!",
    subscribeSubtext: "$8 /month with subscription",
  },
  {
    name: "Lifetime Key",
    price: "$49.99",
    originalPrice: null,
    discount: null,
    period: "",
    duration: "Lifetime Access",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/5",
    features: [
      { icon: "zap", text: "Lifetime Access" },
      { icon: "circle", text: "VIP Priority Support" },
      { icon: "check", text: "Premium Support" },
    ],
    buttonText: "Purchase Now",
    buttonStyle: "bg-red-600 hover:bg-red-700",
    popular: false,
    paypalType: "onetime" as const,
    paypalAmount: "49.99",
  },
  {
    name: "Custom Script Request",
    price: null,
    originalPrice: null,
    discount: null,
    period: "",
    duration: "",
    color: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    bgColor: "bg-yellow-500/5",
    features: [
      { icon: "zap", text: "Contact on Discord" },
      { icon: "circle", text: "Custom script tailored to your needs" },
      { icon: "check", text: "Professional support" },
    ],
    buttonText: "Contact on Discord",
    buttonStyle: "bg-yellow-600 hover:bg-yellow-700",
    popular: false,
    paypalType: null,
    paypalAmount: null,
    isDiscord: true,
  },
];

function FeatureIcon({ type }: { type: string }) {
  if (type === "zap") return <Zap className="h-4 w-4 text-primary flex-shrink-0" />;
  if (type === "circle") return <div className="h-4 w-4 rounded-full border-2 border-orange-400 flex-shrink-0" />;
  return <Check className="h-4 w-4 text-success flex-shrink-0" />;
}

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
  const handlePurchase = (tier: typeof tiers[0]) => {
    if (tier.isDiscord) {
      window.open("https://discord.com/invite/ufrz9Zaqs8", "_blank");
      return;
    }
    // Redirect to PayPal checkout via the external shop
    window.location.href = `https://combooo-wickshop.vercel.app/?plan=${tier.name.toLowerCase().replace(/\s+/g, '-')}&amount=${tier.paypalAmount}`;
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <VideoBackground overlay />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Key className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Premium Features</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4 max-w-4xl mx-auto">
              <span className="text-gradient-primary">Premium Keys</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant access to premium features
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className={`p-6 h-full flex flex-col card-neon ${tier.borderColor}`}>
                  <div className="text-center mb-6">
                    <h3 className={`font-heading text-sm font-bold uppercase tracking-wider mb-4 ${tier.color}`}>
                      {tier.name}
                    </h3>
                    {tier.price ? (
                      <>
                        {tier.originalPrice && (
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-lg text-muted-foreground line-through">{tier.originalPrice}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400">{tier.discount}</span>
                          </div>
                        )}
                        <div className="text-4xl font-bold mb-1">{tier.price}</div>
                        <p className="text-sm text-muted-foreground">Premium Key</p>
                      </>
                    ) : (
                      <div className="py-4" />
                    )}
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f.text} className="flex items-center gap-3 text-sm">
                        <FeatureIcon type={f.icon} />
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.subscribeText && (
                    <div className="text-center mb-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm font-semibold text-accent">{tier.subscribeText}</p>
                      <p className="text-xs text-muted-foreground">{tier.subscribeSubtext}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => handlePurchase(tier)}
                    className={`w-full py-5 font-bold ${tier.buttonStyle}`}
                  >
                    {tier.isDiscord && <MessageCircle className="h-4 w-4 mr-2" />}
                    {tier.buttonText}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Are Premium Keys */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">What Are Premium Keys?</h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
            Premium Keys are unique activation codes that unlock enhanced features on the ComboWick platform. When you purchase a Premium Key, it's generated instantly and tied to your account.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Unlock, title: "Early Access to New Products", desc: "Premium members get first access to new account batches and product launches before they're available to the general public." },
              { icon: Zap, title: "Priority Queue Processing", desc: "Your orders are processed with priority during high-demand periods. Premium members always get instant delivery." },
              { icon: Shield, title: "Extended Replacement Warranty", desc: "Premium members receive an extended 30-day replacement warranty on all purchased accounts." },
              { icon: RefreshCw, title: "Auto-Renewal & Notifications", desc: "Monthly subscribers can enable auto-renewal. You'll also receive email notifications about restocks and sales." },
              { icon: Award, title: "VIP Discord Channel", desc: "Lifetime and Monthly members get access to an exclusive VIP Discord channel with direct access to our team." },
              { icon: Star, title: "Loyalty Rewards Program", desc: "Monthly subscribers receive a 10% loyalty discount after 3 consecutive months, increasing to 15% after 6 months." },
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

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-muted/20">
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
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Premium Keys FAQ</h2>
          <div className="space-y-3">
            <FAQItem q="Can I upgrade from a Trial to Monthly or Lifetime?" a="Yes! You can upgrade at any time from your dashboard. If you upgrade during an active trial, the remaining trial days are credited proportionally toward your new plan." />
            <FAQItem q="What happens when my Premium Key expires?" a="When your key expires, you'll revert to a free account. Your purchase history, account credentials, and dashboard data remain intact — you just lose access to premium features." />
            <FAQItem q="Can I use my Premium Key on multiple devices?" a="It depends on your plan. The 7-Day Trial allows activation on a single device. Monthly Access supports up to 3 devices simultaneously. Lifetime Access provides unlimited device activations." />
            <FAQItem q="Is there a refund policy for Premium Keys?" a="Yes. If you're unsatisfied with your Premium Key purchase, you can request a refund within 24 hours of purchase, provided the key hasn't been extensively used. Contact our support team on Discord." />
            <FAQItem q="Do Premium Keys work with all ComboWick products?" a="Premium Keys enhance your entire ComboWick experience. The benefits apply across all products — Roblox accounts, future product launches, and platform features." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Upgrade to Premium Today</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start with a 7-day trial for just $5 and experience the full range of premium benefits. No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-primary/20">
                <MessageCircle className="h-5 w-5 mr-2" /> Join Discord
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
