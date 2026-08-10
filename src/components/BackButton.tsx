import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** Global floating "Back" button. Hidden on the landing page. Forces a full refresh. */
export function BackButton() {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  const goBack = () => {
    if (window.history.length > 1) {
      // Navigate back, then hard-refresh the resulting page.
      const done = () => {
        window.removeEventListener("popstate", done);
        window.location.reload();
      };
      window.addEventListener("popstate", done);
      window.history.back();
      // Fallback if popstate never fires (e.g. blocked navigation).
      setTimeout(() => window.location.reload(), 600);
    } else {
      window.location.href = "/";
    }
  };


  return (
    <button
      onClick={goBack}
      aria-label="Go back"
      className="fixed bottom-6 left-4 z-40 flex items-center gap-1.5 rounded-full border border-border bg-background/85 px-3.5 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-xl transition hover:bg-secondary active:scale-95"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </button>
  );
}
