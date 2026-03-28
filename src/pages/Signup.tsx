import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Shield, Clock, Download, MessageSquare } from "lucide-react";

export default function Signup() {
  return (
    <Layout>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <Card className="bg-glass border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl">Get Started with ComboWick</CardTitle>
              <CardDescription>
                Join our Discord community to browse products, place orders, and connect with our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">
                <Button className="w-full gap-2" size="lg">
                  <MessageSquare className="h-5 w-5" />
                  Join Discord Community
                </Button>
              </a>
              <p className="text-xs text-center text-muted-foreground">
                No account registration needed. All orders and support are handled directly through our Discord server with PayPal payments.
              </p>
              <div className="text-center text-sm pt-2">
                <span className="text-muted-foreground">Already a member? </span>
                <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Go to Discord
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-center mb-6">Why Join Our Discord?</h2>
            <div className="space-y-3">
              {[
                { icon: Shield, text: "Secure purchasing through PayPal with full buyer protection on every transaction" },
                { icon: Clock, text: "Instant delivery for digital products — Roblox accounts and Premium Keys delivered in seconds" },
                { icon: Download, text: "Direct access to our support team for replacements, questions, and custom orders" },
                { icon: Check, text: "Community of verified buyers sharing tips, feedback, and exclusive announcements" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-glass border border-border/30">
                  <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Card className="p-6 bg-primary/5 border-primary/30 text-center">
                <h3 className="font-heading text-lg font-semibold mb-2">Browse Before You Buy</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Explore our product pages and read our in-depth Roblox guides to learn more about what we offer before joining Discord.
                </p>
                <Link to="/roblox-accounts">
                  <Button variant="outline">View Products</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
