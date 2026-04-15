import { useState, useCallback } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  url: string;
}

function getVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

/**
 * Lazy YouTube embed — shows a thumbnail with play button.
 * Only loads the iframe when the user clicks, saving bandwidth and resources.
 */
export function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const videoId = getVideoId(url);
  const [active, setActive] = useState(false);

  const activate = useCallback(() => setActive(true), []);

  if (!videoId) return null;

  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (active) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Video Tutorial"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      onClick={activate}
      className="relative w-full aspect-video rounded-lg overflow-hidden group cursor-pointer bg-secondary"
      aria-label="Play video tutorial"
    >
      <img
        src={thumbUrl}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="h-7 w-7 text-primary-foreground ml-1" />
        </div>
      </div>
    </button>
  );
}
