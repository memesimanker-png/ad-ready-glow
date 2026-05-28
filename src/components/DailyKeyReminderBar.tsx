import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Flame, X } from "lucide-react";

// Daily return hook: free HWID keys reset every ~11 hours. A persistent reminder
// converts one-time visitors into daily returners. Auto-hides on key/verify flows
// to avoid covering critical UI.
const HIDE_ROUTES = [
  "/keys", "/access-key", "/claim-access", "/verify", "/premium-keys",
  "/ad-return", "/login", "/signup", "/register", "/admin", "/dashboard",
];
const RESET_INTERVAL_MS = 11 * 60 * 60 * 1000;
const STORAGE_KEY = "cw-key-reset-at";
const DISMISS_KEY = "cw-key-bar-dismissed-until";

function nextResetAt(): number {
  const saved = Number(localStorage.getItem(STORAGE_KEY) || 0);
  if (saved && saved > Date.now()) return saved;
  const next = Date.now() + RESET_INTERVAL_MS;
  localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

function format(ms: number) {
  if (ms <= 0) return "now";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function DailyKeyReminderBar() {
  const { pathname } = useLocation();
  const [remaining, setRemaining] = useState<number>(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (until > Date.now()) setDismissed(true);
    const target = nextResetAt();
    const tick = () => {
      const left = target - Date.now();
      if (left <= 0) {
        localStorage.removeItem(STORAGE_KEY);
        setRemaining(RESET_INTERVAL_MS);
        localStorage.setItem(STORAGE_KEY, String(Date.now() + RESET_INTERVAL_MS));
      } else {
        setRemaining(left);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (dismissed) return null;
  if (HIDE_ROUTES.some((r) => pathname.startsWith(r))) return null;

  const handleDismiss = () => {
    // Snooze for 6 hours
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 6 * 60 * 60 * 1000));
    setDismissed(true);
  };

  return (
    <div
      className="w-full bg-gradient-to-r from-[hsl(36_55%_18%)] via-[hsl(36_55%_28%)] to-[hsl(36_55%_18%)] border-b border-[hsl(36_55%_50%)]/40"
    >
      <div className="container mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 text-[hsl(40_30%_92%)]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Flame className="h-4 w-4 shrink-0 text-[hsl(36_85%_60%)] animate-pulse" />
          <p className="text-xs sm:text-sm font-medium truncate">
            <span className="hidden sm:inline">Your free daily key resets in </span>
            <span className="sm:hidden">Free key in </span>
            <span className="font-bold tabular-nums text-[hsl(40_85%_75%)]" data-no-translate>{format(remaining)}</span>
            <span className="hidden md:inline"> — claim before it expires.</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/keys"
            className="px-3 py-1 rounded-md bg-[hsl(40_30%_92%)] text-[hsl(36_55%_18%)] text-xs sm:text-sm font-bold hover:bg-white transition-colors"
          >
            Claim
          </Link>
          <button
            aria-label="Dismiss"
            onClick={handleDismiss}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
