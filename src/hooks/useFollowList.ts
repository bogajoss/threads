import { useInfiniteQuery } from "@tanstack/react-query"
// @ts-ignore
import { fetchFollowers, fetchFollowing } from "@/lib/api"

export const useFollowList = (userId: string | undefined, type: "Followers" | "Following", enabled: boolean) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["follows", type, userId],
        queryFn: ({ pageParam }) => {
            const fetchFn = type === "Followers" ? fetchFollowers : fetchFollowing
            return fetchFn(userId!, pageParam, 10)
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 10) return undefined
            return lastPage[lastPage.length - 1].followed_at
        },
        enabled: !!userId && enabled,
    })

    const followList = data?.pages.flatMap((page) => page) || []

    return {
        followList,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    }
}
