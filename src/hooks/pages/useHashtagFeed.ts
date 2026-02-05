import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { searchPosts } from "@/lib/api";

export const useHashtagFeed = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["hashtag", tag],
      queryFn: ({ pageParam }) => {
        const query = `#${tag}`;
        return searchPosts(query, pageParam, 10);
      },
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.length < 10) return undefined;
        return (
          lastPage[lastPage.length - 1].sort_timestamp ||
          lastPage[lastPage.length - 1].created_at
        );
      },
      enabled: !!tag,
    });

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  return {
    tag,
    posts,
    loading: isLoading,
    fetchingMore: isFetchingNextPage,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    navigate,
    currentUser,
    addToast,
  };
};
