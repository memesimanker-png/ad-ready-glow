import heroVideoAsset from "/public/videos/hero-bg.mp4.asset.json";

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
        <source src={heroVideoAsset.url} type="video/mp4" />
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
