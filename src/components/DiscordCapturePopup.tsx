import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";

const STORAGE_KEY = "discord_popup_dismissed_v1";
const DISMISS_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days
const DELAY_BEFORE_SHOW = 25_000; // 25s of engagement before asking

/**
 * Lightweight Discord/community capture popup.
 * - Fires once per visitor every 14 days (no spam)
 * - Waits 25s so it doesn't interrupt the first read
 * - Honors prefers-reduced-motion
 * - Closes on Esc / backdrop / X
 */
export function DiscordCapturePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = Number(localStorage.getItem(STORAGE_KEY) || 0);
      if (Date.now() - dismissed < DISMISS_DURATION) return;
    } catch {}

    const t = setTimeout(() => setOpen(true), DELAY_BEFORE_SHOW);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 motion-safe:animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />
      <div
        className="relative w-full max-w-sm rounded-2xl border border-primary/30 bg-card shadow-2xl overflow-hidden motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/40" />
        <div className="p-6">
          <button
            onClick={dismiss}
            aria-label="Close"
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-full p-1.5 hover:bg-secondary"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-[#5865F2]/15 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-[#5865F2]" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold leading-tight">Join 50K+ on Discord</h2>
              <p className="text-xs text-muted-foreground">Free script drops, key giveaways, support</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Be first to get new Roblox scripts, premium key giveaways and 24/7 community help — straight in our Discord server.
          </p>

          <a
            href="https://discord.com/invite/ufrz9Zaqs8"
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="block w-full text-center py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-sm transition-colors"
          >
            Join the Discord — it's free
          </a>
          <button
            onClick={dismiss}
            className="block w-full text-center py-2.5 mt-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
