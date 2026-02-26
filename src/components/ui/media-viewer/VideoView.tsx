import React, { useRef, useState, useEffect } from "react";
import { Plyr } from "plyr-react";
import { cn } from "@/lib/utils";

interface VideoViewProps {
    url: string;
    poster?: string;
}

const VideoView: React.FC<VideoViewProps> = ({ url, poster }) => {
    const plyrRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let checkInterval: any;
        const setupPlyr = () => {
            const plyr = plyrRef.current?.plyr;
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

        return () => clearInterval(checkInterval);
    }, []);

    const handleVideoClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Don't toggle if clicking on controls or settings menu
        const target = e.target as HTMLElement;
        if (target.closest('.plyr__controls') || target.closest('.plyr__menu')) {
            return;
        }

        if (plyrRef.current?.plyr) {
            const player = plyrRef.current.plyr;
            player.togglePlay();
        }
    };

    const plyrProps = {
        source: {
            type: "video" as const,
            sources: [{ src: url, type: "video/mp4" }],
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
            autoplay: true,
            clickToPlay: false,
            resetOnEnd: true,
        },
    };

    return (
        <div className="flex size-full items-center justify-center">
            <div
                className="relative w-full max-w-[95vw] max-h-[85vh] overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-sm border border-white/5 pointer-events-auto"
                onClick={handleVideoClick}
            >
                {!isReady && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                        <div className="size-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                    </div>
                )}
                <div className={cn("transition-opacity duration-500", isReady ? "opacity-100" : "opacity-0")}>
                    <Plyr ref={plyrRef} {...plyrProps} />
                </div>
            </div>
        </div>
    );
};

export default VideoView;
