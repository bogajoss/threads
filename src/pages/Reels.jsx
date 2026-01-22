import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePosts } from '@/context/PostContext';
import ReelItem from '@/components/features/post/ReelItem';

const Reels = () => {
    const { posts, loading } = usePosts();
    const videoPosts = posts.filter(p => p.type === 'video' || p.category === 'video');

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black">
                <Loader2 size={40} className="animate-spin text-white" />
            </div>
        );
    }

    if (videoPosts.length === 0) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white gap-4">
                <p className="text-zinc-500">No reels found.</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full snap-y snap-mandatory overflow-y-auto no-scrollbar bg-black md:rounded-xl">
            {videoPosts.map(reel => (
                <ReelItem key={reel.id} reel={reel} />
            ))}
        </div>
    );
};

export default Reels;
