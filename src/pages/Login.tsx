import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Shield, Zap, HeadphonesIcon } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth would be handled with Supabase when connected
    alert("Authentication requires backend setup. Please contact support on Discord.");
  };

  return (
    <Layout>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <Card className="bg-glass border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your dashboard, purchase history, and account credentials.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/contact" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full">Sign In</Button>
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link to="/signup" className="text-primary hover:underline">Create one free</Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Extra content for AdSense — no thin pages */}
          <div className="mt-12 space-y-6">
            <h2 className="font-heading text-2xl font-bold text-center">Why Create a ComboWick Account?</h2>
            <div className="space-y-4">
              {[
                { icon: Shield, title: "Secure Dashboard Access", desc: "Your purchased account credentials are stored in an encrypted, personal dashboard. Only you can access your purchase history, download credentials, and manage your orders." },
                { icon: Zap, title: "Instant Order Tracking", desc: "Track all your purchases in real time. See delivery status, download account credentials, and view your complete order history — all from one convenient dashboard." },
                { icon: HeadphonesIcon, title: "Priority Support Queue", desc: "Registered users get faster response times from our support team. Submit support tickets directly from your dashboard and track resolution progress." },
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
        </div>
      </section>
    </Layout>
  );
}
