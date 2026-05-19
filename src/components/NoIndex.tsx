import { useEffect } from "react";

const GATE_PATHS = [
  "/verify",
  "/ad-return",
  "/access-key",
  "/claim-access",
  "/blocked",
  "/keys",
];

export function NoIndex() {
  useEffect(() => {
    const path = window.location.pathname;
    const isGate = GATE_PATHS.some((p) => path === p || path.startsWith(p + "/"));
    if (!isGate) return;

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    meta.setAttribute("data-noindex-gate", "true");
    document.head.appendChild(meta);
    return () => {
      document.querySelectorAll('meta[data-noindex-gate="true"]').forEach((el) => el.remove());
    };
  }, []);
  return null;
}
