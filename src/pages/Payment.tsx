import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Zap, Users } from "lucide-react";

export default function Payment() {
  const handlePayNow = (plan: string) => {
    window.location.href = `https://combooo-wickshop.vercel.app/?plan=${plan}`;
  };

  return (
    <Layout>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">Skip All Ads & Get Instant Keys</h1>
            <p className="text-muted-foreground text-lg">No more waiting. Get premium access now.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-muted-foreground" /> Free Plan</CardTitle>
                <CardDescription>Current experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$0</div>
                <ul className="space-y-3">
                  {["Multiple ad steps required", "15-30 second wait times", "Popup ads and redirects"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-500/50 bg-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-purple-400" /> Weekly Plan</CardTitle>
                <CardDescription>Quick access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border-2 border-purple-500/30 bg-purple-500/10">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-muted-foreground line-through">$6.49</span>
                    <span className="text-4xl font-bold">$5</span>
                    <span className="text-muted-foreground">per week</span>
                  </div>
                  <span className="inline-block bg-success text-success-foreground text-xs font-bold px-2 py-0.5 rounded">LIMITED OFFER</span>
                </div>
                <ul className="space-y-3">
                  {["Zero ads, instant keys", "One-click key generation", "Priority support"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><Check className="h-5 w-5 text-success" />{item}</li>
                  ))}
                </ul>
                <Button onClick={() => handlePayNow("weekly")} size="lg" className="w-full py-6 bg-purple-600 hover:bg-purple-700">Pay Now</Button>
              </CardContent>
            </Card>

            <Card className="border-primary/50 ring-2 ring-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Monthly Plan</CardTitle>
                <CardDescription>Best value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/10">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold">$10</span>
                    <span className="text-muted-foreground">per month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">30 days unlimited access</p>
                </div>
                <ul className="space-y-3">
                  {["All weekly features", "Save $16 per month", "Exclusive monthly scripts"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><Check className="h-5 w-5 text-success" />{item}</li>
                  ))}
                </ul>
                <Button onClick={() => handlePayNow("monthly")} size="lg" className="w-full py-6">Pay Now</Button>
              </CardContent>
            </Card>

            <Card className="border-success/50 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-success" /> Roblox Accounts</CardTitle>
                <CardDescription>Premium accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border-2 border-success/30 bg-success/10">
                  <div className="text-4xl font-bold mb-1">Varies</div>
                  <p className="text-sm text-muted-foreground">High-level aged accounts</p>
                </div>
                <ul className="space-y-3">
                  {["Aged accounts available", "Secure & verified"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><Check className="h-5 w-5 text-success" />{item}</li>
                  ))}
                </ul>
                <Button onClick={() => handlePayNow("accounts")} size="lg" variant="outline" className="w-full py-6 border-success/50 text-success hover:bg-success/10">Browse Accounts</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
