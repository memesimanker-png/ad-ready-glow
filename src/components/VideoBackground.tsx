import { useCallback, useEffect, useState } from "react";
import gallery1 from "@/assets/gallery-1.webp";
import gallery2 from "@/assets/gallery-2.webp";
import gallery3 from "@/assets/gallery-3.webp";
import gallery4 from "@/assets/gallery-4.webp";
import gallery7 from "@/assets/gallery-7.webp";

const images = [gallery1, gallery2, gallery3, gallery4, gallery7];

interface VideoBackgroundProps {
  className?: string;
  overlay?: boolean;
}

let cachedIndex = 0;
const loadedSlides = new Set<number>();
const preloadCache = new Map<string, Promise<void>>();

const SLIDE_INTERVAL = 5000;

function warmImage(src: string, index: number) {
  if (loadedSlides.has(index)) return Promise.resolve();
  const existing = preloadCache.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve) => {
    if (typeof Image === "undefined") {
      loadedSlides.add(index);
      resolve();
      return;
    }

    const img = new Image();
    img.decoding = "async";
    img.src = src;

    const finish = () => {
      loadedSlides.add(index);
      resolve();
    };

    if (img.complete) {
      finish();
      return;
    }

    img.onload = finish;
    img.onerror = finish;
  });

  preloadCache.set(src, promise);
  return promise;
}

function getNextLoadedIndex(current: number, loaded: boolean[]) {
  if (!loaded.some(Boolean)) return current;

  for (let step = 1; step <= images.length; step += 1) {
    const next = (current + step) % images.length;
    if (loaded[next]) return next;
  }

  return current;
}

export function VideoBackground({ className = "", overlay = true }: VideoBackgroundProps) {
  const [current, setCurrent] = useState(() => cachedIndex % images.length);
  const [loaded, setLoaded] = useState(() => images.map((_, index) => loadedSlides.has(index)));
  const [isPageVisible, setIsPageVisible] = useState(() =>
    typeof document === "undefined" ? true : !document.hidden
  );

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    let cancelled = false;

    images.forEach((src, index) => {
      warmImage(src, index).then(() => {
        if (cancelled) return;
        setLoaded((prev) => {
          if (prev[index]) return prev;
          const next = [...prev];
          next[index] = true;
          return next;
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onVis = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const markLoaded = useCallback((index: number) => {
    loadedSlides.add(index);
    setLoaded((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  useEffect(() => {
    const firstLoadedIndex = loaded.findIndex(Boolean);
    if (firstLoadedIndex === -1) return;

    if (!loaded[current]) {
      cachedIndex = firstLoadedIndex;
      setCurrent(firstLoadedIndex);
    }
  }, [current, loaded]);

  const canAdvance = !prefersReducedMotion && isPageVisible && loaded.filter(Boolean).length > 1;

  useEffect(() => {
    if (!canAdvance) return;

    const id = setInterval(() => {
      setCurrent((currentIndex) => {
        const next = getNextLoadedIndex(currentIndex, loaded);
        cachedIndex = next;
        return next;
      });
    }, SLIDE_INTERVAL);

    return () => clearInterval(id);
  }, [canAdvance, loaded]);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-muted ${className}`}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          aria-hidden="true"
          onLoad={() => markLoaded(i)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === current && loaded[i] ? 1 : 0,
            filter: "brightness(0.55) saturate(1.15)",
            transition: "opacity 1.4s ease-in-out",
            zIndex: 1,
          }}
          loading="eager"
          decoding="async"
          fetchPriority={i <= 1 ? "high" : "low"}
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
