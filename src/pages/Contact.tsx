import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Clock, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Contact <span className="text-gradient-primary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our Roblox account packages or need support with a purchase? We're here to help through multiple channels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Mail, title: "Email Support", desc: "For general inquiries, order issues, and formal support requests. We respond within 24 hours.", contact: "support@combowick.com", href: "mailto:support@combowick.com" },
              { icon: MessageSquare, title: "Discord Community", desc: "Join our active Discord server for real-time support, community discussions, and exclusive announcements.", contact: "Join Discord Server", href: "https://discord.com/invite/ufrz9Zaqs8" },
              { icon: Clock, title: "Response Times", desc: "Email: within 24 hours on business days. Discord: typically within 1-4 hours. Critical issues are always prioritized for faster resolution.", contact: null, href: null },
              { icon: MapPin, title: "Business Hours", desc: "Monday – Friday: 9:00 AM – 6:00 PM EST. Saturday – Sunday: 10:00 AM – 4:00 PM EST. Discord support available outside these hours.", contact: null, href: null },
            ].map(({ icon: Icon, title, desc, contact, href }) => (
              <Card key={title} className="p-6 bg-glass">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{desc}</p>
                    {contact && href && (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium">
                        {contact}
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-glass mb-8">
            <h2 className="font-heading text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How do I access my purchased accounts?", a: "After completing your purchase, log in to your ComboWick dashboard and navigate to 'Accounts'. All purchased Roblox accounts will be listed there with full login credentials. Delivery is automatic and instant." },
                { q: "What payment methods do you accept?", a: "We accept PayPal, which supports credit cards, debit cards, bank transfers, and PayPal balance. All transactions are secured by PayPal's buyer protection program, giving you complete peace of mind." },
                { q: "What is your refund policy?", a: "Due to the instant digital nature of our products, all sales are generally final. However, if an account doesn't work as described, contact us within 24 hours and we'll replace it or resolve the issue. See our full Refund Policy page for details." },
                { q: "Are the accounts safe to use?", a: "Yes, all accounts are manually verified and legitimate. We recommend changing the password immediately after receiving your accounts for maximum security. Follow Roblox's Terms of Service when using purchased accounts." },
                { q: "How long does delivery take?", a: "Delivery is instant! Once your PayPal payment is confirmed, account credentials appear in your dashboard automatically — typically within 30-60 seconds." },
                { q: "Can I purchase without creating a ComboWick account?", a: "Guest checkout is available, but creating a free account lets you track purchase history, manage credentials easily, and get faster support. We recommend registering for the best experience." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-heading text-base font-semibold mb-2">{q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-primary/5 border-primary/30 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Need Immediate Help?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              For urgent issues with purchases or account access, join our Discord for the fastest response times.
            </p>
            <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">
              <Button size="lg">Join Discord Support</Button>
            </a>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
