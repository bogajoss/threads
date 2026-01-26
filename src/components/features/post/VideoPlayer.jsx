import React, { useRef, useEffect, useMemo } from "react";
import { Plyr } from "plyr-react";
import { useVideoPlayback } from "@/context/VideoPlaybackContext";
import { useId } from "react";

const VideoPlayer = ({ src, poster }) => {
  const playerRef = useRef(null);
  const { reportVisibility, unregister } = useVideoPlayback();
  const id = useId();

  // Stable play/pause references for the context to call
  const controls = useMemo(() => ({
    play: () => {
      const p = playerRef.current?.plyr;
      if (p) {
        p.muted = true; // Ensure muted for autoplay
        p.play().catch(() => { });
      }
    },
    pause: () => {
      playerRef.current?.plyr?.pause();
    }
  }), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Report visibility ratio to context
        // We use intersectionRatio directly
        reportVisibility(id, entry.intersectionRatio, controls);
      },
      { threshold: [0, 0.6] } // report at 0 (hidden) and 0.6 (playing threshold)
    );

    const currentElement = playerRef.current?.elements?.container;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      unregister(id);
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [id, reportVisibility, unregister, controls]);

  const plyrProps = {
    source: {
      type: "video",
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
    <div
      className="mt-3 overflow-hidden rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 bg-black"
      onClick={(e) => e.stopPropagation()}
    >
      <Plyr ref={playerRef} {...plyrProps} />
    </div>
  );
};

export default VideoPlayer;
