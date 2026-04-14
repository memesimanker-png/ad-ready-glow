import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { YouTubeVideoPlayer } from "@/components/YouTubeVideoPlayer";
import { getTodaySchedule } from "@/lib/day-schedule";
import { generateLinkvertiseUrl } from "@/lib/linkvertise";

export default function VerifyStep2() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [skipLoading, setSkipLoading] = useState(false);
  const todaySchedule = getTodaySchedule();

  useEffect(() => {
    const step1Done = localStorage.getItem("step1_completed");
    if (!step1Done) {
      toast({ variant: "destructive", title: "Access Denied", description: "Please complete Step 1 first." });
      navigate("/verify/step1");
      return;
    }
    const provider = localStorage.getItem("selected_ad_provider");
    setSelectedProvider(provider);
  }, [navigate, toast]);

  const handleSkipStep2 = () => {
    setSkipLoading(true);
    localStorage.setItem("step2_completed", "true");
    toast({ title: "Step Skipped!", description: "Reward day — skipping to Step 3!" });
    setTimeout(() => navigate("/verify/step3"), 500);
  };

  const handleVerification = async () => {
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
    <div className="min-h-screen bg-black/70 flex flex-col">
      <header className="container py-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">SecureVerify</h1>
        </div>
      </header>
      <main className="flex-1 container flex flex-col items-center justify-center py-12">
        <div className="max-w-2xl w-full mx-auto space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Verification Step 2</h1>
            <p className="text-muted-foreground">Complete the second verification step to continue.</p>
          </div>
          <Card>
            <div className="p-6 pb-0">
              <YouTubeVideoPlayer step="step2" />
            </div>
            <CardHeader>
              <CardTitle>Second Verification</CardTitle>
              <CardDescription>Watch the video, then click the button to verify.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySchedule.skipStep2 && (
                <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-yellow-400 font-medium">
                    {todaySchedule.label} — You can skip this step today!
                  </p>
                </div>
              )}
              {selectedProvider && (
                <div className="text-sm text-center">
                  <p>Using provider: <span className="font-medium">
                    {selectedProvider === "linkvertise" ? "Linkvertise" : selectedProvider === "workink" ? "Work.ink" : "LootLabs"}
                  </span></p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {todaySchedule.skipStep2 && (
                <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold gap-2" onClick={handleSkipStep2} disabled={skipLoading}>
                  <Sparkles className="h-4 w-4" />
                  {skipLoading ? "Skipping..." : "Skip Step 2 (Reward Day)"}
                </Button>
              )}
              <Button
                className="w-full relative overflow-hidden group bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                onClick={handleVerification}
                disabled={isLoading || !buttonEnabled}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Proceed to Verification"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
