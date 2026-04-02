import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Key, Clock, Shield, Zap, Crown, CheckCircle, Play } from "lucide-react";

export default function Keys() {
  return (
    <Layout>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Key className="h-10 w-10 text-primary" />
              <h1 className="font-heading text-4xl font-bold">License Keys</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your free access key to unlock all COMBO WICK scripts. Keys are valid for 24 hours and can be regenerated unlimited times at no cost.
            </p>
          </div>

          <Card className="mb-10 overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                How to Get Your Free Key
              </CardTitle>
              <CardDescription>Watch this quick tutorial to learn the verification process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden border border-border/50">
                <iframe
                  src="https://www.youtube.com/embed/zGkNbPgQQx4?rel=0"
                  title="COMBO WICK Key Tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="border-primary/30 hover:border-primary/60 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Key className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Free Key</CardTitle>
                <CardDescription>Perfect for casual users</CardDescription>
                <div className="text-3xl font-bold text-primary mt-2">$0</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {["24-hour key validity", "Access to all scripts", "Unlimited regenerations", "Quick 3-step verification", "Works on all executors"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer" className="block pt-4">
                  <Button className="w-full text-lg py-6">
                    <Key className="mr-2 h-5 w-5" />
                    Get Free Key Now
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="border-purple-500/30 hover:border-purple-500/60 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-purple-400">Premium Key</CardTitle>
                <CardDescription>For power users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {["Extended key validity", "No verification required", "Priority script updates", "Exclusive premium scripts", "Priority Discord support"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/payment" className="block pt-4">
                  <Button variant="outline" className="w-full text-lg py-6 border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                    <Crown className="mr-2 h-5 w-5" />
                    Get Premium Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">24-Hour Validity</h3>
                <p className="text-muted-foreground text-sm">Free keys are valid for 24 hours. After expiration, simply generate a new key for free.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Device Specific</h3>
                <p className="text-muted-foreground text-sm">Keys are tied to your device hardware ID for security. Each device needs its own key.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Instant Access</h3>
                <p className="text-muted-foreground text-sm">Complete verification in 2-5 minutes and get immediate access to all scripts.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
