import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function VerifyStep1() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(15);

  useEffect(() => {
    const provider = localStorage.getItem("selected_ad_provider");
    if (!provider) {
      toast({ variant: "destructive", title: "Error", description: "Please select a provider first." });
      navigate("/verify/provider-select");
      return;
    }
    setSelectedProvider(provider);
  }, [navigate, toast]);

  useEffect(() => {
    if (timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setButtonEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerSeconds]);

  const handleVerification = () => {
    setIsLoading(true);

    let adLink = "https://workink.net/1XgX/0yrwn95k";
    if (selectedProvider === "linkvertise") {
      adLink = "https://link-center.net/405401/cWKDK8S88ys2";
    } else if (selectedProvider === "lootlabs") {
      adLink = "https://lootdest.org/s?hovfnQ85";
    }

    localStorage.setItem("verification_step", "step1");
    window.location.href = adLink;
  };

  return (
    <div className="min-h-screen bg-[url('/images/hacker-background.jpg')] bg-cover bg-center bg-fixed flex flex-col">
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
              <h1 className="text-3xl font-bold">Verification Step 1</h1>
              <p className="text-muted-foreground">Complete the first verification step to continue.</p>
            </div>

            <Card>
              <div className="p-6 pb-0">
                <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
                  <iframe
                    src="https://www.youtube.com/embed/zGkNbPgQQx4?rel=0"
                    title="Verification Tutorial"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {timerSeconds > 0 && (
                  <p className="text-center text-muted-foreground mt-2 text-sm">
                    Please wait {timerSeconds}s before proceeding...
                  </p>
                )}
              </div>

              <CardHeader>
                <CardTitle>First Verification</CardTitle>
                <CardDescription>Watch the video, then click the button to verify.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProvider && (
                  <div className="text-sm text-center">
                    <p>Using provider: <span className="font-medium">{selectedProvider === "linkvertise" ? "Linkvertise" : selectedProvider === "workink" ? "Work.ink" : "LootLabs"}</span></p>
                  </div>
                )}
                <div className="bg-black/50 border border-green-500/20 rounded p-3 text-xs text-green-400/70 space-y-2">
                  <p className="font-semibold text-green-500">Why Verification?</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Prevents unauthorized access to scripts</li>
                    <li>Protects our security and game integrity</li>
                    <li>One-time 2-5 minute process</li>
                    <li>Free key generation every 24 hours</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
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
    </div>
  );
}
