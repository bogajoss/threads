import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  fetchCommunityByHandle,
  fetchCommunityPosts,
  toggleCommunityMembership,
  checkIfMember,
} from "@/lib/api";

export const useCommunity = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // 1. Fetch Community Metadata
  const {
    data: community,
    isLoading: loadingCommunity,
    refetch: refetchCommunity,
  } = useQuery({
    queryKey: ["community", handle],
    queryFn: () => fetchCommunityByHandle(handle!),
    enabled: !!handle,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // 2. Fetch Membership Status
  const { data: membership } = useQuery({
    queryKey: ["community", community?.id, "membership", currentUser?.id],
    queryFn: () => checkIfMember(community?.id!, currentUser?.id!),
    enabled: !!community?.id && !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
  });

  const isMember = !!membership;
  const userRole = membership?.role || null;

  // 3. Fetch Community Posts using useInfiniteQuery
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: isFetchingMorePosts,
    isLoading: loadingPosts,
  } = useInfiniteQuery({
    queryKey: ["posts", "community", community?.id],
    queryFn: ({ pageParam }) =>
      fetchCommunityPosts(community?.id!, pageParam, 10),
    enabled: !!community?.id,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 10) return undefined;
      return lastPage[lastPage.length - 1].sort_timestamp;
    },
  });

  const communityPosts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page) || [];
  }, [postsData]);

  // 4. Toggle Membership Mutation
  const joinMutation = useMutation({
    mutationFn: () =>
      toggleCommunityMembership(community?.id!, currentUser?.id!),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["community", community?.id, "membership", currentUser?.id],
      });
      await queryClient.cancelQueries({ queryKey: ["community", handle] });

      const previousMembership = queryClient.getQueryData([
        "community",
        community?.id,
        "membership",
        currentUser?.id,
      ]);
      const previousCommunity = queryClient.getQueryData(["community", handle]);

      // Optimistically update membership
      queryClient.setQueryData(
        ["community", community?.id, "membership", currentUser?.id],
        previousMembership ? null : { role: "member" },
      );

      // Optimistically update community member count
      queryClient.setQueryData(["community", handle], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          membersCount: previousMembership
            ? old.membersCount - 1
            : old.membersCount + 1,
        };
      });

      return { previousMembership, previousCommunity };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousMembership !== undefined) {
        queryClient.setQueryData(
          ["community", community?.id, "membership", currentUser?.id],
          context.previousMembership,
        );
      }
      if (context?.previousCommunity) {
        queryClient.setQueryData(
          ["community", handle],
          context.previousCommunity,
        );
      }
      addToast("Failed to update membership", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", community?.id, "membership", currentUser?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["community", handle] });
    },
    onSuccess: (joined) => {
      if (community) {
        addToast(
          joined ? `Joined ${community.name}` : `Left ${community.name}`,
        );
      }
    },
  });

  const handleJoinToggle = async () => {
    if (!currentUser)
      return addToast("Please login to join communities", "error");
    joinMutation.mutate();
  };

  return {
    community,
    loading: loadingCommunity,
    isMember,
    userRole,
    isJoining: joinMutation.isPending,
    communityPosts,
    loadingPosts,
    isFetchingMorePosts,
    hasMorePosts,
    handleJoinToggle,
    loadCommunityPosts: fetchNextPage,
    refetchCommunity,
    currentUser,
    addToast,
    navigate,
  };
};
