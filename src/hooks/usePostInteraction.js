import { useState, useEffect } from "react";
import { toggleLike, checkIfLiked } from "@/services/api";
import { isValidUUID } from "@/lib/utils";

export const usePostInteraction = (
  postId,
  initialStats,
  currentUser,
  showToast,
) => {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [localStats, setLocalStats] = useState(
    initialStats || { comments: 0, likes: 0, mirrors: 0 },
  );

  // Check if current user has liked this post
  useEffect(() => {
    if (
      currentUser &&
      postId &&
      isValidUUID(postId) &&
      isValidUUID(currentUser.id)
    ) {
      checkIfLiked(postId, currentUser.id)
        .then(setLiked)
        .catch(() => setLiked(false));
    }
  }, [postId, currentUser]);

  const handleLike = async (e) => {
    e && e.stopPropagation();
    if (!currentUser) return showToast("Please login to like!", "error");

    if (!isValidUUID(postId) || !isValidUUID(currentUser.id)) {
      // Handle mock data interaction locally
      const isLiked = !liked;
      setLiked(isLiked);
      setLocalStats((prev) => ({
        ...prev,
        likes: isLiked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
      }));
      showToast(isLiked ? "Liked" : "Unliked");
      return;
    }

    try {
      const isLiked = await toggleLike(postId, currentUser.id);
      setLiked(isLiked);
      setLocalStats((prev) => ({
        ...prev,
        likes: isLiked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
      }));
      showToast(isLiked ? "Liked" : "Unliked");
    } catch (err) {
      console.error("Failed to toggle like:", err);
      showToast("Failed to update like state", "error");
    }
  };

  const handleRepost = (e) => {
    e && e.stopPropagation();
    if (!currentUser) return showToast("Please login to repost!", "error");
    setReposted(!reposted);
    setLocalStats((prev) => ({
      ...prev,
      mirrors: reposted ? (prev.mirrors || 0) - 1 : (prev.mirrors || 0) + 1,
    }));
    showToast(reposted ? "Removed repost" : "Reposted");
  };

  return {
    liked,
    reposted,
    localStats,
    setLocalStats,
    handleLike,
    handleRepost,
  };
};
