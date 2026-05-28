import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

/**
 * Floating bottom-left chip that shows live translation status.
 * - Spinner while AI translation is in flight
 * - 4s success toast with a "Refresh page" hint once done
 */
export default function TranslationIndicator() {
  const { isTranslating, currentLanguage } = useTranslation();
  const [showDone, setShowDone] = useState(false);
  const [wasTranslating, setWasTranslating] = useState(false);

  useEffect(() => {
    if (isTranslating) {
      setWasTranslating(true);
      setShowDone(false);
    } else if (wasTranslating) {
      setShowDone(true);
      const t = setTimeout(() => setShowDone(false), 6000);
      return () => clearTimeout(t);
    }
  }, [isTranslating, wasTranslating]);

  if (currentLanguage === "en") return null;
  if (!isTranslating && !showDone) return null;

  return (
    <div
      data-no-translate
      className="fixed bottom-4 left-4 z-[9999] pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {isTranslating ? (
        <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-background/95 px-4 py-2 text-sm text-foreground shadow-lg backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Translating page…</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-background/95 px-4 py-2 text-sm text-foreground shadow-lg backdrop-blur">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Translation ready — refresh page to apply.</span>
        </div>
      )}
    </div>
  );
}
