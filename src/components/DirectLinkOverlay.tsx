import { useState, useEffect } from "react";
import { isInCooldown, getCooldownRemaining, triggerDirectLink } from "@/lib/direct-link-gate";

/**
 * Invisible full-screen overlay that requires 2 clicks to dismiss.
 * First click opens the direct link, second click dismisses the overlay.
 * Has a 5-minute cooldown — overlay won't show again until cooldown expires.
 */
export function DirectLinkOverlay() {
  const [phase, setPhase] = useState<"hidden" | "click1" | "click2">("hidden");

  useEffect(() => {
    if (!isInCooldown()) {
      setPhase("click1");
    }
  }, []);

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
