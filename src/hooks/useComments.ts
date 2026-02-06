import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { fetchCommentsByPostId, addComment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Comment, Media } from "@/types";

export const useComments = (
  postId: string,
  initialData?: any[],
  parentId?: string,
) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

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
    onMutate: async (newCommentData) => {
      const queryKey = ["comments", postId, parentId];
      await queryClient.cancelQueries({ queryKey });
      const previousComments = queryClient.getQueryData<InfiniteData<Comment[]>>(queryKey);

      if (previousComments && currentUser) {
        const optimisticComment: Comment = {
          id: `temp-${Date.now()}`,
          post_id: postId,
          user_id: currentUser.id,
          content: newCommentData.content,
          media: newCommentData.media || null,
          created_at: new Date().toISOString(),
          parent_id: newCommentData.replyToId || parentId || null,
          stats: { likes: 0, comments: 0 },
          user: currentUser,
          timeAgo: "just now",
        };

        queryClient.setQueryData<InfiniteData<Comment[]>>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: [
              [optimisticComment, ...old.pages[0]],
              ...old.pages.slice(1),
            ],
          };
        });
      }

      return { previousComments };
    },
    onError: (_err, _vars, context) => {
      const queryKey = ["comments", postId, parentId];
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
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
