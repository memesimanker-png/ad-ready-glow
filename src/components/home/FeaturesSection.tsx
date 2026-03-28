import { Card } from "@/components/ui/card";
import { Shield, Zap, Lock, HeadphonesIcon, Award, TrendingUp } from "lucide-react";

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
    title: "Growing Community",
    description: "We're building a trusted community of Roblox enthusiasts, developers, and content creators who rely on ComboWick for their account needs.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Why Gamers Choose ComboWick
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
  );
}
