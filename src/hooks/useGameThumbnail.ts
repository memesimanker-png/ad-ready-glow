import { useState, useEffect } from "react";
import { fetchGameThumbnail } from "@/lib/roblox-thumbnails";

export function useGameThumbnail(gameName: string) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchGameThumbnail(gameName).then((url) => {
      if (!cancelled) setThumbnail(url);
    });
    return () => { cancelled = true; };
  }, [gameName]);

  return thumbnail;
}
