import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';
import { Plyr } from 'plyr-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ReelItem = ({ reel }) => {
    const playerRef = useRef(null);
    const [showHeart, setShowHeart] = useState(false);
    const lastTap = useRef(0);

    const videoUrl = Array.isArray(reel.media) ? reel.media[0]?.src || reel.media[0]?.url : (reel.media?.src || reel.media?.url || reel.url);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (playerRef.current?.plyr) {
                    if (entry.isIntersecting) {
                        playerRef.current.plyr.play().catch(() => {
                            playerRef.current.plyr.muted = true;
                            playerRef.current.plyr.play();
                        });
                    } else {
                        playerRef.current.plyr.pause();
                    }
                }
            },
            { threshold: 0.8 }
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

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 1000);
            // In a real app, call the like API here
        }
        lastTap.current = now;
    };

    const plyrProps = {
        source: {
            type: 'video',
            sources: [{ src: videoUrl, type: 'video/mp4' }]
        },
        options: {
            controls: [], // Hide all controls for a TikTok feel
            loop: { active: true },
            clickToPlay: true,
            ratio: '9:16',
        }
    };

    return (
        <div 
            className="relative h-screen w-full bg-black snap-start flex items-center justify-center overflow-hidden"
            onClick={handleDoubleTap}
        >
            <div className="w-full h-full max-w-[450px]">
                <Plyr ref={playerRef} {...plyrProps} />
            </div>

            <AnimatePresence>
                {showHeart && (
                    <Motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                    >
                        <Heart size={100} fill="white" className="text-white drop-shadow-2xl" />
                    </Motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
            
            <div className="absolute bottom-20 left-4 right-16 text-white pointer-events-none">
                <div className="flex items-center gap-2 mb-3 pointer-events-auto">
                    <Avatar className="size-10 border-2 border-white">
                        <AvatarImage src={reel.user?.avatar} alt={reel.user?.handle} className="object-cover" />
                        <AvatarFallback>{reel.user?.handle?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold">@{reel.user?.handle}</span>
                    <button className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full ml-2 hover:scale-105 active:scale-95 transition-all">Follow</button>
                </div>
                <p className="text-sm mb-3 line-clamp-2">{reel.content}</p>
                <div className="flex items-center gap-2 text-xs opacity-90">
                    <Music size={14} className="animate-spin-slow" />
                    <span>Original Audio - {reel.user?.handle}</span>
                </div>
            </div>

            <div className="absolute bottom-20 right-2 flex flex-col items-center gap-6 z-10">
                <div className="flex flex-col items-center gap-1">
                    <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90"><Heart size={28} /></button>
                    <span className="text-white text-xs font-bold">{reel.stats?.likes || 0}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90"><MessageCircle size={28} /></button>
                    <span className="text-white text-xs font-bold">{reel.stats?.comments || 0}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90"><Share2 size={28} /></button>
                    <span className="text-white text-xs font-bold">{reel.stats?.shares || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default ReelItem;
