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
      waveColor: isMe
        ? "rgba(255, 255, 255, 0.35)"
        : "rgba(135, 116, 225, 0.25)",
      progressColor: isMe ? "#ffffff" : "#8774e1",
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 3,
      barRadius: 2,
      height: 28,
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
    ws.on("audioprocess", () => setCurrentTime(ws.getCurrentTime()));
    ws.on("interaction", () => setCurrentTime(ws.getCurrentTime()));

    return () => ws.destroy();
  }, [url, isMe, duration]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    wavesurferRef.current?.playPause();
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 py-1 min-w-[220px] md:min-w-[280px]">
      {/* Telegram Style Play Button */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!isReady}
        className={cn(
          "size-10 flex shrink-0 items-center justify-center rounded-full transition-all active:scale-90",
          isMe ? "bg-white/20 text-white" : "bg-[#8774e1] text-white",
        )}
      >
        {!isReady ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={20} fill="currentColor" />
        ) : (
          <Play size={20} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col justify-center min-w-0">
        {/* Waveform */}
        <div className="h-7 w-full overflow-hidden">
          <div ref={containerRef} className="w-full cursor-pointer" />
        </div>

        {/* Time Info */}
        <div
          className={cn(
            "text-[11px] font-medium mt-0.5 select-none tabular-nums",
            isMe ? "text-white/80" : "text-[#8774e1]",
          )}
        >
          {isPlaying || currentTime > 0
            ? formatTime(currentTime)
            : formatTime(totalDuration)}
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;
