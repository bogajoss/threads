import { useState, useEffect } from 'react';
import { toggleFollow, checkIfFollowing, fetchFollowStats } from '@/services/api';

export const useFollow = (targetId, currentUserId, showToast) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0 });
    const [loading, setLoading] = useState(false);

    // Initial check
    useEffect(() => {
        if (targetId) {
            fetchFollowStats(targetId).then(setStats);
            if (currentUserId) {
                checkIfFollowing(currentUserId, targetId).then(setIsFollowing);
            }
        }
    }, [targetId, currentUserId]);

    const handleFollow = async () => {
        if (!currentUserId) return showToast("Please login to follow!", "error");
        if (currentUserId === targetId) return showToast("You cannot follow yourself!", "error");

        setLoading(true);
        try {
            const following = await toggleFollow(currentUserId, targetId);
            setIsFollowing(following);
            setStats(prev => ({
                ...prev,
                followers: following ? prev.followers + 1 : prev.followers - 1
            }));
            showToast(following ? "Followed" : "Unfollowed");
        } catch (err) {
            console.error('Failed to toggle follow:', err);
            showToast("Failed to update follow status", "error");
        } finally {
            setLoading(false);
        }
    };

    return { isFollowing, stats, loading, handleFollow };
};
