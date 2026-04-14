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

export function VideoBackground({ className = "", overlay = true }: VideoBackgroundProps) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [sliding, setSliding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const goNext = useCallback(() => {
    setPrev(current);
    setSliding(true);
    setCurrent((c) => (c + 1) % images.length);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSliding(false);
      setPrev(null);
    }, 1800);
  }, [current]);

  useEffect(() => {
    const id = setInterval(goNext, 6000);
    return () => clearInterval(id);
  }, [goNext]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {prev !== null && (
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
          animation: sliding ? "slideIn 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none",
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
