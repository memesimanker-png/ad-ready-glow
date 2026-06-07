import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Youtube, MessageCircle, X, CheckCircle2, Lock, Unlock, Loader2, MousePointerClick } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LanguageSelector } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { NoIndex } from "@/components/NoIndex";

const YOUTUBE_URL = "https://www.youtube.com/@COMBO_WICK";
const DISCORD_URL = "https://discord.com/invite/9FWBQnVXCy";
const SUBSCRIPTION_GATE_DURATION_DAYS = 7;
const WAIT_TIME_SECONDS = 3;
const DIRECT_LINK_URL = "https://omg10.com/4/11035707";
const DEFAULT_DIRECT_LINK_CLICKS = 2;

function makeNonce(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function VerifyProviderSelect() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);

  const [youtubeCompleted, setYoutubeCompleted] = useState(false);
  const [discordCompleted, setDiscordCompleted] = useState(false);
  const [youtubeTimer, setYoutubeTimer] = useState(0);
  const [discordTimer, setDiscordTimer] = useState(0);

  const [directLinkClicks, setDirectLinkClicks] = useState(0);
  const [requiredClicks, setRequiredClicks] = useState(DEFAULT_DIRECT_LINK_CLICKS);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Monetag one-click popunder — ONLY on this page
    const POPUNDER_ID = "monetag-popunder-11035708";
    const loadPopunder = () => {
      if (document.getElementById(POPUNDER_ID)) return;
      const loader = document.createElement("script");
      loader.id = POPUNDER_ID;
      loader.dataset.zone = "11035708";
      loader.src = "https://al5sm.com/tag.min.js";
      loader.async = true;
      document.body.appendChild(loader);
    };
    loadPopunder();
    document.addEventListener("pointerdown", loadPopunder, { capture: true, once: true });

    const hideTutorial = localStorage.getItem("hide_tutorial_popup");
    if (!hideTutorial) setShowTutorialPopup(true);

    const gateCompletedAt = localStorage.getItem("subscription_gate_completed");
    if (gateCompletedAt) {
      const daysSince = (Date.now() - new Date(gateCompletedAt).getTime()) / (1000 * 60 * 60 * 24);
      setShowSubscriptionGate(daysSince >= SUBSCRIPTION_GATE_DURATION_DAYS);
    } else {
      setShowSubscriptionGate(true);
    }

    localStorage.removeItem("step1_completed");
    localStorage.removeItem("step2_completed");
    localStorage.removeItem("step3_completed");
    localStorage.removeItem("verification_step");
    localStorage.removeItem("direct_link_completed");
    localStorage.removeItem("direct_link_clicks");
    localStorage.setItem("selected_ad_provider", "lootlabs");

    supabase
      .from("verify_settings")
      .select("direct_link_clicks")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.direct_link_clicks) setRequiredClicks(data.direct_link_clicks);
      });

    return () => document.removeEventListener("pointerdown", loadPopunder, { capture: true } as any);
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
    window.open(DIRECT_LINK_URL, "_blank", "noopener,noreferrer");
    setDirectLinkClicks((prev) => {
      const next = Math.min(prev + 1, requiredClicks);
      localStorage.setItem("direct_link_clicks", String(next));
      if (next >= requiredClicks) {
        localStorage.setItem("direct_link_completed", "true");
        toast({ title: "Processing Complete", description: "You can continue to unlock your key now." });
      } else {
        toast({ title: "One More Click", description: "Click the button one more time to process." });
      }
      return next;
    });
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      const origin = window.location.origin;
      const nonce = makeNonce();
      localStorage.setItem("verify_lootlabs_pending", JSON.stringify({ nonce, ts: Date.now() }));
      const destination = `${origin}/ad-return/verify?hash=${nonce}`;

      let lastErr: unknown = null;
      for (let i = 0; i < 3; i++) {
        try {
          const { data, error } = await supabase.functions.invoke("lootlabs-create-link", {
            body: { title: "ComboWick Key", destination },
          });
          if (error) throw error;
          const url = (data as { loot_url?: string } | null)?.loot_url;
          if (!url) throw new Error("No link returned");
          window.location.href = url;
          return;
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 400 * (i + 1)));
        }
      }
      throw lastErr ?? new Error("Unlock failed");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Try again";
      toast({ title: "Unlock failed", description: msg, variant: "destructive" });
      setUnlocking(false);
    }
  };

  const handleCloseTutorial = () => setShowTutorialPopup(false);
  const handleNeverShowAgain = () => {
    localStorage.setItem("hide_tutorial_popup", "true");
    setShowTutorialPopup(false);
    toast({ title: "Tutorial Hidden", description: "You won't see this popup again." });
  };

  if (!mounted) return null;

  const subscriptionGateCompleted = !showSubscriptionGate || (youtubeCompleted && discordCompleted);

  const youtubeProgress = youtubeTimer > 0 ? ((WAIT_TIME_SECONDS - youtubeTimer) / WAIT_TIME_SECONDS) * 100 : youtubeCompleted ? 100 : 0;
  const discordProgress = discordTimer > 0 ? ((WAIT_TIME_SECONDS - discordTimer) / WAIT_TIME_SECONDS) * 100 : discordCompleted ? 100 : 0;

  type Step = { key: string; title: string; done: boolean; icon: React.ReactNode; render: () => React.ReactNode };
  const steps: Step[] = [];

  if (showSubscriptionGate) {
    steps.push({
      key: "subscribe",
      title: "Subscribe & Join (once per week)",
      done: youtubeCompleted && discordCompleted,
      icon: <Youtube className="h-4 w-4" />,
      render: () => (
        <div className="space-y-2">
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
      ),
    });
  }

  steps.push({
    key: "direct-link",
    title: "Process Free Access",
    done: directLinkClicks >= requiredClicks,
    icon: <MousePointerClick className="h-4 w-4" />,
    render: () => (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Click the button two times to process your free access.
        </p>
        <Button onClick={handleDirectLinkClick} className="w-full gap-2" disabled={directLinkClicks >= requiredClicks}>
          <MousePointerClick className="h-4 w-4" />
          {directLinkClicks >= requiredClicks
            ? "✓ Processing Complete"
            : `Click Ad Button (${directLinkClicks}/${requiredClicks})`}
        </Button>
        <Progress value={(directLinkClicks / requiredClicks) * 100} className="h-1" />
      </div>
    ),
  });

  const directLinkDone = directLinkClicks >= requiredClicks;

  steps.push({
    key: "unlock",
    title: "Get Your Free Key",
    done: false,
    icon: <CheckCircle2 className="h-4 w-4" />,
    render: () => (
      <div className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center">
        <p className="text-base font-semibold mb-2">One quick step to your key</p>
        <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
          Complete one short task to unlock your HWID key. No more multi-step waiting.
        </p>
        <Button onClick={handleUnlock} disabled={unlocking || !subscriptionGateCompleted || !directLinkDone} size="lg" className="gap-2">
          {unlocking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
          {unlocking ? "Generating link..." : "Unlock Free Key"}
        </Button>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Want to skip the task entirely? <a href="/premium-keys" className="text-primary underline">Premium Keys</a>.
        </p>
      </div>
    ),
  });

  const activeIdx = steps.findIndex((s) => !s.done);
  const completedCount = steps.slice(0, -1).filter((s) => s.done).length;
  const totalGates = steps.length - 1;
  const overallPercent = totalGates === 0 ? 100 : Math.round((completedCount / totalGates) * 100);

  return (
    <div className="min-h-screen bg-black/70 flex flex-col">
      <NoIndex />

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
                  <Button variant="ghost" size="icon" aria-label="Close tutorial" onClick={handleCloseTutorial} className="h-10 w-10">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>Watch this quick tutorial to learn how to get your free key</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/zGkNbPgQQx4?rel=0"
                  title="Free Key Tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <header className="container py-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">ComboWick Verify</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 container flex flex-col items-center justify-center py-8">
        <div className="max-w-xl w-full mx-auto space-y-4">
          <Card className="border-primary/30 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">Verification</CardTitle>
                  <CardDescription>One quick step to unlock your free key.</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-lg font-bold text-primary">{overallPercent}%</p>
                </div>
              </div>
              <Progress value={overallPercent} className="h-1.5 mt-3" />
            </CardHeader>

            <CardContent className="p-0">
              <ol className="divide-y divide-border/40">
                {steps.map((step, idx) => {
                  const isActive = idx === activeIdx;
                  const isLocked = activeIdx !== -1 && idx > activeIdx;
                  const isDone = step.done;
                  return (
                    <li key={step.key} className={`p-5 transition-colors ${isActive ? "bg-primary/5" : isDone ? "opacity-60" : isLocked ? "opacity-40" : ""}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isDone ? "bg-green-500/20 text-green-300" : isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : isLocked ? <Lock className="h-3.5 w-3.5" /> : idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm flex items-center gap-2">
                            <span className="text-primary">{step.icon}</span>
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      {isActive && <div className="pl-11">{step.render()}</div>}
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
