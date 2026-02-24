import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchPostsByUserId, fetchProfileByHandle } from "@/lib/api";
import { useFollowList } from "@/hooks/useFollowList";

export const useProfile = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile", handle],
    queryFn: () => fetchProfileByHandle(handle!),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });

  const [activeProfileTab, setActiveProfileTab] = useState("feed");

  const {
    data: postsData,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: isFetchingMorePosts,
    isLoading: loadingPosts,
  } = useInfiniteQuery({
    queryKey: ["posts", "user", profile?.id, activeProfileTab],
    queryFn: ({ pageParam }) =>
      fetchPostsByUserId(
        profile!.id,
        pageParam,
        20,
        activeProfileTab === "reels" ? "reel" : null,
      ),
    enabled: !!profile?.id,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 20) return undefined;
      return (
        lastPage[lastPage.length - 1].sort_timestamp ||
        lastPage[lastPage.length - 1].created_at
      );
    },
  });

  const userPosts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page) || [];
  }, [postsData]);

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<
    "Followers" | "Following"
  >("Followers");

  const {
    followList: followListData,
    fetchNextPage: fetchNextFollows,
    hasNextPage: hasMoreFollows,
    isFetchingNextPage: isFetchingMoreFollows,
    isLoading: isListLoading,
  } = useFollowList(profile?.id, followModalType, isFollowModalOpen);

  const openFollowModal = (type: string) => {
    setFollowModalType(type as "Followers" | "Following");
    setIsFollowModalOpen(true);
  };

  const filteredPosts = useMemo(() => {
    // Since we now filter at the RPC level for Reels vs Posts,
    // we just need to handle the community/parent filtering for the main feed
    if (activeProfileTab === "feed") {
      return userPosts.filter(
        (p) => p.community_id === null && p.parent_id === null,
      );
    }
    // Reels are already filtered by the RPC
    return userPosts;
  }, [userPosts, activeProfileTab]);

  const handlePostClick = (id: string) => {
    navigate(`/p/${id}`);
  };

  const handleUserClick = (targetHandle: string) => {
    if (targetHandle === handle) return;
    navigate(`/u/${targetHandle}`);
  };

  const loadUserPosts = () => {
    fetchNextPosts();
  };

  return {
    handle,
    profile,
    loading: loadingProfile,
    userPosts,
    setUserPosts: () => console.warn("setUserPosts is deprecated"),
    activeProfileTab,
    setActiveProfileTab,
    loadingPosts,
    isFetchingMorePosts,
    hasMorePosts,
    filteredPosts,
    isFollowModalOpen,
    setIsFollowModalOpen,
    followModalType,
    followListData,
    isListLoading,
    isFetchingMoreFollows,
    hasMoreFollows,
    openFollowModal,
    fetchNextFollows,
    handlePostClick,
    handleUserClick,
    loadUserPosts,
    currentUser,
    addToast,
    navigate,
  };
};
