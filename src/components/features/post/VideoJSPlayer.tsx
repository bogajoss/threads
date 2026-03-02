import React, { useRef, useEffect, useId, useState } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import { useVideoPlayback } from "@/context/VideoPlaybackContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { 
  getCurrentlyPlayingPlayer, 
  setCurrentlyPlayingPlayer 
} from "@/lib/video-state";

interface VideoJSPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  className?: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  onReady?: (player: Player) => void;
  showControls?: boolean;
}

const VideoJSPlayer: React.FC<VideoJSPlayerProps> = ({
  src,
  poster,
  autoplay = false,
  loop = true,
  muted = true,
  volume = 1,
  className,
  aspectRatio = "16:9",
  onReady,
  showControls = true,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const onReadyRef = useRef(onReady);
  const { reportVisibility, unregister } = useVideoPlayback();
  const { dataSaver } = useTheme();
  const id = useId();
  const [isReady, setIsReady] = useState(false);

  // Keep onReady ref up to date
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Define controls for VideoPlaybackContext
  const controls = useRef({
    play: () => {
      const player = playerRef.current;
      if (!player || player.isDisposed() || !player.paused()) return;
      
      // Global Lock
      const globalPlayer = getCurrentlyPlayingPlayer();
      if (globalPlayer && globalPlayer !== player) {
        try { globalPlayer.pause(); } catch(e) {}
      }

      player.play()?.catch(() => {
        if (player && !player.isDisposed()) {
           player.muted(true);
           player.play()?.catch(() => {});
        }
      });
      
      setCurrentlyPlayingPlayer(player);
    },
    pause: () => {
      const player = playerRef.current;
      if (player && !player.isDisposed() && !player.paused()) {
        player.pause();
        if (getCurrentlyPlayingPlayer() === player) {
          setCurrentlyPlayingPlayer(null);
        }
      }
    },
  });

  useEffect(() => {
    // Initializing Video.js player
    if (!videoRef.current) return;

    // Clear existing
    videoRef.current.innerHTML = "";

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered", "vjs-custom-skin");
    videoRef.current.appendChild(videoElement);

    const player = (playerRef.current = videojs(videoElement, {
      autoplay: false,
      controls: showControls,
      responsive: true,
      fluid: true,
      poster: poster,
      loop: loop,
      muted: muted,
      preload: dataSaver ? "none" : "auto",
      html5: {
        vhs: { overrideNative: true },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
      sources: [{ src, type: "video/mp4" }],
      controlBar: showControls ? {
        children: [
          'playToggle',
          'progressControl',
          'currentTimeDisplay',
          'volumePanel',
          'fullscreenToggle',
        ],
      } : false,
    }, () => {
      if (!playerRef.current || playerRef.current.isDisposed()) return;
      setIsReady(true);
      
      // Sync volume immediately
      playerRef.current.volume(volume);
      playerRef.current.muted(muted || volume === 0);
      
      onReadyRef.current?.(playerRef.current);
      
      if (autoplay) {
        const promise = playerRef.current.play();
        if (promise !== undefined) {
          promise.catch(() => {
            if (playerRef.current && !playerRef.current.isDisposed()) {
              playerRef.current.muted(true);
              playerRef.current.play()?.catch(() => {});
            }
          });
        }
      }
    }));

    // Setup Visibility Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = dataSaver ? 0 : entry.intersectionRatio;
        reportVisibility(id, ratio, controls.current);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(videoRef.current);

    player.on('play', () => {
      setCurrentlyPlayingPlayer(player);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      setIsReady(false);
      unregister(id);
      if (videoRef.current) {
        observer.disconnect();
      }
    };
  }, [src, poster, dataSaver, id, reportVisibility, unregister, showControls]);

  // Separate effect for play/pause
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReady || player.isDisposed()) return;

    if (autoplay) {
      if (player.paused()) {
        const promise = player.play();
        if (promise !== undefined) {
          promise.catch(() => {
            if (player && !player.isDisposed()) {
              player.muted(true);
              player.play()?.catch(() => {});
            }
          });
        }
      }
    } else {
      if (!player.paused()) {
        player.pause();
      }
    }
  }, [autoplay, isReady]);

  // Separate effect for volume/mute/loop
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReady || player.isDisposed()) return;
    try {
      player.volume(volume);
      player.muted(muted || volume === 0);
      player.loop(loop);
    } catch (e) {
      console.warn("VideoJS state update failed:", e);
    }
  }, [volume, muted, loop, isReady]);

  return (
    <div 
      className={cn(
        "relative w-full bg-black overflow-hidden group",
        aspectRatio === "16:9" ? "aspect-video" : aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-square",
        className
      )}
    >
      {/* Custom Loading Spinner for Mobile */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-zinc-900">
           <div className="size-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <div 
        ref={videoRef} 
        className={cn(
          "w-full h-full transition-opacity duration-700", 
          isReady ? "opacity-100" : "opacity-0",
          !showControls && "pointer-events-none"
        )} 
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .vjs-custom-skin.video-js { font-size: 14px; color: #fff; }
        .vjs-custom-skin .vjs-big-play-button { 
          line-height: 2em; height: 2em; width: 2em; 
          border-radius: 50%; border: none; background-color: rgba(0,0,0,0.45);
          backdrop-filter: blur(8px);
        }
        .vjs-custom-skin .vjs-control-bar { background-color: rgba(0,0,0,0.2) !important; backdrop-filter: blur(4px); }
        .vjs-custom-skin .vjs-play-progress { background-color: #fff !important; }
        .vjs-custom-skin .vjs-slider { background-color: rgba(255,255,255,0.2); }
        .vjs-loading-spinner { border-color: rgba(255,255,255,0.8) !important; }
      `}} />
    </div>
  );
};

export default VideoJSPlayer;
