import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, HeadphonesIcon, MessageSquare } from "lucide-react";

export default function Login() {
  return (
    <Layout>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <Card className="bg-glass border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl">Access Your Dashboard</CardTitle>
              <CardDescription>
                All purchases and account management are handled through our Discord server. Join our community to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">
                <Button className="w-full gap-2" size="lg">
                  <MessageSquare className="h-5 w-5" />
                  Join Discord to Get Started
                </Button>
              </a>
              <p className="text-xs text-center text-muted-foreground">
                Our Discord server handles all purchases, account delivery, and customer support. Open a ticket to place an order or get help with an existing purchase.
              </p>
            </CardContent>
          </Card>

          <div className="mt-12 space-y-6">
            <h2 className="font-heading text-2xl font-bold text-center">How Our Ordering Process Works</h2>
            <div className="space-y-4">
              {[
                { icon: MessageSquare, title: "1. Join Our Discord Server", desc: "Click the button above to join our Discord community. It's free and takes less than a minute. Our server is where all purchases, delivery, and support happen." },
                { icon: Shield, title: "2. Open a Support Ticket", desc: "Once in the server, open a ticket in our #support channel. Tell us which package you'd like — Roblox accounts, Premium Keys, or Natural Oils — and we'll guide you through the process." },
                { icon: Zap, title: "3. Pay & Receive Instantly", desc: "Complete your payment through PayPal (buyer protection included). For Roblox accounts and Premium Keys, delivery is automated and instant. Oil orders ship within 1-2 business days." },
                { icon: HeadphonesIcon, title: "4. Get Ongoing Support", desc: "After your purchase, our support team is available 24/7 on Discord for replacements, questions, or any issues. We typically respond within 1-4 hours." },
              ].map((item) => (
                <Card key={item.title} className="p-5 bg-glass">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">Want to learn more before ordering?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/roblox-accounts">
                <Button variant="outline" size="sm">Browse Products</Button>
              </Link>
              <Link to="/blog">
                <Button variant="outline" size="sm">Read Our Guides</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
