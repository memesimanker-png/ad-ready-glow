import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Check, Shield, Clock, Download } from "lucide-react";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Account registration requires backend setup. Please contact support on Discord.");
  };

  return (
    <Layout>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <Card className="bg-glass border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl">Create Your Account</CardTitle>
              <CardDescription>Sign up for free to access instant delivery, order tracking, and your personal dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimum 6 characters" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter your password" />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits section for content depth */}
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-center mb-6">What You Get With a Free Account</h2>
            <div className="space-y-3">
              {[
                { icon: Shield, text: "Encrypted personal dashboard to store and manage all purchased credentials securely" },
                { icon: Clock, text: "Complete purchase history with timestamps, payment IDs, and delivery status for every order" },
                { icon: Download, text: "Bulk export of account credentials as formatted text files for easy management" },
                { icon: Check, text: "Access to customer-only Discord channels for support, announcements, and community" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-glass border border-border/30">
                  <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Card className="p-6 bg-primary/5 border-primary/30 text-center">
                <h3 className="font-heading text-lg font-semibold mb-2">Not Ready to Create an Account?</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  You can browse our products and read our guides without an account. When you're ready to purchase, creating an account takes less than 30 seconds and gives you access to all the features above.
                </p>
                <Link to="/roblox-accounts">
                  <Button variant="outline">Browse Products</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
