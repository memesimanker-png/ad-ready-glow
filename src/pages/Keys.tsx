import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Key, Clock, Shield, Zap, Crown, CheckCircle, Play } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";
import { SEOHead } from "@/components/SEOHead";
import { usePopunder } from "@/hooks/usePopunder";



export default function Keys() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEOHead
        title="Free Roblox Script Key — Combo_WICK Free 11-Hour HWID Key"
        description="Get your free Combo_WICK key in 2 minutes. The 11-hour HWID-locked key unlocks every free script in the hub. Step-by-step instructions and supported executors."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Free Key", url: "/keys" }]}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Key className="h-10 w-10 text-primary" />
              <h1 className="font-heading text-4xl font-bold">{t("License Keys")}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("keys_subtitle")}
            </p>
          </div>

          <Card className="mb-10 overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                {t("How to Get Your Free Key")}
              </CardTitle>
              <CardDescription>{t("keys_tutorial_desc")}</CardDescription>
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
                <CardTitle>{t("Free Key")}</CardTitle>
                <CardDescription>{t("keys_free_desc")}</CardDescription>
                <div className="text-3xl font-bold text-primary mt-2">$0</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    t("keys_free_feat_1"),
                    t("keys_free_feat_2"),
                    t("keys_free_feat_3"),
                    t("keys_free_feat_4"),
                    t("keys_free_feat_5"),
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/verify/provider-select" className="block pt-4">
                  <Button className="w-full text-lg py-6">
                    <Key className="mr-2 h-5 w-5" />
                    {t("Get Free Key Now")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-500/30 hover:border-purple-500/60 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-purple-400">{t("Premium Key")}</CardTitle>
                <CardDescription>{t("keys_premium_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    t("keys_prem_feat_1"),
                    t("keys_prem_feat_2"),
                    t("keys_prem_feat_3"),
                    t("keys_prem_feat_4"),
                    t("keys_prem_feat_5"),
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/premium-keys" className="block pt-4">
                  <Button variant="outline" className="w-full text-lg py-6 border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                    <Crown className="mr-2 h-5 w-5" />
                    {t("Get Premium Access")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("24-Hour Validity")}</h3>
                <p className="text-muted-foreground text-sm">{t("keys_validity_desc")}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("Device Specific")}</h3>
                <p className="text-muted-foreground text-sm">{t("keys_device_desc")}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("Instant Access")}</h3>
                <p className="text-muted-foreground text-sm">{t("keys_instant_desc")}</p>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </section>
    </Layout>
  );
}
