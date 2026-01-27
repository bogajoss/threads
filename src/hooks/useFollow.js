import { useState, useEffect } from "react";
import {
  toggleFollow,
  checkIfFollowing,
  fetchFollowStats,
} from "@/lib/api";
import { isValidUUID } from "@/lib/utils";

export const useFollow = (profile, currentUserId, showToast) => {
  const targetId = profile?.id;
  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState({
    followers: profile?.followers || profile?.follower_count || 0,
    following: profile?.following || profile?.following_count || 0,
  });
  const [loading, setLoading] = useState(false);

  // Initial check and stats update when profile changes
  useEffect(() => {
    if (profile) {
      setStats({
        followers: profile.followers || profile.follower_count || 0,
        following: profile.following || profile.following_count || 0,
      });

      if (targetId && isValidUUID(targetId)) {
        fetchFollowStats(targetId)
          .then((fetchedStats) => {
            if (fetchedStats) {
              setStats({
                followers: fetchedStats.followers,
                following: fetchedStats.following,
              });
            }
          })
          .catch(() => {});

        if (currentUserId && isValidUUID(currentUserId)) {
          checkIfFollowing(currentUserId, targetId)
            .then(setIsFollowing)
            .catch(() => setIsFollowing(false));
        } else {
          setIsFollowing(false);
        } 
      }
    }
  }, [profile, targetId, currentUserId]);

  const handleFollow = async () => {
    if (!currentUserId) return showToast("Please login to follow!", "error");
    if (currentUserId === targetId)
      return showToast("You cannot follow yourself!", "error");

    if (!targetId || !isValidUUID(targetId) || !isValidUUID(currentUserId)) {
      // Mock follow interaction
      const following = !isFollowing;
      setIsFollowing(following);

      setStats((prev) => {
        const currentFollowers =
          typeof prev.followers === "string"
            ? parseInt(prev.followers.replace(/,/g, ""))
            : prev.followers || 0;

        return {
          ...prev,
          followers: following
            ? currentFollowers + 1
            : Math.max(0, currentFollowers - 1),
        };
      });

      showToast(following ? "Followed" : "Unfollowed");
      return;
    }

    setLoading(true);
    try {
      const following = await toggleFollow(currentUserId, targetId);
      setIsFollowing(following);
      setStats((prev) => ({
        ...prev,
        followers: following
          ? (prev.followers || 0) + 1
          : Math.max(0, (prev.followers || 0) - 1),
      }));
      showToast(following ? "Followed" : "Unfollowed");
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      showToast("Failed to update follow status", "error");
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, stats, loading, handleFollow, setStats };
};
