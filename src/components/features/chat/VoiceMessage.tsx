import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceMessageProps {
  url: string;
  duration?: number;
  isMe: boolean;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ url, duration, isMe }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: isMe ? "rgba(255, 255, 255, 0.4)" : "rgba(139, 92, 246, 0.25)",
      progressColor: isMe ? "#ffffff" : "#8b5cf6",
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 2,
      barRadius: 1,
      height: 24,
      normalize: true,
      url: url,
    });

    wavesurferRef.current = ws;

    ws.on("ready", () => {
      setIsReady(true);
      if (!duration) {
        setTotalDuration(ws.getDuration());
      }
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => {
      setIsPlaying(false);
      ws.setTime(0);
      setCurrentTime(0);
    });
    ws.on("audioprocess", () => {
      setCurrentTime(ws.getCurrentTime());
    });
    ws.on("interaction", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    return () => {
      ws.destroy();
    };
  }, [url, isMe, duration]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1 px-1 min-w-[200px] md:min-w-[240px]",
        isMe ? "text-white" : "text-zinc-900 dark:text-white",
      )}
    >
      {/* Play Button */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!isReady}
        className={cn(
          "size-9 flex shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-90",
          isMe
            ? "bg-white/20 hover:bg-white/30 text-white"
            : "bg-violet-500 text-white hover:bg-violet-600",
        )}
      >
        {!isReady ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col justify-center min-w-0">
        {/* Waveform Container */}
        <div className="relative h-6 flex items-center">
          <div ref={containerRef} className="w-full cursor-pointer" />
        </div>

        {/* Time Display */}
        <div className="flex items-center gap-1.5 mt-0.5 opacity-80 select-none">
          <span className="text-[11px] font-medium tabular-nums">
            {isPlaying || currentTime > 0
              ? formatTime(currentTime)
              : formatTime(totalDuration)}
          </span>
          {isPlaying && (
            <div className="flex gap-[2px]">
              <div className="size-1 rounded-full bg-current animate-pulse" />
              <div className="size-1 rounded-full bg-current animate-pulse delay-75" />
              <div className="size-1 rounded-full bg-current animate-pulse delay-150" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;
