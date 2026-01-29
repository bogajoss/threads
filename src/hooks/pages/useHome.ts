import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { usePosts } from "@/context/PostContext"
import { useToast } from "@/context/ToastContext"
// @ts-ignore
import { fetchStories } from "@/lib/api"

export const useHome = () => {
    const { currentUser } = useAuth()
    const {
        posts,
        loading: isPostsLoading,
        hasMore,
        isFetchingNextPage,
        fetchNextPage,
    } = usePosts()
    const { addToast } = useToast()
    const navigate = useNavigate()

    // Fetch Stories
    const { data: stories = [], isLoading: isStoriesLoading } = useQuery({
        queryKey: ["stories"],
        queryFn: fetchStories,
    })

    // Group stories by user
    const groupedStories = useMemo(() => {
        const groups: Record<string, any> = {}
        stories.forEach((s: any) => {
            if (!s.user) return
            const userId = s.user.id
            if (!groups[userId]) {
                groups[userId] = {
                    user: s.user,
                    stories: [],
                }
            }
            groups[userId].stories.push(s)
        })
        return Object.values(groups)
    }, [stories])

    // Filter out replies, show only top-level posts on the home feed
    const homePosts = useMemo(() => {
        return posts
    }, [posts])

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
        addToast,
        handlePostClick,
        handleUserClick,
    }
}
