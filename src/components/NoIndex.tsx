import { useEffect } from "react";

/**
 * Injects <meta name="robots" content="noindex,nofollow"> into <head>.
 * Use on gate pages (verify, ad-return, access-key, claim-access, blocked,
 * register, unsubscribe) so Googlebot doesn't index dead-end pages and flag
 * the site for "navigation issues" during AdSense review.
 */
export function NoIndex() {
  useEffect(() => {
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
