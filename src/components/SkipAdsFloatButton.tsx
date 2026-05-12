import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

export function SkipAdsFloatButton() {
  return (
    <Link
      to="/premium-keys"
      className="fixed bottom-4 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-md sm:px-4 sm:py-3"
      aria-label="View Premium Keys"
    >
      <Crown className="h-5 w-5" />
      <span className="hidden text-sm font-semibold sm:inline">Skip Ads</span>
    </Link>
  );
}