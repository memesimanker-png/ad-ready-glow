import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Award, Heart, Target, Globe, Clock, Users } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              About <span className="text-gradient-primary">ComboWick</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A marketplace for premium Roblox accounts and game keys, built by gamers who understand what you need.
            </p>
          </div>

          <Card className="p-8 bg-glass mb-8">
            <div className="flex items-start gap-4">
              <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-heading text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At ComboWick, we're dedicated to providing gamers with instant access to premium Roblox accounts and game keys through a secure, transparent platform. We believe every gamer deserves a hassle-free experience when purchasing digital assets, which is why we've built our service around three core principles: <strong>security, speed, and customer satisfaction</strong>.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  ComboWick started as a small project to help Roblox developers who needed test accounts for their games. We saw a gap in the market — most sellers were unreliable, slow, or unsafe. So we built something better: a platform with verified accounts, instant automated delivery, and proper PayPal buyer protection on every transaction.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-glass mb-8">
            <h2 className="font-heading text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ComboWick is run by a small team of Roblox enthusiasts and web developers. We're active members of the Roblox community ourselves — we play the games, follow the updates, and understand the ecosystem. This firsthand experience shapes how we source, verify, and deliver accounts.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our blog content is written by our team members who have genuine experience with Roblox development, trading, and the broader gaming ecosystem. We focus on creating guides and resources that actually help players, not just filler content.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We're based online with team members across different time zones, which is why we can offer round-the-clock support through our Discord server. Whether it's 2 AM or 2 PM, someone from our team is available to help.
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Shield, title: "Security First", desc: "All transactions are protected by PayPal's buyer protection program. We never store payment information and use industry-standard encryption for all data transfers. Your account credentials are delivered through our secure dashboard, accessible only with your login." },
              { icon: Zap, title: "Instant Delivery", desc: "Your purchases are delivered immediately after payment confirmation. Our automated system processes orders within seconds, not minutes. No waiting, no delays — just instant access to your digital products." },
              { icon: Award, title: "Quality Guarantee", desc: "Every Roblox account and game key is verified before listing. Our quality assurance process checks each account for validity, proper email verification, and working credentials. We maintain high standards so you receive exactly what you paid for." },
              { icon: Heart, title: "Customer Support", desc: "Our support team is available 24/7 on Discord. Whether you need help with your first purchase or have a question about an order, we respond quickly and resolve issues efficiently. Customer satisfaction drives everything we do." },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6 bg-glass">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-glass mb-8">
            <h2 className="font-heading text-2xl font-bold mb-6">Why Choose ComboWick?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                In a marketplace filled with unreliable sellers and scam websites, we aim to stand out through transparency and reliability. Here's what sets us apart:
              </p>
              <ul className="space-y-3">
                {[
                  { bold: "Transparent Pricing", text: "No hidden fees or surprise charges. The price displayed is exactly what you pay. Our bulk discounts are clearly shown so you can make informed decisions." },
                  { bold: "Verified Products", text: "Every account is tested and verified before listing. We don't sell in bulk without checking — each credential is confirmed working." },
                  { bold: "Secure Platform", text: "Built with modern web technologies and enterprise-grade security. Your data is protected with SSL encryption and secure authentication." },
                  { bold: "Mobile Optimized", text: "Shop seamlessly from any device. Our fully responsive design ensures a smooth experience whether you're on desktop, tablet, or phone." },
                  { bold: "Active Discord Community", text: "Join our Discord server to get support, share feedback, and connect with other customers. We're transparent and accessible." },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">{item.bold}:</strong> {item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="p-8 bg-glass mb-8">
            <h2 className="font-heading text-2xl font-bold mb-4">Our Commitment to Safety</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Account security is paramount in the digital marketplace. We implement multiple layers of protection to ensure every transaction is safe and every customer is protected:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• All accounts are verified authentic before listing on our platform</li>
              <li>• Secure payment processing exclusively through PayPal's trusted infrastructure</li>
              <li>• Encrypted data transmission with HTTPS on every page</li>
              <li>• Regular security audits and platform updates</li>
              <li>• Full compliance with data protection regulations including GDPR</li>
              <li>• Automated fraud detection to protect both buyers and sellers</li>
            </ul>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Discord Members", value: "500+" },
              { icon: Globe, label: "Worldwide", value: "Global" },
              { icon: Clock, label: "Delivery", value: "Instant" },
              { icon: Award, label: "Support", value: "24/7" },
            ].map(({ icon: Icon, label, value }) => (
              <Card key={label} className="p-4 bg-glass text-center">
                <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-heading text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
