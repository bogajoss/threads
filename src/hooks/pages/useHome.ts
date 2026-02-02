import { useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { usePosts } from "@/context/PostContext"
import { useToast } from "@/context/ToastContext"
// @ts-ignore
import { fetchStories } from "@/lib/api"

export const useHome = () => {
    const { currentUser } = useAuth()
    const {
        posts: homePosts,
        loading: isPostsLoading,
        hasMore,
        isFetchingNextPage,
        fetchNextPage,
        refreshPosts,
    } = usePosts()
    const { addToast } = useToast()
    const navigate = useNavigate()

    // 2. Fetch Stories
    const { 
        data: storiesData, 
        isLoading: isStoriesLoading 
    } = useInfiniteQuery({
        queryKey: ["stories"],
        queryFn: ({ pageParam }) => fetchStories(pageParam, 10),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage: any) => {
            if (!lastPage || lastPage.length < 10) return undefined
            return lastPage[lastPage.length - 1].created_at
        },
        // Refetch every minute for stories
        refetchInterval: 1000 * 60,
    });

    // Group stories by user and check seen status
    const groupedStories = useMemo(() => {
        const allStories = storiesData?.pages.flatMap((page: any) => page) || [];
        const seenStories = JSON.parse(localStorage.getItem("seenStories") || "[]");

        const grouped = allStories.reduce((acc: any[], story: any) => {
            const existingGroup = acc.find((g) => g.user.id === story.user_id)
            if (existingGroup) {
                existingGroup.stories.push(story)
            } else {
                acc.push({
                    user: story.user,
                    stories: [story],
                    isSeen: false, // Default, updated below or calculated here if we want group level
                })
            }
            return acc
        }, [])
        
        // A group is "seen" if all its stories are in seenStories? 
        // Or if the *latest* story is seen? Usually if latest is seen, group ring is gray.
        // Let's attach 'isSeen' to the group.
        return grouped.map((group: any) => {
            // Check if ALL stories in this group are seen, or at least the latest one?
            // Usually simpler: Check if the user ID is in "seenStories" list if that's how it was stored.
            // The original code checked: const isSeen = seenStories.includes(group.user.id)
            // So let's stick to that logic.
            return {
                ...group,
                isSeen: seenStories.includes(group.user.id)
            };
        });
    }, [storiesData]);

    const handlePostClick = (id: string) => {
        navigate(`/post/${id}`)
    }

    const handleUserClick = (handle: string) => {
        navigate(`/u/${handle}`)
    }

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
    }
}