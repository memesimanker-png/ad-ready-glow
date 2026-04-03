import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Youtube, MessageCircle, MousePointerClick, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const YOUTUBE_URL = "https://www.youtube.com/@COMBO_WICK";
const DISCORD_URL = "https://discord.com/invite/9FWBQnVXCy";
const DIRECT_LINK_URL = "https://otieu.com/4/10494355";
const SUBSCRIPTION_GATE_DURATION_DAYS = 7;
const DIRECT_LINK_COOLDOWN_MINUTES = 5;
const WAIT_TIME_SECONDS = 3;

const adProviders = [
  { id: "linkvertise", name: "Free Key", description: "Complete verification to get your free key" },
];

export default function VerifyProviderSelect() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);
  const [showDirectLinkGate, setShowDirectLinkGate] = useState(false);
  const [youtubeCompleted, setYoutubeCompleted] = useState(false);
  const [discordCompleted, setDiscordCompleted] = useState(false);
  const [youtubeTimer, setYoutubeTimer] = useState(0);
  const [discordTimer, setDiscordTimer] = useState(0);
  const [directLinkClicks, setDirectLinkClicks] = useState(0);

  useEffect(() => {
    const hideTutorial = localStorage.getItem("hide_tutorial_popup");
    if (!hideTutorial) setShowTutorialPopup(true);

    const gateCompletedAt = localStorage.getItem("subscription_gate_completed");
    if (gateCompletedAt) {
      const daysSince = (Date.now() - new Date(gateCompletedAt).getTime()) / (1000 * 60 * 60 * 24);
      setShowSubscriptionGate(daysSince >= SUBSCRIPTION_GATE_DURATION_DAYS);
    } else {
      setShowSubscriptionGate(true);
    }

    const directLinkCompletedAt = localStorage.getItem("direct_link_completed");
    if (directLinkCompletedAt) {
      const minutesSince = (Date.now() - new Date(directLinkCompletedAt).getTime()) / (1000 * 60);
      if (minutesSince >= DIRECT_LINK_COOLDOWN_MINUTES) {
        setShowDirectLinkGate(true);
        localStorage.removeItem("direct_link_clicks");
        setDirectLinkClicks(0);
      }
    } else {
      setShowDirectLinkGate(true);
    }

    const savedClicks = localStorage.getItem("direct_link_clicks");
    if (savedClicks) setDirectLinkClicks(parseInt(savedClicks, 10));

    // Clear previous verification state
    localStorage.removeItem("step1_completed");
    localStorage.removeItem("step2_completed");
    localStorage.removeItem("step3_completed");
    localStorage.removeItem("verification_step");
  }, []);

  useEffect(() => {
    if (youtubeTimer > 0) {
      const interval = setInterval(() => {
        setYoutubeTimer((prev) => {
          if (prev <= 1) { setYoutubeCompleted(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [youtubeTimer]);

  useEffect(() => {
    if (discordTimer > 0) {
      const interval = setInterval(() => {
        setDiscordTimer((prev) => {
          if (prev <= 1) { setDiscordCompleted(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [discordTimer]);

  useEffect(() => {
    if (youtubeCompleted && discordCompleted && showSubscriptionGate) {
      localStorage.setItem("subscription_gate_completed", new Date().toISOString());
      setShowSubscriptionGate(false);
      toast({ title: "Thank You!", description: "Subscription requirements completed." });
    }
  }, [youtubeCompleted, discordCompleted, showSubscriptionGate, toast]);

  useEffect(() => {
    if (directLinkClicks >= 2 && showDirectLinkGate) {
      localStorage.setItem("direct_link_completed", new Date().toISOString());
      setShowDirectLinkGate(false);
      toast({ title: "Access Granted!", description: "You can now select a verification provider." });
    }
  }, [directLinkClicks, showDirectLinkGate, toast]);

  const handleYoutubeClick = () => {
    window.open(YOUTUBE_URL, "_blank");
    setYoutubeTimer(WAIT_TIME_SECONDS);
    toast({ title: "Opening YouTube", description: `Please subscribe and wait ${WAIT_TIME_SECONDS} seconds...` });
  };

  const handleDiscordClick = () => {
    window.open(DISCORD_URL, "_blank");
    setDiscordTimer(WAIT_TIME_SECONDS);
    toast({ title: "Opening Discord", description: `Please join and wait ${WAIT_TIME_SECONDS} seconds...` });
  };

  const handleDirectLinkClick = () => {
    const newClicks = directLinkClicks + 1;
    setDirectLinkClicks(newClicks);
    localStorage.setItem("direct_link_clicks", newClicks.toString());
    window.open(DIRECT_LINK_URL, "_blank");

    if (newClicks >= 2) {
      toast({ title: "Completed!", description: "You've clicked the button 2 times. Thank you!" });
    } else {
      toast({ title: "Link Opened", description: `Click ${2 - newClicks} more time${2 - newClicks > 1 ? "s" : ""} after returning.` });
    }
  };

  const handleProviderSelect = (providerId: string) => {
    localStorage.setItem("selected_ad_provider", providerId);
    toast({ title: "Provider Selected", description: "You've selected Free Key as your verification provider." });
    navigate("/verify/step1");
  };

  const youtubeProgress = youtubeTimer > 0 ? ((WAIT_TIME_SECONDS - youtubeTimer) / WAIT_TIME_SECONDS) * 100 : youtubeCompleted ? 100 : 0;
  const discordProgress = discordTimer > 0 ? ((WAIT_TIME_SECONDS - discordTimer) / WAIT_TIME_SECONDS) * 100 : discordCompleted ? 100 : 0;

  return (
    <div className="min-h-screen bg-[url('/images/hacker-background.jpg')] bg-cover bg-center bg-fixed flex flex-col">
      <div className="min-h-screen bg-black/70 flex flex-col">
        {/* Tutorial Popup */}
        {showTutorialPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="border-primary/30 w-full max-w-3xl relative animate-in fade-in zoom-in duration-300">
              <CardHeader className="border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">FREE KEY TUTORIAL</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { localStorage.setItem("hide_tutorial_popup", "true"); setShowTutorialPopup(false); }} className="text-muted-foreground hover:text-foreground">
                      Don't show again
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowTutorialPopup(false)} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
                  <iframe
                    src="https://www.youtube.com/embed/zGkNbPgQQx4?rel=0"
                    title="Free Key Tutorial"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-muted-foreground text-center">Watch this tutorial to learn how to get your free key in 2-5 minutes.</p>
              </CardContent>
            </Card>
          </div>
        )}

        <header className="container py-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">SecureVerify</h1>
          </div>
        </header>

        <main className="flex-1 container flex flex-col items-center justify-center py-12">
          <div className="max-w-2xl w-full mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Get Your Free Key</h1>
              <p className="text-muted-foreground">Complete the requirements below to start the verification process.</p>
            </div>

            {/* Subscription Gate */}
            {showSubscriptionGate && (
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Subscribe & Join</CardTitle>
                  <CardDescription>Subscribe to our YouTube and join our Discord to continue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Button onClick={handleYoutubeClick} disabled={youtubeCompleted} variant={youtubeCompleted ? "outline" : "default"} className="flex-1">
                        <Youtube className="mr-2 h-4 w-4" />
                        {youtubeCompleted ? "Subscribed ✓" : youtubeTimer > 0 ? `Wait ${youtubeTimer}s...` : "Subscribe on YouTube"}
                      </Button>
                    </div>
                    {youtubeTimer > 0 && <Progress value={youtubeProgress} className="h-1" />}

                    <div className="flex items-center gap-3">
                      <Button onClick={handleDiscordClick} disabled={discordCompleted} variant={discordCompleted ? "outline" : "default"} className="flex-1">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {discordCompleted ? "Joined ✓" : discordTimer > 0 ? `Wait ${discordTimer}s...` : "Join Discord"}
                      </Button>
                    </div>
                    {discordTimer > 0 && <Progress value={discordProgress} className="h-1" />}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Direct Link Gate */}
            {showDirectLinkGate && !showSubscriptionGate && (
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: Click to Continue</CardTitle>
                  <CardDescription>Click the button below 2 times to proceed ({directLinkClicks}/2 completed).</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleDirectLinkClick} className="w-full" disabled={directLinkClicks >= 2}>
                    <MousePointerClick className="mr-2 h-4 w-4" />
                    {directLinkClicks >= 2 ? "Completed ✓" : `Click Here (${directLinkClicks}/2)`}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Provider Selection */}
            {!showSubscriptionGate && !showDirectLinkGate && (
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">Select Verification Provider</CardTitle>
                  <CardDescription>Choose your preferred verification method to get your free key.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {adProviders.map((provider) => (
                    <Button key={provider.id} onClick={() => handleProviderSelect(provider.id)} className="w-full h-auto py-4 flex flex-col items-start text-left" variant="outline">
                      <span className="font-semibold">{provider.name}</span>
                      <span className="text-sm text-muted-foreground">{provider.description}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
