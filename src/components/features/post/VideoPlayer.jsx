import React, { useRef, useEffect } from 'react';
import { Plyr } from 'plyr-react';

const VideoPlayer = ({ src, poster }) => {
    const playerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (playerRef.current?.plyr) {
                    if (entry.isIntersecting) {
                        playerRef.current.plyr.play().catch(() => {
                            // Autoplay might be blocked if not muted
                            playerRef.current.plyr.muted = true;
                            playerRef.current.plyr.play();
                        });
                    } else {
                        playerRef.current.plyr.pause();
                    }
                }
            },
            { threshold: 0.6 }
        );

        const currentElement = playerRef.current?.elements?.container;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    const plyrProps = {
        source: {
            type: 'video',
            sources: [{ src, type: 'video/mp4' }],
            poster: poster
        },
        options: {
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            settings: ['quality', 'speed'],
            ratio: '16:9',
            clickToPlay: true,
            hideControls: true,
            resetOnEnd: true
        }
    };

    return (
        <div className="mt-3 overflow-hidden rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 bg-black" onClick={(e) => e.stopPropagation()}>
            <Plyr ref={playerRef} {...plyrProps} />
        </div>
    );
};

export default VideoPlayer;