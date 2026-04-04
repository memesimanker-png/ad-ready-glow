import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { YouTubeVideoPlayer } from "@/components/YouTubeVideoPlayer";

export default function VerifyStep3() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    const step2Done = localStorage.getItem("step2_completed");
    if (!step2Done) {
      toast({ variant: "destructive", title: "Access Denied", description: "Please complete Step 2 first." });
      navigate("/verify/step1");
      return;
    }
    const provider = localStorage.getItem("selected_ad_provider");
    setSelectedProvider(provider);
  }, [navigate, toast]);

  const handleVerification = () => {
    setIsLoading(true);

    let adLink = "https://work.ink/1XgX/m6qt5uyh";
    if (selectedProvider === "linkvertise") adLink = "https://direct-link.net/405401/TwWRE4TowD9N";
    else if (selectedProvider === "lootlabs") adLink = "https://lootdest.org/s?ASt4XtMq";

    if (selectedProvider) localStorage.setItem("selected_ad_provider", selectedProvider);
    localStorage.setItem("verification_step", "step3");
    window.location.href = adLink;
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
            <h1 className="text-3xl font-bold">Verification Step 3</h1>
            <p className="text-muted-foreground">Complete the final verification step to get your access key.</p>
          </div>

          <Card>
            <div className="p-6 pb-0">
              <YouTubeVideoPlayer step="step3" timerSeconds={15} onTimerComplete={() => setButtonEnabled(true)} />
            </div>

            <CardHeader>
              <CardTitle>Final Verification</CardTitle>
              <CardDescription>Watch the video, then click the button to verify.</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProvider && (
                <div className="text-sm text-center">
                  <p>Using provider: <span className="font-medium">
                    {selectedProvider === "linkvertise" ? "Linkvertise" : selectedProvider === "workink" ? "Work.ink" : "LootLabs"}
                  </span></p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full relative overflow-hidden group bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                onClick={handleVerification}
                disabled={isLoading || !buttonEnabled}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Proceed to Final Verification"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
