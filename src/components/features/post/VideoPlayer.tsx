import React, { useRef, useEffect, useMemo, useId, useState } from "react";
import { Plyr } from "plyr-react";
import { useVideoPlayback } from "@/context/VideoPlaybackContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const playerRef = useRef<any>(null);
  const { reportVisibility, unregister } = useVideoPlayback();
  const { dataSaver } = useTheme();
  const id = useId();
  const [isReady, setIsReady] = useState(false);

  const controls = useMemo(
    () => ({
      play: () => {
        const p = playerRef.current?.plyr;
        if (p) {
          p.muted = true;
          p.play().catch(() => { });
        }
      },
      pause: () => {
        const p = playerRef.current?.plyr;
        if (p && typeof p.pause === "function") {
          p.pause();
        }
      },
    }),
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = dataSaver ? 0 : entry.intersectionRatio;
        reportVisibility(id, ratio, controls);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }, // More granular thresholds
    );

    const currentElement = playerRef.current?.elements?.container;
    const currentPlayer = playerRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    // Reliable way to check for plyr ready state
    let checkInterval: any;
    const setupPlyr = () => {
      const plyr = playerRef.current?.plyr;
      if (plyr) {
        if (plyr.ready) {
          setIsReady(true);
        } else if (typeof plyr.on === 'function') {
          plyr.on('ready', () => setIsReady(true));
        }
        clearInterval(checkInterval);
      }
    };

    checkInterval = setInterval(setupPlyr, 50);
    setupPlyr();

    return () => {
      clearInterval(checkInterval);
      // Explicitly pause video before unregistering (handles navigation away)
      const p = currentPlayer?.plyr;
      if (p && typeof p.pause === "function") {
        p.pause();
      }
      unregister(id);
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [id, reportVisibility, unregister, controls, dataSaver]);

  const plyrProps = {
    source: {
      type: "video" as const,
      sources: [{ src, type: "video/mp4" }],
      poster: poster,
    },
    options: {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "fullscreen",
      ],
      settings: ["quality", "speed"],
      ratio: "16:9",
      clickToPlay: true,
      hideControls: true,
      resetOnEnd: true,
    },
  };

  return (
    <div className="relative w-full bg-zinc-900 overflow-hidden" onClick={(e) => e.stopPropagation()}>
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-900">
           <div className="size-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}
      <div className={cn("transition-opacity duration-500", isReady ? "opacity-100" : "opacity-0")}>
        <Plyr ref={playerRef} {...plyrProps} />
      </div>
    </div>
  );
};

export default VideoPlayer;
