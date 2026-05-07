import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Youtube, MessageCircle, X, Sparkles, CheckCircle2, Lock, ExternalLink, Clock, CalendarDays } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AdProviderSelector } from "@/components/AdProviderSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FloatingYouTubePlayer } from "@/components/FloatingYouTubePlayer";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getTodaySchedule } from "@/lib/day-schedule";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";


const adProviders = [
  { id: "linkvertise", name: "Free Key", description: "" },
];

const YOUTUBE_URL = "https://www.youtube.com/@COMBO_WICK";
const DISCORD_URL = "https://discord.com/invite/9FWBQnVXCy";
const SUBSCRIPTION_GATE_DURATION_DAYS = 7;
const WAIT_TIME_SECONDS = 3;
const DIRECT_LINK_URL = "https://omg10.com/4/10877293";
const REQUIRED_AD_CLICKS = 2;
const COOLDOWN_MS = 10 * 60 * 1000;

export default function VerifyProviderSelect() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const todaySchedule = getTodaySchedule();

  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);

  const [youtubeCompleted, setYoutubeCompleted] = useState(false);
  const [discordCompleted, setDiscordCompleted] = useState(false);
  const [youtubeTimer, setYoutubeTimer] = useState(0);
  const [discordTimer, setDiscordTimer] = useState(0);

  const [adClicks, setAdClicks] = useState(0);
  const [adGateCompleted, setAdGateCompleted] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);


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

    localStorage.removeItem("direct_link_completed");
    localStorage.removeItem("direct_link_clicks");

    localStorage.removeItem("step1_completed");
    localStorage.removeItem("step2_completed");
    localStorage.removeItem("step3_completed");
    localStorage.removeItem("verification_step");

    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.app_metadata?.provider === "google") setIsGoogleUser(true);
      } catch { /* noop */ }
    })();
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
    if (!cooldownUntil) return;
    const tick = () => {
      const remaining = Math.max(0, cooldownUntil - Date.now());
      setCooldownRemaining(remaining);
      if (remaining <= 0) {
        setAdGateCompleted(true);
        setCooldownUntil(null);
      }
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [cooldownUntil]);

  const handleAdGateClick = () => {
    if (cooldownUntil || adGateCompleted) return;
    if (adClicks < REQUIRED_AD_CLICKS) {
      window.open(DIRECT_LINK_URL, "_blank", "noopener,noreferrer");
      const next = adClicks + 1;
      setAdClicks(next);
      if (next >= REQUIRED_AD_CLICKS) {
        toast({ title: "Almost there", description: "Click once more to start the 10-minute cooldown." });
      }
      return;
    }
    // 3rd click → start cooldown
    setCooldownUntil(Date.now() + COOLDOWN_MS);
    toast({ title: "Cooldown started", description: "Please wait 10 minutes before continuing." });
  };

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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">ComboWick Verify</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 container flex flex-col items-center justify-center py-8">
        <div className="max-w-xl w-full mx-auto">
          {/* Build the active step list dynamically so the UI is never confusing */}
          {(() => {
            type Step = {
              key: string;
              title: string;
              done: boolean;
              icon: React.ReactNode;
              render: () => React.ReactNode;
            };

            const steps: Step[] = [];

            if (showSubscriptionGate) {
              steps.push({
                key: "subscribe",
                title: "Subscribe & Join (once per week)",
                done: subscriptionGateCompleted,
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
              key: "ad-gate",
              title: "Quick Ad Step (10-min wait)",
              done: adGateCompleted,
              icon: <ExternalLink className="h-4 w-4" />,
              render: () => {
                const inCooldown = cooldownUntil !== null && cooldownRemaining > 0;
                const mins = Math.floor(cooldownRemaining / 60000);
                const secs = String(Math.floor((cooldownRemaining % 60000) / 1000)).padStart(2, "0");
                return (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Click the button <span className="text-foreground font-semibold">2 times</span> (it opens a sponsor link in a new tab). On the <span className="text-foreground font-semibold">3rd click</span>, a 10-minute cooldown starts — once it ends, this step unlocks automatically.
                    </p>
                    <Button
                      onClick={handleAdGateClick}
                      disabled={inCooldown || adGateCompleted}
                      className="w-full bg-gradient-to-r from-primary via-purple-500 to-primary hover:shadow-lg hover:shadow-primary/40 transition-all"
                    >
                      {adGateCompleted ? (
                        <><CheckCircle2 className="mr-2 h-4 w-4" /> Cooldown Complete</>
                      ) : inCooldown ? (
                        <><Clock className="mr-2 h-4 w-4" /> Cooldown: {mins}:{secs}</>
                      ) : adClicks < REQUIRED_AD_CLICKS ? (
                        <><ExternalLink className="mr-2 h-4 w-4" /> Open Sponsor ({adClicks + 1} of {REQUIRED_AD_CLICKS})</>
                      ) : (
                        <><Clock className="mr-2 h-4 w-4" /> Start 10-Minute Cooldown</>
                      )}
                    </Button>
                    {inCooldown && (
                      <Progress value={((COOLDOWN_MS - cooldownRemaining) / COOLDOWN_MS) * 100} className="h-1" />
                    )}
                  </div>
                );
              },
            });

            steps.push({
              key: "provider",
              title: "Get Your Free Key",
              done: false,
              icon: <CheckCircle2 className="h-4 w-4" />,
              render: () => <AdProviderSelector providers={adProviders} onSelect={handleProviderSelect} />,
            });

            // Find the first incomplete step — that's the active one.
            const activeIdx = steps.findIndex((s) => !s.done);
            const completedCount = steps.slice(0, -1).filter((s) => s.done).length;
            const totalGates = steps.length - 1; // exclude final provider step
            const overallPercent = totalGates === 0 ? 100 : Math.round((completedCount / totalGates) * 100);

            return (
              <>
                <div className={`mb-4 rounded-lg border p-3 flex items-start gap-3 ${
                  todaySchedule.skipStep2
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-primary/20 bg-primary/5"
                }`}>
                  <CalendarDays className={`h-4 w-4 mt-0.5 shrink-0 ${todaySchedule.skipStep2 ? "text-green-400" : "text-primary"}`} />
                  <div className="text-xs leading-relaxed">
                    {todaySchedule.skipStep2 ? (
                      <>
                        <p className="font-semibold text-green-300">{todaySchedule.label} — Step 2 Skipped Today</p>
                        <p className="text-muted-foreground mt-0.5">You're getting a faster path today. Lucky you.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-foreground">Skip Step 2 on certain days</p>
                        <p className="text-muted-foreground mt-0.5">
                          Step 2 is automatically skipped on <span className="text-foreground font-medium">Wednesday</span>, <span className="text-foreground font-medium">Friday</span>, and <span className="text-foreground font-medium">weekends</span> — come back then for a quicker verification.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <Card className="border-primary/30 overflow-hidden">
                <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-2xl">Verification</CardTitle>
                      <CardDescription>Finish the steps below to unlock your free key.</CardDescription>
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
                        <li
                          key={step.key}
                          className={`p-5 transition-colors ${
                            isActive ? "bg-primary/5" : isDone ? "opacity-60" : isLocked ? "opacity-40" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isDone
                                ? "bg-green-500/20 text-green-300"
                                : isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground"
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
              </>
            );
          })()}
          
        </div>
      </main>
    </div>
  );
}
