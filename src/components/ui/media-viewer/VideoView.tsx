import React, { useRef } from "react";
import { Plyr } from "plyr-react";

interface VideoViewProps {
    url: string;
    poster?: string;
}

const VideoView: React.FC<VideoViewProps> = ({ url, poster }) => {
    const plyrRef = useRef<any>(null);

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
                <Plyr ref={plyrRef} {...plyrProps} />
            </div>
        </div>
    );
};

export default VideoView;
