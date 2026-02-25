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
  commentId?: string
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

  // Generate a unique key based on whether we are interacting with a post or a comment
  const interactionKey = commentId
    ? ["comment", commentId, "interaction", currentUser?.id]
    : ["post", postId, "interaction", currentUser?.id];

  const { data: isLiked = false } = useQuery({
    queryKey: [...interactionKey, "liked"],
    queryFn: () => checkIfLiked(currentUser!.id, postId, commentId),
    enabled:
      !!currentUser && (isValidUUID(postId) || (commentId ? isValidUUID(commentId) : false)) && isValidUUID(currentUser.id),
    staleTime: 1000 * 60 * 10,
  });

  const { data: isReposted = false } = useQuery({
    queryKey: [...interactionKey, "reposted"],
    queryFn: () => checkIfReposted(currentUser!.id, postId, commentId),
    enabled:
      !!currentUser && (isValidUUID(postId) || (commentId ? isValidUUID(commentId) : false)) && isValidUUID(currentUser.id),
    staleTime: 1000 * 60 * 10,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(currentUser!.id, postId, commentId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [...interactionKey, "liked"],
      });
      const previousLiked = queryClient.getQueryData<boolean>([...interactionKey, "liked"]);

      queryClient.setQueryData([...interactionKey, "liked"], !previousLiked);

      setLocalStats((prev) => ({
        ...prev,
        likes: !previousLiked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
      }));

      return { previousLiked };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousLiked !== undefined) {
        queryClient.setQueryData([...interactionKey, "liked"], context.previousLiked);
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
        queryKey: [...interactionKey, "liked"],
      });
    },
  });

  const repostMutation = useMutation({
    mutationFn: () => toggleRepost(currentUser!.id, postId, commentId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [...interactionKey, "reposted"],
      });
      const previousReposted = queryClient.getQueryData<boolean>([...interactionKey, "reposted"]);

      queryClient.setQueryData([...interactionKey, "reposted"], !previousReposted);
      
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
        queryClient.setQueryData([...interactionKey, "reposted"], context.previousReposted);
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
        queryKey: [...interactionKey, "reposted"],
      });
    },
    onSuccess: (newItemState) => {
      addToast(newItemState ? "Reposted!" : "Removed repost");
    },
  });

  const handleLike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return addToast("Please login to like!", "error");
    if (likeMutation.isPending) return;
    likeMutation.mutate();
  };

  const handleRepost = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return addToast("Please login to repost!", "error");
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
