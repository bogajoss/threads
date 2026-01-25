import { useState, useEffect } from "react";
import { toggleLike, checkIfLiked, toggleRepost, checkIfReposted } from "@/lib/api";
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

  // Check if current user has liked or reposted this post
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
      
      checkIfReposted(postId, currentUser.id)
        .then(setReposted)
        .catch(() => setReposted(false));
    }
  }, [postId, currentUser]);

  const handleLike = async (e) => {
    e && e.stopPropagation();
    if (!currentUser) return showToast("Please login to like!", "error");

    if (!isValidUUID(postId) || !isValidUUID(currentUser.id)) {
      const isLiked = !liked;
      setLiked(isLiked);
      setLocalStats((prev) => ({
        ...prev,
        likes: isLiked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
      }));
      return;
    }

    try {
      const isLiked = await toggleLike(postId, currentUser.id);
      setLiked(isLiked);
      setLocalStats((prev) => ({
        ...prev,
        likes: isLiked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
      }));
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleRepost = async (e) => {
    e && e.stopPropagation();
    if (!currentUser) return showToast("Please login to repost!", "error");

    if (!isValidUUID(postId) || !isValidUUID(currentUser.id)) {
      const isReposted = !reposted;
      setReposted(isReposted);
      setLocalStats((prev) => ({
        ...prev,
        mirrors: isReposted ? (prev.mirrors || 0) + 1 : (prev.mirrors || 0) - 1,
      }));
      return;
    }

    try {
      const isReposted = await toggleRepost(postId, currentUser.id);
      setReposted(isReposted);
      setLocalStats((prev) => ({
        ...prev,
        mirrors: isReposted ? (prev.mirrors || 0) + 1 : (prev.mirrors || 0) - 1,
      }));
      showToast(isReposted ? "Reposted!" : "Removed repost");
    } catch (err) {
      console.error("Failed to toggle repost:", err);
      showToast("Failed to update repost", "error");
    }
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
