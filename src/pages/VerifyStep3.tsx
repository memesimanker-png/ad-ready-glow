import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { YouTubeVideoPlayer } from "@/components/YouTubeVideoPlayer";
import { generateLinkvertiseUrl } from "@/lib/linkvertise";
import { useTranslation } from "@/lib/translation-context";
import { LinkvertiseTimerNotice } from "@/components/LinkvertiseTimerNotice";


export default function VerifyStep3() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    const step2Done = localStorage.getItem("step2_completed");
    if (!step2Done) {
      toast({ variant: "destructive", title: t("Access Denied"), description: t("verify_access_denied_step2") });
      navigate("/verify/step1");
      return;
    }
    const provider = localStorage.getItem("selected_ad_provider");
    setSelectedProvider(provider);
  }, [navigate, toast, t]);

  const handleVerification = () => {
    setIsLoading(true);
    if (selectedProvider) localStorage.setItem("selected_ad_provider", selectedProvider);
    localStorage.setItem("verification_step", "step3");

    if (selectedProvider === "linkvertise") {
      const returnUrl = `${window.location.origin}/ad-return/step3`;
      window.location.href = generateLinkvertiseUrl(returnUrl);
    } else if (selectedProvider === "lootlabs") {
      window.location.href = "https://lootdest.org/s?ASt4XtMq";
    } else {
      window.location.href = "https://work.ink/1XgX/m6qt5uyh";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black/70 flex flex-col">
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
              <h1 className="text-3xl font-bold">{t("Verification Step 3")}</h1>
              <p className="text-muted-foreground">{t("verify_step3_desc")}</p>
            </div>
            <Card>
              <div className="p-6 pb-0">
                <YouTubeVideoPlayer step="step3" timerSeconds={15} onTimerComplete={() => setButtonEnabled(true)} />
              </div>
              <CardHeader>
                <CardTitle>{t("Final Verification")}</CardTitle>
                <CardDescription>{t("verify_watch_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProvider && (
                  <div className="text-sm text-center">
                    <p>{t("Using provider:")} <span className="font-medium">
                      {selectedProvider === "linkvertise" ? "Linkvertise" : selectedProvider === "workink" ? "Work.ink" : "LootLabs"}
                    </span></p>
                  </div>
                )}
                <LinkvertiseTimerNotice />
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                  onClick={handleVerification}
                  disabled={isLoading || !buttonEnabled}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {isLoading ? t("Processing...") : t("Proceed to Final Verification")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
