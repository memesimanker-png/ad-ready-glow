import { useState, useEffect, useRef } from "react";
import gallery1 from "@/assets/gallery-1.webp";
import gallery2 from "@/assets/gallery-2.webp";
import gallery3 from "@/assets/gallery-3.webp";
import gallery4 from "@/assets/gallery-4.webp";
import gallery5 from "@/assets/gallery-5.webp";
import gallery6 from "@/assets/gallery-6.webp";
import gallery7 from "@/assets/gallery-7.webp";

const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7];

interface VideoBackgroundProps {
  className?: string;
  overlay?: boolean;
}

// Persist slideshow index across route navigations so it doesn't restart from
// image #1 each time the user comes back to /.
let cachedIndex = 0;

const SLIDE_INTERVAL = 5000;

export function VideoBackground({ className = "", overlay = true }: VideoBackgroundProps) {
  const [current, setCurrent] = useState(cachedIndex);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Pause when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 }
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

  // Auto-advance slideshow
  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    const id = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % images.length;
        cachedIndex = next;
        return next;
      });
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [prefersReducedMotion, paused]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === current ? 1 : 0,
            filter: "brightness(0.55) saturate(1.15)",
            transition: "opacity 1.4s ease-in-out",
            zIndex: 1,
          }}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}

      {overlay && (
        <>
          <div className="absolute inset-0 z-[3] bg-gradient-to-b from-background/10 via-transparent to-background/80" />
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
        </>
      )}
    </div>
  );
}
