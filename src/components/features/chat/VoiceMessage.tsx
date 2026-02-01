import React, { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import { Play, Pause, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceMessageProps {
    url: string
    duration?: number
    isMe: boolean
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ url, duration, isMe }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const wavesurferRef = useRef<WaveSurfer | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [totalDuration, setTotalDuration] = useState(duration || 0)

    useEffect(() => {
        if (!containerRef.current) return

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: isMe ? "rgba(255, 255, 255, 0.3)" : "rgba(139, 92, 246, 0.2)",
            progressColor: isMe ? "#fff" : "#8b5cf6",
            cursorColor: "transparent",
            barWidth: 3,
            barGap: 3,
            barRadius: 30,
            height: 36,
            normalize: true,
            url: url,
        })

        wavesurferRef.current = ws

        ws.on("ready", () => {
            setIsReady(true)
            if (!duration) {
                setTotalDuration(ws.getDuration())
            }
        })

        ws.on("play", () => setIsPlaying(true))
        ws.on("pause", () => setIsPlaying(false))
        ws.on("finish", () => {
            setIsPlaying(false)
            ws.setTime(0)
            setCurrentTime(0)
        })
        ws.on("audioprocess", () => {
            setCurrentTime(ws.getCurrentTime())
        })
        ws.on("interaction", () => {
            setCurrentTime(ws.getCurrentTime())
        })

        return () => {
            ws.destroy()
        }
    }, [url, isMe, duration])

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause()
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    return (
        <div className={cn(
            "flex items-center gap-3 py-1.5 px-0.5 min-w-[220px] md:min-w-[260px]",
            isMe ? "text-white" : "text-zinc-900 dark:text-white"
        )}>
            <button
                type="button"
                onClick={togglePlay}
                disabled={!isReady}
                className={cn(
                    "size-11 flex shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-90 shadow-sm",
                    isMe 
                        ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm" 
                        : "bg-violet-500 text-white hover:bg-violet-600 shadow-violet-200 dark:shadow-none"
                )}
            >
                {!isReady ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                ) : (
                    <Play size={20} fill="currentColor" className="ml-1" />
                )}
            </button>

            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                <div ref={containerRef} className="w-full cursor-pointer" />
                <div className="flex justify-between items-center text-[10px] font-bold tracking-tight uppercase opacity-80">
                    <span className="tabular-nums">{formatTime(currentTime)}</span>
                    <span className="tabular-nums">{totalDuration ? formatTime(totalDuration) : "0:00"}</span>
                </div>
            </div>
        </div>
    )
}

export default VoiceMessage
