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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border bg-card aspect-[3/4]"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={400}
                height={533}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
