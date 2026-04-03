import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function VerifyStep2() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(15);

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

  useEffect(() => {
    if (timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) { setButtonEnabled(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerSeconds]);

  const handleVerification = () => {
    setIsLoading(true);
    let adLink = "https://workink.net/1XgX/1va6w706";
    if (selectedProvider === "linkvertise") adLink = "https://link-hub.net/405401/0nwkHBZjAkH8";
    else if (selectedProvider === "lootlabs") adLink = "https://lootdest.org/s?0Um0OrJz";

    localStorage.setItem("verification_step", "step2");
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
              <h1 className="text-3xl font-bold">Verification Step 2</h1>
              <p className="text-muted-foreground">Complete the second verification step to continue.</p>
            </div>
            <Card>
              <div className="p-6 pb-0">
                <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
                  <iframe src="https://www.youtube.com/embed/zGkNbPgQQx4?rel=0" title="Verification Tutorial" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                </div>
                {timerSeconds > 0 && <p className="text-center text-muted-foreground mt-2 text-sm">Please wait {timerSeconds}s before proceeding...</p>}
              </div>
              <CardHeader>
                <CardTitle>Second Verification</CardTitle>
                <CardDescription>Watch the video, then click the button to verify.</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProvider && (
                  <div className="text-sm text-center">
                    <p>Using provider: <span className="font-medium">{selectedProvider === "linkvertise" ? "Linkvertise" : selectedProvider === "workink" ? "Work.ink" : "LootLabs"}</span></p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full relative overflow-hidden group bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] hover:shadow-lg hover:shadow-primary/50 transition-all duration-300" onClick={handleVerification} disabled={isLoading || !buttonEnabled}>
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
