import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
import { fetchStories } from "@/lib/api";
import type { Story } from "@/types";

export const useHome = () => {
  const { currentUser } = useAuth();
  const {
    posts: homePosts,
    loading: isPostsLoading,
    hasMore,
    isFetchingNextPage,
    fetchNextPage,
    refreshPosts,
  } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const { data: storiesData, isLoading: isStoriesLoading } = useInfiniteQuery({
    queryKey: ["stories"],
    queryFn: ({ pageParam }) => fetchStories(pageParam, 10),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 10) return undefined;
      return lastPage[lastPage.length - 1].created_at;
    },
    refetchInterval: 1000 * 60,
  });

  const groupedStories = useMemo(() => {
    const allStories = storiesData?.pages.flatMap((page) => page) || [];
    const seenStories = JSON.parse(localStorage.getItem("seenStories") || "[]");

    const grouped = allStories.reduce((acc: any[], story: Story) => {
      const existingGroup = acc.find((g) => g.user.id === story.user_id);
      if (existingGroup) {
        existingGroup.stories.push(story);
      } else {
        acc.push({
          user: story.user,
          stories: [story],
          isSeen: false,
        });
      }
      return acc;
    }, []);

    return grouped.map((group: any) => {
      return {
        ...group,
        isSeen: seenStories.includes(group.user.id),
      };
    });
  }, [storiesData]);

  const handlePostClick = (id: string) => {
    navigate(`/p/${id}`);
  };

  const handleUserClick = (handle: string) => {
    navigate(`/u/${handle}`);
  };

  return {
    currentUser,
    homePosts,
    groupedStories,
    isPostsLoading,
    isStoriesLoading,
    hasMore,
    isFetchingNextPage,
    fetchNextPage,
    refreshPosts,
    addToast,
    handlePostClick,
    handleUserClick,
  };
};