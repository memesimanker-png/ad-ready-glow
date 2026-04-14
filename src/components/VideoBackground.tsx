const HERO_VIDEO_URL = "https://iphiksvnuzpteoryrdxf.supabase.co/storage/v1/object/public/site-assets/hero-bg.mp4";

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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
        style={{ filter: "brightness(0.5) saturate(1.2)" }}
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>
      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        </>
      )}
    </div>
  );
}
