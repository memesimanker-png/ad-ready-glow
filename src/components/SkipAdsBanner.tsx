import { Link } from "react-router-dom";
import { Crown, Sparkles } from "lucide-react";

export function SkipAdsBanner() {
  return (
    <div className="border-y border-primary/20 bg-card/80 backdrop-blur">
      <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Want to skip the ad steps?</p>
            <p className="text-xs text-muted-foreground">Premium keys unlock faster access without the free-key verification route.</p>
          </div>
        </div>
        <Link
          to="/premium-keys"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Crown className="h-4 w-4" />
          View Premium
        </Link>
      </div>
    </div>
  );
}