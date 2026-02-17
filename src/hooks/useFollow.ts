import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollow, checkIfFollowing, fetchFollowStats } from "@/lib/api";
import { isValidUUID } from "@/lib/utils";
import type { User } from "@/types/index";
import { useToast } from "@/context/ToastContext";

interface FollowStats {
  followers: number;
  following: number;
}

export const useFollow = (
  profile: User | null,
  currentUserId: string | null | undefined,
) => {
  const targetId = profile?.id;
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [stats, setStats] = useState<FollowStats>({
    followers: profile?.follower_count || 0,
    following: profile?.following_count || 0,
  });

  const [prevProfileId, setPrevProfileId] = useState(profile?.id);
  if (profile?.id !== prevProfileId) {
    setPrevProfileId(profile?.id);
    setStats({
      followers: profile?.follower_count || 0,
      following: profile?.following_count || 0,
    });
  }

  const isValidIds =
    targetId &&
    isValidUUID(targetId) &&
    currentUserId &&
    isValidUUID(currentUserId);

  const { data: isFollowing = false } = useQuery({
    queryKey: ["isFollowing", currentUserId, targetId],
    queryFn: () => checkIfFollowing(currentUserId!, targetId!),
    enabled: !!isValidIds,
    staleTime: Infinity,
  });

  useQuery({
    queryKey: ["followStats", targetId],
    queryFn: async () => {
      const data = await fetchFollowStats(targetId!);
      setStats(data);
      return data;
    },
    enabled: !!targetId && isValidUUID(targetId),
    staleTime: 1000 * 60,
  });

  const followMutation = useMutation({
    mutationFn: () => toggleFollow(currentUserId!, targetId!),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["isFollowing", currentUserId, targetId],
      });
      const previousFollowing = queryClient.getQueryData([
        "isFollowing",
        currentUserId,
        targetId,
      ]);

      queryClient.setQueryData(
        ["isFollowing", currentUserId, targetId],
        !isFollowing,
      );

      setStats((prev) => ({
        ...prev,
        followers: !isFollowing
          ? prev.followers + 1
          : Math.max(0, prev.followers - 1),
      }));

      return { previousFollowing };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFollowing !== undefined) {
        queryClient.setQueryData(
          ["isFollowing", currentUserId, targetId],
          context.previousFollowing,
        );
        setStats((prev) => ({
          ...prev,
          followers: context.previousFollowing
            ? prev.followers + 1
            : Math.max(0, prev.followers - 1),
        }));
      }
      addToast("Failed to update follow status", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", currentUserId, targetId],
      });
      queryClient.invalidateQueries({ queryKey: ["followStats", targetId] });
    },
    onSuccess: (newItemState) => {
      addToast(newItemState ? "Followed" : "Unfollowed");
    },
  });

  const handleFollow = async () => {
    if (!currentUserId) return addToast("Please login to follow!", "error");
    if (currentUserId === targetId)
      return addToast("You cannot follow yourself!", "error");
    if (!isValidIds) return;

    followMutation.mutate();
  };

  return {
    isFollowing,
    stats,
    loading: followMutation.isPending,
    handleFollow,
    setStats,
  };
};
