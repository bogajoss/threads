import { useState } from 'react';

export const usePostInteraction = (initialStats, currentUser, showToast) => {
    const [liked, setLiked] = useState(false);
    const [reposted, setReposted] = useState(false);
    const [localStats, setLocalStats] = useState(initialStats || { comments: 0, likes: 0, collects: 0, mirrors: 0 });

    const handleLike = (e) => {
        e && e.stopPropagation();
        if (!currentUser) return showToast("Please login to like!", "error");
        setLiked(!liked);
        setLocalStats(prev => ({
            ...prev,
            likes: liked ? prev.likes - 1 : prev.likes + 1
        }));
        showToast(liked ? "Unliked" : "Liked");
    };

    const handleRepost = (e) => {
        e && e.stopPropagation();
        if (!currentUser) return showToast("Please login to repost!", "error");
        setReposted(!reposted);
        setLocalStats(prev => ({
            ...prev,
            mirrors: reposted ? (prev.mirrors || 0) - 1 : (prev.mirrors || 0) + 1
        }));
        showToast(reposted ? "Removed repost" : "Reposted");
    };

    return { liked, reposted, localStats, setLocalStats, handleLike, handleRepost };
};
