import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield, Zap, Users, Check, Star, ChevronDown, ChevronUp,
  Lock, HeadphonesIcon, Award, TrendingUp
} from "lucide-react";
import { useState } from "react";

const packages = [
  { size: 25, price: 6, perAccount: "0.24", label: "Starter", popular: false },
  { size: 50, price: 11, perAccount: "0.22", label: "Popular", popular: true },
  { size: 100, price: 20, perAccount: "0.20", label: "Pro", popular: false },
];

const features = [
  {
    icon: Shield,
    title: "Verified & Secure Accounts",
    description: "Every Roblox account is manually verified before listing. We ensure authenticity, proper age verification, and working credentials so you can start using them immediately.",
  },
  {
    icon: Zap,
    title: "Instant Automated Delivery",
    description: "No waiting around. Once your PayPal payment confirms, your account credentials are delivered to your dashboard automatically within seconds.",
  },
  {
    icon: Lock,
    title: "Encrypted & Safe Payments",
    description: "All transactions are processed through PayPal with SSL encryption. We never store your credit card details — your financial data stays completely private.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Discord Support",
    description: "Our dedicated support team is available around the clock on Discord. Whether you have questions before purchasing or need help after, we're always here.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "We stand behind every account we sell. If an account doesn't match its description, our team will resolve the issue promptly and fairly.",
  },
  {
    icon: TrendingUp,
    title: "Trusted by 10,000+ Customers",
    description: "Since 2024, we've served over ten thousand satisfied customers worldwide with a 4.8/5 average rating. Our track record speaks for itself.",
  },
];

const faqs = [
  {
    q: "What are Roblox accounts used for?",
    a: "Roblox accounts can be used for game development testing, creating multiple game servers, building and testing experiences across different account types, or simply having backup accounts. Many developers and content creators need multiple accounts for their workflow.",
  },
  {
    q: "How does the delivery process work?",
    a: "After completing payment through PayPal, your accounts are automatically delivered to your ComboWick dashboard. Simply log in, navigate to your purchases, and you'll find the account credentials ready to use. The entire process typically takes less than 60 seconds.",
  },
  {
    q: "Are these accounts safe and legitimate?",
    a: "Yes. Every account is verified before listing. We ensure all accounts have valid email addresses and working credentials. We recommend changing the password immediately after receiving your accounts for maximum security.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept PayPal, which supports credit cards, debit cards, bank transfers, and PayPal balance. PayPal's buyer protection covers all transactions, giving you peace of mind with every purchase.",
  },
  {
    q: "Do you offer bulk discounts?",
    a: "Yes! Our pricing is structured to reward larger purchases. The 50-account package saves you 8% per account compared to the starter, and the 100-account package saves you 17% per account. For custom bulk orders exceeding 100 accounts, contact us on Discord.",
  },
  {
    q: "What if I have issues with a purchased account?",
    a: "Our support team on Discord is available 24/7. If any account doesn't work as described, we'll replace it or resolve the issue immediately. Customer satisfaction is our top priority.",
  },
  {
    q: "Can I purchase without creating an account?",
    a: "While guest checkout is available, we strongly recommend creating a free ComboWick account. It allows you to access your purchase history, manage credentials, and receive support more efficiently.",
  },
];

const testimonials = [
  { name: "Alex R.", role: "Game Developer", text: "Needed 100 test accounts for my Roblox game. ComboWick delivered all of them instantly. Saved me hours of work. Highly recommended!", rating: 5 },
  { name: "Sarah M.", role: "Content Creator", text: "I've been using ComboWick for months now. The accounts are always verified and work perfectly. Their Discord support is incredibly fast.", rating: 5 },
  { name: "Marcus J.", role: "Studio Owner", text: "Best value I've found online. The bulk pricing makes it perfect for our studio. Delivery is genuinely instant — not marketing fluff.", rating: 5 },
  { name: "Emily K.", role: "Roblox Enthusiast", text: "Was skeptical at first, but ComboWick proved me wrong. PayPal protection plus instant delivery. Can't ask for more than that.", rating: 5 },
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
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/warrior-bg.png')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-success uppercase tracking-wider">Available Now • Instant Delivery</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Premium Verified{" "}
            <span className="text-gradient-primary">Roblox Accounts</span>{" "}
            Delivered Instantly
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Join 10,000+ satisfied customers. Get verified Roblox accounts starting at just $0.20 per account with secure PayPal payments and automated instant delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing">
              <Button size="lg" className="text-base px-8 py-6">
                View Packages
              </Button>
            </a>
            <Link to="/about">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Why Gamers Trust ComboWick
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We've built our platform around security, speed, and customer satisfaction — the three pillars every gamer deserves.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 bg-glass hover:border-primary/30 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
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
                    Most Popular
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

      {/* Testimonials */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Real reviews from real customers who trust ComboWick for their Roblox needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 bg-glass">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Getting your verified Roblox accounts is simple. Three steps and you're ready to go.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Choose Your Package", desc: "Select from our Starter, Popular, or Pro packages based on how many verified accounts you need." },
              { step: "2", title: "Complete Payment", desc: "Pay securely through PayPal. We accept credit cards, debit cards, and PayPal balance. All transactions are protected." },
              { step: "3", title: "Access Your Accounts", desc: "Credentials are delivered instantly to your dashboard. Log in, copy your account details, and start using them right away." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about buying Roblox accounts from ComboWick.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers. Create your account today and get instant access to verified Roblox accounts at the best prices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing">
              <Button size="lg" className="text-base px-8 py-6">Browse Packages</Button>
            </a>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">Read Our Guides</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
