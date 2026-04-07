const HERO_VIDEO_URL = "/__l5e/assets-v1/73134011-4f3e-46fe-a25b-cc81de0d3633/hero-bg.mp4";

interface VideoBackgroundProps {
  className?: string;
  overlay?: boolean;
}

export function VideoBackground({ className = "", overlay = true }: VideoBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.3) saturate(1.4)" }}
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>
      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        </>
      )}
    </div>
  );
}
