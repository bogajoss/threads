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

  // 1. Fetch Profile Data using useQuery
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile", handle],
    queryFn: () => fetchProfileByHandle(handle!),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [activeProfileTab, setActiveProfileTab] = useState("feed");

  // 2. Fetch User Posts using useInfiniteQuery
  const {
    data: postsData,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: isFetchingMorePosts,
    isLoading: loadingPosts,
  } = useInfiniteQuery({
    queryKey: ["posts", "user", profile?.id],
    queryFn: ({ pageParam }) => fetchPostsByUserId(profile!.id, pageParam, 10),
    enabled: !!profile?.id,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 10) return undefined;
      return (
        lastPage[lastPage.length - 1].sort_timestamp ||
        lastPage[lastPage.length - 1].created_at
      );
    },
  });

  const userPosts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page) || [];
  }, [postsData]);

  // Followers/Following Modal State
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
    if (activeProfileTab === "feed") {
      return userPosts.filter(
        (p) => p.community_id === null && p.parent_id === null,
      );
    }
    if (activeProfileTab === "media") {
      return userPosts.filter(
        (p) =>
          p.community_id === null &&
          p.parent_id === null &&
          (p.type === "video" ||
            p.type === "image" ||
            (p.media && p.media.length > 0)),
      );
    }
    if (activeProfileTab === "collections") {
      return [];
    }
    return userPosts;
  }, [userPosts, activeProfileTab]);

  const handlePostClick = (id: string) => {
    navigate(`/p/${id}`);
  };

  const handleUserClick = (targetHandle: string) => {
    if (targetHandle === handle) return;
    navigate(`/u/${targetHandle}`);
  };

  // Shim for loadUserPosts to maintain interface if needed by UI
  const loadUserPosts = () => {
    fetchNextPosts();
  };

  return {
    handle,
    profile,
    loading: loadingProfile, // Mapped to new loading state
    userPosts,
    setUserPosts: () => console.warn("setUserPosts is deprecated"), // Read-only from RQ
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
