import React from 'react';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';

const ReelItem = ({ reel }) => {
    // Media for Supabase might be an array or object
    const videoUrl = Array.isArray(reel.media) ? reel.media[0]?.src : (reel.media?.src || reel.url);

    return (
        <div className="relative h-screen w-full bg-black snap-start flex items-center justify-center">
            <video src={videoUrl} className="h-full w-full object-contain" loop autoPlay muted />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            <div className="absolute bottom-20 left-4 right-12 text-white">
                <div className="flex items-center gap-2 mb-3">
                    <img src={reel.user?.avatar} className="size-10 rounded-full border-2 border-white object-cover" alt="" />
                    <span className="font-bold">@{reel.user?.handle}</span>
                    <button className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full ml-2">Follow</button>
                </div>
                <p className="text-sm mb-3 line-clamp-2">{reel.content}</p>
                <div className="flex items-center gap-2 text-xs opacity-90">
                    <Music size={14} className="animate-spin-slow" />
                    <span>Original Audio - {reel.user?.handle}</span>
                </div>
            </div>
            <div className="absolute bottom-20 right-2 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-1">
                    <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors"><Heart size={28} /></button>
                    <span className="text-white text-xs font-bold">{reel.stats?.likes || 0}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors"><MessageCircle size={28} /></button>
                    <span className="text-white text-xs font-bold">{reel.stats?.comments || 0}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors"><Share2 size={28} /></button>
                    <span className="text-white text-xs font-bold">{reel.stats?.shares || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default ReelItem;
