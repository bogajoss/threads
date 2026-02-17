import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  fetchCommunities,
  searchPosts,
  fetchCommunityExplorePosts,
  searchUsers,
} from "@/lib/api";
import type { Community } from "@/types";
import Fuse from "fuse.js";

export const useExplore = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const activeTab =
    searchParams.get("tab") || (searchQuery ? "posts" : "communities");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Users Query
  const {
    data: usersInfiniteData,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasMoreUsers,
    isFetchingNextPage: isFetchingMoreUsers,
    isLoading: isUsersLoading,
  } = useInfiniteQuery({
    queryKey: ["explore", "users", searchQuery],
    queryFn: () => {
      if (searchQuery) {
        return searchUsers(searchQuery);
      }
      return searchUsers("");
    },
    enabled: activeTab === "users",
    initialPageParam: null as string | null,
    getNextPageParam: () => {
      return undefined;
    },
  });

  const usersData = useMemo(() => {
    return (usersInfiniteData?.pages.flatMap((page) => page) as any[]) || [];
  }, [usersInfiniteData]);

  const {
    data: communitiesInfiniteData,
    fetchNextPage: fetchNextCommunities,
    hasNextPage: hasMoreCommunities,
    isFetchingNextPage: isFetchingMoreCommunities,
    isLoading: isCommunitiesLoading,
  } = useInfiniteQuery({
    queryKey: ["explore", "communities"],
    queryFn: ({ pageParam }) => fetchCommunities(pageParam, 10),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 10) return undefined;
      return lastPage[lastPage.length - 1].createdAt;
    },
  });

  const communitiesData = useMemo(() => {
    return (
      (communitiesInfiniteData?.pages.flatMap((page) => page) as Community[]) ||
      []
    );
  }, [communitiesInfiniteData]);

  const {
    data: postsInfiniteData,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: isFetchingMorePosts,
    isLoading: isPostsLoading,
  } = useInfiniteQuery({
    queryKey: ["explore", "posts", searchQuery],
    queryFn: ({ pageParam }) => {
      if (searchQuery) {
        return searchPosts(searchQuery, pageParam, 20, false);
      }
      return fetchCommunityExplorePosts(pageParam, 20);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1].sort_timestamp;
    },
  });

  const postsData = useMemo(() => {
    return postsInfiniteData?.pages.flatMap((page) => page) || [];
  }, [postsInfiniteData]);

  const filteredCommunities = useMemo(() => {
    if (!searchQuery.trim()) return communitiesData;

    const fuse = new Fuse(communitiesData, {
      keys: ["name", "handle", "description"],
      threshold: 0.3,
      ignoreLocation: true,
    });

    return fuse.search(searchQuery).map((result) => result.item);
  }, [communitiesData, searchQuery]);

  const handleCommunityClick = (handle: string) => {
    navigate(`/c/${handle}`);
  };

  const handleSearchChange = (val: string) => {
    setSearchParams(
      (prev) => {
        if (val) prev.set("q", val);
        else prev.delete("q");
        return prev;
      },
      { replace: true },
    );
  };

  const handleTabChange = (val: string) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", val);
        return prev;
      },
      { replace: true },
    );
  };

  return {
    currentUser,
    searchQuery,
    setSearchQuery: handleSearchChange,
    activeTab,
    setActiveTab: handleTabChange,
    isCreateModalOpen,
    setIsCreateModalOpen,
    communitiesData,
    isCommunitiesLoading,
    isFetchingMoreCommunities,
    hasMoreCommunities,
    postsData,
    isPostsLoading,
    isFetchingMorePosts,
    hasMorePosts,
    filteredCommunities,
    usersData,
    isUsersLoading,
    hasMoreUsers,
    isFetchingMoreUsers,
    handleCommunityClick,
    loadCommunities: fetchNextCommunities,
    loadPosts: fetchNextPosts,
    loadUsers: fetchNextUsers,
    navigate,
  };
};
