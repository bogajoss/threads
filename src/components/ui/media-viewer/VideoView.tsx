import React from "react";
import { VideoJSPlayer } from "@/components/features/post";
import { cn } from "@/lib/utils";

interface VideoViewProps {
    url: string;
    poster?: string;
}

const VideoView: React.FC<VideoViewProps> = ({ url, poster }) => {
    return (
        <div className="flex size-full items-center justify-center pointer-events-none">
            <div
                className={cn(
                    "relative w-full max-w-[95vw] max-h-[85vh] overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]",
                    "bg-black/40 backdrop-blur-sm border border-white/5 pointer-events-auto"
                )}
            >
                <VideoJSPlayer 
                    src={url} 
                    poster={poster} 
                    autoplay={true} 
                    showControls={true}
                    className="w-full h-auto"
                    fillContainer={false}
                    aspectRatio="16:9"
                />
            </div>
        </div>
    );
};

export default VideoView;
