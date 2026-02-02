import { useMemo } from "react"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
...
    const comments = useMemo(() => {
        return data?.pages.flatMap((page) => page) || []
    }, [data])

    const addCommentMutation = useMutation({
        mutationFn: ({ userId, content, media, replyToId }: { userId: string, content: string, media: Media[], replyToId?: string }) => 
            addComment(postId, userId, content, media, replyToId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] })
            if (parentId) {
                queryClient.invalidateQueries({ queryKey: ["comments", postId, parentId] })
            }
        }
    })

    return {
        comments,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        addComment: addCommentMutation.mutateAsync,
        isSubmitting: addCommentMutation.isPending,
    }
}
