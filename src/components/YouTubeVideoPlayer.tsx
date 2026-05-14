import { useState, useEffect, useRef } from "react";

interface YouTubeVideoPlayerProps {
  step: string;
  onTimerComplete?: () => void;
  timerSeconds?: number;
}

const STEP_VIDEOS: Record<string, string> = {
  "provider-select": "zGkNbPgQQx4",
  step1: "zGkNbPgQQx4",
  step2: "zGkNbPgQQx4",
  step3: "zGkNbPgQQx4",
};

export function YouTubeVideoPlayer({ step, onTimerComplete, timerSeconds = 0 }: YouTubeVideoPlayerProps) {
  const videoId = STEP_VIDEOS[step] || "zGkNbPgQQx4";
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (timerSeconds > 0 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerSeconds, timeLeft]);

  useEffect(() => {
    if (timerSeconds > 0 && timeLeft === 0) {
      onTimerComplete?.();
    }
  }, [timeLeft, timerSeconds, onTimerComplete]);

  const shouldMute = step === "step2" || step === "step3";

  return (
    <div className="relative w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${shouldMute ? 1 : 0}&rel=0&enablejsapi=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
        {/* Countdown overlay removed — anti-bot gate runs invisibly via timerSeconds */}
      </div>
    </div>
  );
}
