import React, { useRef, useEffect, useMemo, useId } from "react";
import { Plyr } from "plyr-react";
import { useVideoPlayback } from "@/context/VideoPlaybackContext";
import { useTheme } from "@/context/ThemeContext";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const playerRef = useRef<any>(null);
  const { reportVisibility, unregister } = useVideoPlayback();
  const { dataSaver } = useTheme();
  const id = useId();

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
        playerRef.current?.plyr?.pause();
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
    if (currentElement) {
      observer.observe(currentElement);
    }
    return () => {
      // Explicitly pause video before unregistering (handles navigation away)
      playerRef.current?.plyr?.pause();
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
    <div className="w-full bg-black" onClick={(e) => e.stopPropagation()}>
      <Plyr ref={playerRef} {...plyrProps} />
    </div>
  );
};

export default VideoPlayer;
