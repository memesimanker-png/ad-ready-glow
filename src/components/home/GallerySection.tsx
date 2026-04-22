import { useEffect, useRef, useState } from "react";
import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";
import gallery4 from "@/assets/gallery-4.png";
import gallery5 from "@/assets/gallery-5.png";
import gallery6 from "@/assets/gallery-6.png";
import gallery7 from "@/assets/gallery-7.png";

const images = [
  { src: gallery1, alt: "Combo_WICK character with swords" },
  { src: gallery2, alt: "Combo_WICK in a car" },
  { src: gallery3, alt: "Combo_WICK mirror selfie" },
  { src: gallery4, alt: "Combo_WICK with cows" },
  { src: gallery5, alt: "Combo_WICK vibes" },
  { src: gallery6, alt: "Combo_WICK style" },
  { src: gallery7, alt: "Combo_WICK drip" },
];

const SLIDE_INTERVAL = 4000;

/**
 * Auto-sliding marquee gallery. Pauses on hover.
 * Honors prefers-reduced-motion via the wrapper component <MotionConfig>
 * (we manually pause the timer too for safety on low-end mobiles).
 */
export function GallerySection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold font-heading text-center mb-2">The Gallery</h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">Combo_WICK vibes only.</p>

        {/* Sliding viewport */}
        <div
          className="relative overflow-hidden rounded-2xl border border-border bg-card"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((img, i) => (
              <div key={i} className="relative shrink-0 w-full aspect-[16/9] sm:aspect-[21/9]">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-primary" : "w-1.5 bg-foreground/30 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
