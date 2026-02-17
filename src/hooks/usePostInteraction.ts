import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleLike,
  checkIfLiked,
  toggleRepost,
  checkIfReposted,
} from "@/lib/api";
import { isValidUUID } from "@/lib/utils";
import type { PostStats, User } from "@/types/index";
import { useToast } from "@/context/ToastContext";

export const usePostInteraction = (
  postId: string,
  initialStats: PostStats,
  currentUser: User | null,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [localStats, setLocalStats] = useState<PostStats>(
    initialStats || { comments: 0, likes: 0, mirrors: 0, reposts: 0 },
  );

  const [prevInitialStats, setPrevInitialStats] = useState(initialStats);
  if (initialStats !== prevInitialStats) {
    setPrevInitialStats(initialStats);
    setLocalStats((prev) => ({ ...prev, ...initialStats }));
  }

  const { data: isLiked = false } = useQuery({
    queryKey: ["post", postId, "liked", currentUser?.id],
    queryFn: () => checkIfLiked(postId, currentUser!.id),
    enabled:
      !!currentUser && isValidUUID(postId) && isValidUUID(currentUser.id),
    staleTime: 1000 * 60 * 10,
  });

  const { data: isReposted = false } = useQuery({
    queryKey: ["post", postId, "reposted", currentUser?.id],
    queryFn: () => checkIfReposted(postId, currentUser!.id),
    enabled:
      !!currentUser && isValidUUID(postId) && isValidUUID(currentUser.id),
    staleTime: 1000 * 60 * 10,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(postId, currentUser!.id),
    onMutate: async () => {
      const currentUserId = currentUser!.id;
      await queryClient.cancelQueries({
        queryKey: ["post", postId, "liked", currentUserId],
      });
      const previousLiked = queryClient.getQueryData<boolean>([
        "post",
        postId,
        "liked",
        currentUserId,
      ]);

      queryClient.setQueryData(
        ["post", postId, "liked", currentUserId],
        !previousLiked,
      );
      setLocalStats((prev) => ({
        ...prev,
        likes: !previousLiked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
      }));

      return { previousLiked };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousLiked !== undefined) {
        queryClient.setQueryData(
          ["post", postId, "liked", currentUser!.id],
          context.previousLiked,
        );
        setLocalStats((prev) => ({
          ...prev,
          likes: context.previousLiked
            ? (prev.likes || 0) + 1
            : (prev.likes || 0) - 1,
        }));
      }
      addToast("Failed to update like", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", postId, "liked", currentUser?.id],
      });
    },
  });

  const repostMutation = useMutation({
    mutationFn: () => toggleRepost(postId, currentUser!.id),
    onMutate: async () => {
      const currentUserId = currentUser!.id;
      await queryClient.cancelQueries({
        queryKey: ["post", postId, "reposted", currentUserId],
      });
      const previousReposted = queryClient.getQueryData<boolean>([
        "post",
        postId,
        "reposted",
        currentUserId,
      ]);

      queryClient.setQueryData(
        ["post", postId, "reposted", currentUserId],
        !previousReposted,
      );
      setLocalStats((prev) => ({
        ...prev,
        reposts: !previousReposted
          ? (prev.reposts || 0) + 1
          : (prev.reposts || 0) - 1,
        mirrors: !previousReposted
          ? (prev.mirrors || 0) + 1
          : (prev.mirrors || 0) - 1,
      }));

      return { previousReposted };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousReposted !== undefined) {
        queryClient.setQueryData(
          ["post", postId, "reposted", currentUser!.id],
          context.previousReposted,
        );
        setLocalStats((prev) => ({
          ...prev,
          reposts: context.previousReposted
            ? (prev.reposts || 0) + 1
            : (prev.reposts || 0) - 1,
          mirrors: context.previousReposted
            ? (prev.mirrors || 0) + 1
            : (prev.mirrors || 0) - 1,
        }));
      }
      addToast("Failed to update repost", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", postId, "reposted", currentUser?.id],
      });
    },
    onSuccess: (newItemState) => {
      addToast(newItemState ? "Reposted!" : "Removed repost");
    },
  });

  const handleLike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return addToast("Please login to like!", "error");
    if (!isValidUUID(postId) || !isValidUUID(currentUser.id)) return;
    if (likeMutation.isPending) return;
    likeMutation.mutate();
  };

  const handleRepost = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return addToast("Please login to repost!", "error");
    if (!isValidUUID(postId) || !isValidUUID(currentUser.id)) return;
    repostMutation.mutate();
  };

  return {
    liked: isLiked,
    reposted: isReposted,
    localStats,
    setLocalStats,
    handleLike,
    handleRepost,
  };
};
