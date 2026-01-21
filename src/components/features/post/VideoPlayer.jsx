import React from 'react';
import { Play, Volume2, Maximize2 } from 'lucide-react';

const VideoPlayer = ({ poster, duration }) => {
    return (
        <div className="mt-3 relative w-full overflow-hidden rounded-2xl bg-black aspect-video group cursor-pointer shadow-sm" onClick={(e) => e.stopPropagation()}>
            <img src={poster} alt="Video Poster" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70 opacity-100">
                <div className="p-3 flex items-center justify-between text-white gap-4">
                    <div className="flex items-center gap-3">
                        <button className="hover:scale-110 transition p-1"><Play size={20} fill="white" /></button>
                        <span className="text-xs font-semibold tabular-nums">0:00 / {duration}</span>
                        <button className="hover:scale-110 transition p-1"><Volume2 size={20} /></button>
                    </div>
                    <button className="hover:scale-110 transition p-1"><Maximize2 size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
