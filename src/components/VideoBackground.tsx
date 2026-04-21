import { useState, useEffect, useCallback, useRef } from "react";
import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";
import gallery4 from "@/assets/gallery-4.png";
import gallery5 from "@/assets/gallery-5.png";
import gallery6 from "@/assets/gallery-6.png";
import gallery7 from "@/assets/gallery-7.png";

const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7];

interface VideoBackgroundProps {
  className?: string;
  overlay?: boolean;
}

// Persist slideshow index across route navigations so it doesn't restart from
// image #1 each time the user comes back to /. Saves a re-render of the heavy
// hero animation and matches user expectation ("don't loop on every nav").
let cachedIndex = 0;

export function VideoBackground({ className = "", overlay = true }: VideoBackgroundProps) {
  const [current, setCurrent] = useState(cachedIndex);
  const [prev, setPrev] = useState<number | null>(null);
  const [sliding, setSliding] = useState(false);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Honor prefers-reduced-motion + tab visibility + element off-screen.
  // Saves CPU on low-end mobile (your largest segment).
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const goNext = useCallback(() => {
    setPrev(current);
    setSliding(true);
    setCurrent((c) => {
      const next = (c + 1) % images.length;
      cachedIndex = next;
      return next;
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSliding(false);
      setPrev(null);
    }, 1800);
  }, [current]);

  // Pause when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Pause when the tab is hidden
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    const id = setInterval(goNext, 6000);
    return () => clearInterval(id);
  }, [goNext, prefersReducedMotion, paused]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {prev !== null && !prefersReducedMotion && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            transform: sliding ? "translateX(-35%)" : "translateX(0)",
            opacity: sliding ? 0 : 1,
            transition: "transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <img
            src={images[prev]}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.55) saturate(1.15)" }}
          />
        </div>
      )}

      <div
        className="absolute inset-0 z-[2]"
        style={{
          animation: sliding && !prefersReducedMotion ? "slideIn 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none",
        }}
      >
        <img
          src={images[current]}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.55) saturate(1.15)" }}
        />
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {overlay && (
        <>
          <div className="absolute inset-0 z-[3] bg-gradient-to-b from-background/10 via-transparent to-background/80" />
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
        </>
      )}
    </div>
  );
}
