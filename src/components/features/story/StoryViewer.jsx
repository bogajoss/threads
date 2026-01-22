import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const StoryViewer = ({ story, onClose }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    onClose();
                    return 100;
                }
                return prev + 1;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex flex-col gap-4">
                <div className="flex gap-1 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-10 border border-white/20">
                            <AvatarImage src={story.user.avatar} alt={story.user.handle} className="object-cover" />
                            <AvatarFallback>{story.user.handle?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-white font-bold">{story.user.handle}</span>
                    </div>
                    <button onClick={onClose} className="text-white p-2 hover:bg-white/10 rounded-full">
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="w-full h-full max-w-xl relative flex items-center justify-center p-4">
                <button className="absolute left-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all active:scale-90">
                    <ChevronLeft size={32} />
                </button>
                <img src={story.media} className="w-full h-full object-contain rounded-2xl shadow-2xl" alt="" />
                <button className="absolute right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all active:scale-90">
                    <ChevronRight size={32} />
                </button>
            </div>
        </div>
    );
};

export default StoryViewer;
