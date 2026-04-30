import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ExternalLink, Sparkles } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { YouTubeVideoPlayer } from "@/components/YouTubeVideoPlayer";
import { getTodaySchedule } from "@/lib/day-schedule";
import { generateLinkvertiseUrl } from "@/lib/linkvertise";
import { useTranslation } from "@/lib/translation-context";
import { SkipAdsBanner } from "@/components/SkipAdsBanner";
import { LinkvertiseTimerNotice } from "@/components/LinkvertiseTimerNotice";
import { SkipAdsFloatButton } from "@/components/SkipAdsFloatButton";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export default function VerifyStep2() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [skipLoading, setSkipLoading] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const todaySchedule = getTodaySchedule();

  useEffect(() => {
    const step1Done = localStorage.getItem("step1_completed");
    if (!step1Done) {
      toast({ variant: "destructive", title: t("Access Denied"), description: t("verify_access_denied_step1") });
      navigate("/verify/step1");
      return;
    }
    const provider = localStorage.getItem("selected_ad_provider");
    setSelectedProvider(provider);

    // Check if user signed in with Google
    const checkGoogleUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.app_metadata?.provider === "google") {
          setIsGoogleUser(true);
        }
      } catch {
        setIsGoogleUser(false);
      }
    };
    checkGoogleUser();
  }, [navigate, toast, t]);

  const canSkip = isGoogleUser && todaySchedule.skipStep2;

  const handleSkipStep2 = () => {
    setSkipLoading(true);
    localStorage.setItem("step2_completed", "true");
    toast({ title: t("Step Skipped!"), description: t("verify_skip_desc") });
    setTimeout(() => navigate("/verify/step3"), 500);
  };

  const handleVerification = () => {
    setIsLoading(true);
    if (selectedProvider) localStorage.setItem("selected_ad_provider", selectedProvider);
    localStorage.setItem("verification_step", "step2");

    if (selectedProvider === "linkvertise") {
      const returnUrl = `${window.location.origin}/ad-return/step2`;
      window.location.href = generateLinkvertiseUrl(returnUrl);
    } else if (selectedProvider === "lootlabs") {
      window.location.href = "https://lootdest.org/s?0Um0OrJz";
    } else {
      window.location.href = "https://workink.net/1XgX/1va6w706";
    }
  };

  return (
    <>
      <SkipAdsBanner />
      <SkipAdsFloatButton />
      <div className="min-h-screen bg-black/70 flex flex-col pt-12">
        <header className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">{t("ComboWick Verify")}</h1>
            </div>
            <LanguageSelector />
          </div>
        </header>
        <main className="flex-1 container flex flex-col items-center justify-center py-12">
          <div className="max-w-2xl w-full mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">{t("Verification Step 2")}</h1>
              <p className="text-muted-foreground">{t("verify_step2_desc")}</p>
            </div>
            <Card>
              <div className="p-6 pb-0">
                <YouTubeVideoPlayer step="step2" />
              </div>
              <CardHeader>
                <CardTitle>{t("Second Verification")}</CardTitle>
                <CardDescription>{t("verify_watch_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {canSkip && (
                  <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-yellow-400 font-medium">
                      {todaySchedule.label} — {t("verify_skip_label")}
                    </p>
                  </div>
                )}
                {!isGoogleUser && todaySchedule.skipStep2 && (
                  <div className="rounded-lg border border-primary/40 bg-primary/10 p-3 space-y-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-primary font-medium">
                        {t("Sign in with Google to skip this step on reward days!")}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white text-black hover:bg-white/90 hover:text-black gap-2"
                      onClick={async () => {
                        const result = await lovable.auth.signInWithOAuth("google", {
                          redirect_uri: `${window.location.origin}/verify/step2`,
                        });
                        if (result.error) {
                          toast({ variant: "destructive", title: t("Error"), description: result.error.message ?? "Google sign-in failed" });
                        }
                      }}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.2 5.6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.2 5.6 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                        <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.4 35 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.3 5.3C41.6 35.5 44 30.1 44 24c0-1.2-.1-2.3-.4-3.5z"/>
                      </svg>
                      Sign in with Google
                    </Button>
                  </div>
                )}
                {selectedProvider && (
                  <div className="text-sm text-center">
                    <p>{t("Using provider:")} <span className="font-medium">
                      {selectedProvider === "linkvertise" ? "Linkvertise" : selectedProvider === "workink" ? "Work.ink" : "LootLabs"}
                    </span></p>
                  </div>
                )}
                <LinkvertiseTimerNotice />
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                {canSkip && (
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold gap-2" onClick={handleSkipStep2} disabled={skipLoading}>
                    <Sparkles className="h-4 w-4" />
                    {skipLoading ? t("Skipping...") : t("Skip Step 2 (Reward Day)")}
                  </Button>
                )}
                <Button
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                  onClick={handleVerification}
                  disabled={isLoading || !buttonEnabled}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {isLoading ? t("Processing...") : t("Proceed to Verification")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
