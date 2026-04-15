import { useState, useEffect, useCallback } from "react";
import { isInCooldown, getCooldownRemaining, triggerDirectLink } from "@/lib/direct-link-gate";

/**
 * Invisible full-screen overlay that requires 2 clicks to dismiss.
 * First click opens the direct link, second click dismisses the overlay.
 * Has a 5-minute cooldown — overlay won't show again until cooldown expires.
 * Re-checks cooldown on window focus to handle tab switches.
 */
export function DirectLinkOverlay() {
  const [phase, setPhase] = useState<"hidden" | "click1" | "click2">("hidden");

  const checkAndShow = useCallback(() => {
    if (!isInCooldown()) {
      setPhase("click1");
    } else {
      setPhase("hidden");
    }
  }, []);

  useEffect(() => {
    checkAndShow();

    // Re-check on focus in case cooldown expired while tab was away
    const onFocus = () => {
      if (phase === "hidden") checkAndShow();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Set a timer to re-show overlay when cooldown expires
  useEffect(() => {
    if (phase !== "hidden") return;
    const remaining = getCooldownRemaining();
    if (remaining <= 0) return;

    const timer = setTimeout(() => {
      setPhase("click1");
    }, remaining * 1000);

    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] cursor-default"
      style={{ background: "transparent" }}
      onClick={() => {
        if (phase === "click1") {
          triggerDirectLink();
          setPhase("click2");
        } else if (phase === "click2") {
          setPhase("hidden");
        }
      }}
    />
  );
}
