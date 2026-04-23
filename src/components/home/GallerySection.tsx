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

export function GallerySection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold font-heading text-center mb-2">The Gallery</h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">Combo_WICK vibes only.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border bg-muted/40 aspect-square"
              style={{
                // Low-impact shimmer placeholder while the image decodes.
                backgroundImage:
                  "linear-gradient(110deg, hsl(var(--muted)) 8%, hsl(var(--muted-foreground) / 0.08) 18%, hsl(var(--muted)) 33%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.6s linear infinite",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                // Hint the browser to render the image at the actual displayed size.
                // Mobile: 2-col grid with ~16px padding => ~50vw per tile.
                // Desktop (>=768px): 3-col grid in a max-w-6xl container => ~33vw, capped at ~380px.
                sizes="(min-width: 768px) min(33vw, 380px), 50vw"
                width={800}
                height={800}
                fetchPriority={i < 2 ? "high" : "low"}
                onLoad={(e) => {
                  // Drop the shimmer once the image is painted.
                  const parent = (e.currentTarget as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.style.animation = "none";
                    parent.style.backgroundImage = "none";
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-gallery-tile] { animation: none !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
