import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Youtube, MessageCircle, MousePointerClick, X, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AdProviderSelector } from "@/components/AdProviderSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FloatingYouTubePlayer } from "@/components/FloatingYouTubePlayer";
import { getTodaySchedule } from "@/lib/day-schedule";

const adProviders = [
  { id: "linkvertise", name: "Free Key", description: "" },
];

const YOUTUBE_URL = "https://www.youtube.com/@COMBO_WICK";
const DISCORD_URL = "https://discord.com/invite/9FWBQnVXCy";
const DIRECT_LINK_URL = "https://otieu.com/4/10494355";
const SUBSCRIPTION_GATE_DURATION_DAYS = 7;
const DIRECT_LINK_COOLDOWN_MINUTES = 5;
const WAIT_TIME_SECONDS = 3;

export default function VerifyProviderSelect() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const todaySchedule = getTodaySchedule();

  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);
  const [showDirectLinkGate, setShowDirectLinkGate] = useState(false);

  const [youtubeCompleted, setYoutubeCompleted] = useState(false);
  const [discordCompleted, setDiscordCompleted] = useState(false);
  const [youtubeTimer, setYoutubeTimer] = useState(0);
  const [discordTimer, setDiscordTimer] = useState(0);
  const [directLinkClicks, setDirectLinkClicks] = useState(0);

  useEffect(() => {
    setMounted(true);

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
      } else {
        setShowDirectLinkGate(false);
      }
    } else {
      setShowDirectLinkGate(true);
    }

    const savedClicks = localStorage.getItem("direct_link_clicks");
    if (savedClicks) setDirectLinkClicks(parseInt(savedClicks, 10));

    localStorage.removeItem("step1_completed");
    localStorage.removeItem("step2_completed");
    localStorage.removeItem("step3_completed");
    localStorage.removeItem("verification_step");
  }, []);

  useEffect(() => {
    if (youtubeTimer > 0) {
      const interval = setInterval(() => {
        setYoutubeTimer((prev) => { if (prev <= 1) { setYoutubeCompleted(true); return 0; } return prev - 1; });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [youtubeTimer]);

  useEffect(() => {
    if (discordTimer > 0) {
      const interval = setInterval(() => {
        setDiscordTimer((prev) => { if (prev <= 1) { setDiscordCompleted(true); return 0; } return prev - 1; });
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
    const newClickCount = directLinkClicks + 1;
    setDirectLinkClicks(newClickCount);
    localStorage.setItem("direct_link_clicks", newClickCount.toString());
    window.open(DIRECT_LINK_URL, "_blank");

    if (newClickCount >= 2) {
      toast({ title: "Completed!", description: "You've clicked the button 2 times. Thank you!" });
    } else {
      toast({ title: "Link Opened", description: `Click ${2 - newClickCount} more time${2 - newClickCount > 1 ? "s" : ""} after returning.` });
    }
  };

  const handleProviderSelect = (providerId: string) => {
    localStorage.setItem("selected_ad_provider", providerId);
    toast({ title: "Provider Selected", description: "You've selected Free Key as your verification provider." });
    navigate("/verify/step1");
  };

  const handleCloseTutorial = () => setShowTutorialPopup(false);
  const handleNeverShowAgain = () => {
    localStorage.setItem("hide_tutorial_popup", "true");
    setShowTutorialPopup(false);
    toast({ title: "Tutorial Hidden", description: "You won't see this popup again." });
  };

  if (!mounted) return null;

  const subscriptionGateCompleted = youtubeCompleted && discordCompleted;
  const directLinkGateCompleted = directLinkClicks >= 2;
  const youtubeProgress = youtubeTimer > 0 ? ((WAIT_TIME_SECONDS - youtubeTimer) / WAIT_TIME_SECONDS) * 100 : youtubeCompleted ? 100 : 0;
  const discordProgress = discordTimer > 0 ? ((WAIT_TIME_SECONDS - discordTimer) / WAIT_TIME_SECONDS) * 100 : discordCompleted ? 100 : 0;

  return (
    <div className="min-h-screen bg-black/70 flex flex-col">
      <FloatingYouTubePlayer step="provider-select" />

      {showTutorialPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="border-primary/30 w-full max-w-3xl relative animate-in fade-in zoom-in duration-300">
            <CardHeader className="border-b border-primary/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">FREE KEY TUTORIAL</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleNeverShowAgain} className="text-muted-foreground hover:text-foreground">
                    Don't show again
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCloseTutorial} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>Watch this quick tutorial to learn how to get your free key</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
                <iframe
                  src="https://www.youtube.com/embed/zGkNbPgQQx4?rel=0"
                  title="Free Key Tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
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
            <h1 className="text-3xl font-bold">Verification Provider</h1>
            <p className="text-muted-foreground">Select which provider you want to use for verification.</p>
          </div>

          {showSubscriptionGate && !subscriptionGateCompleted && (
            <Card className="border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Subscribe & Join to Continue
                </CardTitle>
                <CardDescription>Complete these steps to proceed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button onClick={handleYoutubeClick} disabled={youtubeCompleted || youtubeTimer > 0} className="w-full bg-red-600 hover:bg-red-700">
                    <Youtube className="mr-2 h-4 w-4" />
                    {youtubeCompleted ? "✓ YouTube Subscribed" : youtubeTimer > 0 ? `Waiting ${youtubeTimer}s...` : "Subscribe to YouTube"}
                  </Button>
                  {youtubeTimer > 0 && <Progress value={youtubeProgress} className="h-1" />}

                  <Button onClick={handleDiscordClick} disabled={discordCompleted || discordTimer > 0} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {discordCompleted ? "✓ Discord Joined" : discordTimer > 0 ? `Waiting ${discordTimer}s...` : "Join Discord"}
                  </Button>
                  {discordTimer > 0 && <Progress value={discordProgress} className="h-1" />}
                </div>
                <p className="text-xs text-muted-foreground text-center">This will appear again in 1 week</p>
              </CardContent>
            </Card>
          )}

          {showDirectLinkGate && !directLinkGateCompleted && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointerClick className="h-5 w-5 text-primary" />
                  One More Step!
                </CardTitle>
                <CardDescription>Click the button below 2 times to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleDirectLinkClick} className="w-full bg-gradient-to-r from-primary via-purple-500 to-primary hover:shadow-lg transition-all">
                  <MousePointerClick className="mr-2 h-4 w-4" />
                  {directLinkClicks >= 2 ? "✓ Completed!" : `Click This Button (${directLinkClicks}/2)`}
                </Button>
                <p className="text-xs text-muted-foreground text-center">Progress: {directLinkClicks}/2 clicks completed</p>
                <p className="text-xs text-muted-foreground text-center">This gate reappears every 5 minutes for security purposes</p>
              </CardContent>
            </Card>
          )}

          {(!showSubscriptionGate || subscriptionGateCompleted) && (!showDirectLinkGate || directLinkGateCompleted) && (
            <AdProviderSelector providers={adProviders} onSelect={handleProviderSelect} />
          )}
        </div>
      </main>
    </div>
  );
}
