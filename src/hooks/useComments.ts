import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchCommentsByPostId, addComment } from "@/lib/api";
import type { Media } from "@/types";

export const useComments = (
  postId: string,
  initialData?: any[],
  parentId?: string,
) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["comments", postId, parentId],
    queryFn: ({ pageParam }) =>
      fetchCommentsByPostId(postId, pageParam, 10, parentId),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 10) return undefined;
      return lastPage[lastPage.length - 1].created_at;
    },
    initialData: initialData
      ? { pages: [initialData], pageParams: [null] }
      : undefined,
    enabled: !!postId,
  });

  const comments = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  const addCommentMutation = useMutation({
    mutationFn: ({
      userId,
      content,
      media,
      replyToId,
    }: {
      userId: string;
      content: string;
      media: Media[];
      replyToId?: string;
    }) => addComment(postId, userId, content, media, replyToId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ["comments", postId, parentId],
        });
      }
    },
  });

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    addComment: addCommentMutation.mutateAsync,
    isSubmitting: addCommentMutation.isPending,
  };
};
