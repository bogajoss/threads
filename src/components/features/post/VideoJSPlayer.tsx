import React, { useRef, useEffect, useId, useState, useCallback } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import { useVideoPlayback } from "@/context/VideoPlaybackContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { 
  setCurrentlyPlayingPlayer 
} from "@/lib/video-state";
import { Play, Pause, FastForward, Rewind, Maximize, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Slider } from "@/components/ui/slider";

interface VideoJSPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  className?: string;
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:5";
  onReady?: (player: Player) => void;
  showControls?: boolean;
  fillContainer?: boolean;
  enableDoubleTapSkip?: boolean;
  enableTapPause?: boolean;
  objectFit?: "cover" | "contain";
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
  fillContainer = false,
  enableDoubleTapSkip = true,
  enableTapPause = true,
  objectFit = "contain",
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { reportVisibility, unregister } = useVideoPlayback();
  const { dataSaver } = useTheme();
  const id = useId();
  
  // State for Custom UI
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [feedback, setFeedback] = useState<"play" | "pause" | "forward" | "rewind" | null>(null);
  const [internalVolume, setInternalVolume] = useState(volume);
  const [showVolume, setShowVolume] = useState(false);
  
  const uiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Define controls for VideoPlaybackContext
  const controls = useRef({
    play: () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.play()?.catch(() => {});
      }
    },
    pause: () => {
      const player = playerRef.current;
      if (player && !player.isDisposed() && !player.paused()) {
        try { player.pause(); } catch(e) {}
      }
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const player = playerRef.current;
    if (!player) return;

    if (player.paused()) {
      player.play()?.catch(() => {});
      setFeedback("play");
    } else {
      player.pause();
      setFeedback("pause");
    }
    
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 800);
  }, []);

  const handleSkip = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player) return;

    const time = player.currentTime() || 0;
    const dur = player.duration() || 0;
    player.currentTime(Math.min(Math.max(0, time + seconds), dur));
    
    setFeedback(seconds > 0 ? "forward" : "rewind");
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 800);
  }, []);

  const handleInteraction = (e: React.MouseEvent) => {
    if (enableDoubleTapSkip || enableTapPause) {
      e.stopPropagation();
    } else {
      return; // Let it bubble
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      if (enableDoubleTapSkip) {
        if (x < width / 3) handleSkip(-10);
        else if (x > (width * 2) / 3) handleSkip(10);
        else togglePlay();
      } else {
        togglePlay();
      }
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        if (enableTapPause) togglePlay();
      }, 250);
    }
    
    // Show UI on interaction
    triggerUIShow();
  };

  const triggerUIShow = useCallback(() => {
    setShowUI(true);
    if (uiTimer.current) clearTimeout(uiTimer.current);
    uiTimer.current = setTimeout(() => {
      if (playerRef.current && !playerRef.current.paused()) {
        setShowUI(false);
      }
    }, 3000);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.innerHTML = "";
    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-custom-skin");
    videoRef.current.appendChild(videoElement);

    const player = (playerRef.current = videojs(videoElement, {
      autoplay: false,
      controls: false, // We use custom UI
      responsive: true,
      fill: true,
      fluid: false,
      poster: poster,
      loop: loop,
      muted: muted,
      preload: dataSaver ? "none" : "auto",
      sources: [{ src, type: "video/mp4" }],
    }, () => {
      setIsReady(true);
      player.volume(volume);
      onReady?.(player);
      if (autoplay) {
        player.play()?.catch(() => {
          player.muted(true);
          player.play()?.catch(() => {});
        });
      }
    }));

    player.on("play", () => { setIsPlaying(true); setCurrentlyPlayingPlayer(player); triggerUIShow(); });
    player.on("pause", () => { setIsPlaying(false); setShowUI(true); });
    player.on("timeupdate", () => { if (!isDragging) setCurrentTime(player.currentTime() || 0); });
    player.on("loadedmetadata", () => setDuration(player.duration() || 0));
    player.on("volumechange", () => {
      setIsMuted(player.muted() || player.volume() === 0);
      setInternalVolume(player.volume() || 0);
    });

    const observer = new IntersectionObserver(
      ([entry]) => reportVisibility(id, dataSaver ? 0 : entry.intersectionRatio, controls.current),
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(videoRef.current);

    return () => {
      unregister(id);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      observer.disconnect();
    };
  }, [src]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReady) return;
    player.volume(volume);
    player.muted(muted || volume === 0);
  }, [volume, muted, isReady]);

  const handleSeek = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const player = playerRef.current;
    if (!player || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = Math.min(Math.max(0, clientX - rect.left), rect.width);
    const percentage = pos / rect.width;
    
    const newTime = percentage * duration;
    player.currentTime(newTime);
    setCurrentTime(newTime);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full bg-zinc-950 overflow-hidden group flex items-center justify-center select-none",
        fillContainer ? "h-full" : (
          aspectRatio === "16:9" ? "aspect-video" : 
          aspectRatio === "9:16" ? "aspect-[9/16]" : 
          aspectRatio === "4:5" ? "aspect-[4/5]" :
          "aspect-square"
        ),
        className
      )}
      onMouseMove={triggerUIShow}
    >
      <div ref={videoRef} className="size-full" />

      {/* Interaction Layer */}
      <div className="absolute inset-0 z-10" onClick={handleInteraction} />

      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-zinc-950">
           <div className="size-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Feedback Central Icon */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="size-24 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10">
              {feedback === "play" && <Play size={40} fill="white" className="ml-1 text-white" />}
              {feedback === "pause" && <Pause size={40} fill="white" className="text-white" />}
              {feedback === "forward" && <FastForward size={40} fill="white" className="text-white" />}
              {feedback === "rewind" && <Rewind size={40} fill="white" className="text-white" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern UI Controls */}
      <AnimatePresence>
        {showControls && showUI && isReady && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none"
          >
            {/* Top Shadow */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
            
            {/* Bottom Controls Area */}
            <div className="relative p-4 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-auto">
              
              {/* Custom Scrubber */}
              <div 
                className="group/scrubber relative h-6 mb-2 flex items-center cursor-pointer"
                onMouseDown={(e) => { setIsDragging(true); handleSeek(e); }}
                onMouseMove={(e) => { if (isDragging) handleSeek(e); }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onClick={handleSeek}
              >
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden transition-all group-hover/scrubber:h-1.5">
                  <div 
                    className="h-full bg-white relative transition-all duration-75"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full scale-0 group-hover/scrubber:scale-100 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                    {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                  </button>

                  {/* Pro Left-side Volume Control */}
                  <div className="flex items-center gap-2" dir="ltr">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVolume(!showVolume);
                      }} 
                      className="text-white hover:scale-110 transition-transform"
                    >
                      {isMuted || internalVolume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    
                    <AnimatePresence>
                      {showVolume && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 100, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          className="overflow-hidden flex items-center px-2"
                          dir="ltr"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Slider
                            value={[isMuted ? 0 : internalVolume * 100]}
                            max={100}
                            step={1}
                            onValueChange={([val]) => {
                              const v = val / 100;
                              setInternalVolume(v);
                              if (playerRef.current) {
                                playerRef.current.volume(v);
                                playerRef.current.muted(v === 0);
                              }
                            }}
                            className="w-20"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[13px] font-bold text-white/90 tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-white/40">/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      containerRef.current?.requestFullscreen();
                    }}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .vjs-custom-skin .vjs-tech { object-fit: ${objectFit} !important; }
        video::-webkit-media-controls { display:none !important; }
      `}} />
    </div>
  );
};

export default VideoJSPlayer;
