import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  fetchCommentsByPostId,
  addComment,
  deleteComment,
  updateComment,
} from "@/lib/api";
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
    enabled: !!postId && !postId.startsWith("temp-"),
  });

  const comments = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  const addCommentMutation = useMutation({
    mutationFn: async ({
      userId,
      content,
      media,
      replyToId,
      type = "text",
      duration,
    }: {
      userId: string;
      content: string;
      media: Media[];
      replyToId?: string;
      type?: string;
      duration?: number;
    }) => {
      if (!currentUser) throw new Error("User not authenticated");
      return addComment(postId, userId, content, media, replyToId, type, duration);
    },
    onMutate: async (newCommentData) => {
      if (!currentUser) return;

      const queryKey = ["comments", postId, parentId];
      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<InfiniteData<Comment[]>>(queryKey);

      const optimisticComment: Comment = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        post_id: postId,
        user_id: currentUser.id,
        content: newCommentData.content,
        media: newCommentData.media || null,
        created_at: new Date().toISOString(),
        parent_id: newCommentData.replyToId || parentId || null,
        stats: { likes: 0, comments: 0, reposts: 0 },
        user: currentUser,
        timeAgo: "Just now",
      };

      queryClient.setQueryData<InfiniteData<Comment[]>>(queryKey, (old) => {
        if (!old)
          return {
            pages: [[optimisticComment]],
            pageParams: [null],
          };

        return {
          ...old,
          pages: [[optimisticComment, ...old.pages[0]], ...old.pages.slice(1)],
        };
      });

      return { previousComments };
    },
    onError: (_err, _vars, context) => {
      const queryKey = ["comments", postId, parentId];
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: () => {
      const queryKey = ["comments", postId, parentId];
      queryClient.invalidateQueries({ queryKey });
      // Also invalidate the post stats to update comment count
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
      media,
    }: {
      commentId: string;
      content: string;
      media: Media[];
    }) => {
      return updateComment(commentId, { content, media });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  return {
    comments: comments || [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    addComment: addCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    updateComment: updateCommentMutation.mutateAsync,
    isSubmitting: addCommentMutation.isPending,
  };
};
