import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { fetchPostsByUserId } from "@/lib/api"
// @ts-ignore
import { fetchFollowers, fetchFollowing } from "@/lib/api"

export const useProfile = () => {
    const { handle } = useParams()
    const navigate = useNavigate()
    const { currentUser, getProfileByHandle } = useAuth()
    const { addToast } = useToast()

    // 1. Fetch Profile Data using useQuery
    const { 
        data: profile, 
        isLoading: loadingProfile 
    } = useQuery({
        queryKey: ["profile", handle],
        queryFn: () => getProfileByHandle(handle!),
        enabled: !!handle,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const [activeProfileTab, setActiveProfileTab] = useState("feed")

    // 2. Fetch User Posts using useInfiniteQuery
    const {
        data: postsData,
        fetchNextPage: fetchNextPosts,
        hasNextPage: hasMorePosts,
        isFetchingNextPage: isFetchingMorePosts,
        isLoading: loadingPosts
    } = useInfiniteQuery({
        queryKey: ["posts", "user", profile?.id],
        queryFn: ({ pageParam }) => fetchPostsByUserId(profile?.id!, pageParam, 10),
        enabled: !!profile?.id,
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 10) return undefined;
            // @ts-ignore
            return lastPage[lastPage.length - 1].sort_timestamp || lastPage[lastPage.length - 1].created_at;
        }
    });

    const userPosts = useMemo(() => {
        return postsData?.pages.flatMap(page => page) || [];
    }, [postsData]);

    // Followers/Following Modal State (Kept manual for now as requested/scoped)
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false)
    const [followModalType, setFollowModalType] = useState("Followers") // 'Followers' or 'Following'
    const [followListData, setFollowListData] = useState<any[]>([])
    const [isListLoading, setIsListLoading] = useState(false)
    const [isFetchingMoreFollows, setIsFetchingMoreFollows] = useState(false)
    const [hasMoreFollows, setHasMoreFollows] = useState(true)

    const openFollowModal = async (type: string, isLoadMore = false) => {
        const userId = profile?.id
        if (!userId) return

        if (isLoadMore) setIsFetchingMoreFollows(true)
        else {
            setFollowModalType(type)
            setIsFollowModalOpen(true)
            setIsListLoading(true)
            setFollowListData([])
        }

        try {
            const lastTimestamp =
                isLoadMore && followListData.length > 0
                    ? followListData[followListData.length - 1].followed_at
                    : null

            const data =
                type === "Followers"
                    ? await fetchFollowers(userId, lastTimestamp, 10)
                    : await fetchFollowing(userId, lastTimestamp, 10)

            if (data.length < 10) setHasMoreFollows(false)
            else setHasMoreFollows(true)

            if (isLoadMore) {
                setFollowListData((prev) => [...prev, ...data])
            } else {
                setFollowListData(data)
            }
        } catch (err) {
            console.error(`Failed to fetch ${type}:`, err)
            addToast(`Failed to load ${type}`)
        } finally {
            setIsListLoading(false)
            setIsFetchingMoreFollows(false)
        }
    }

    const filteredPosts = useMemo(() => {
        if (activeProfileTab === "feed") {
            return userPosts.filter(
                (p) => p.community_id === null && p.parent_id === null
            )
        }
        if (activeProfileTab === "media") {
            return userPosts.filter(
                (p) =>
                    p.community_id === null &&
                    p.parent_id === null &&
                    (p.type === "video" ||
                        p.type === "image" ||
                        (p.media && p.media.length > 0))
            )
        }
        if (activeProfileTab === "collections") {
            return []
        }
        return userPosts
    }, [userPosts, activeProfileTab])

    const handlePostClick = (id: string) => {
        navigate(`/post/${id}`)
    }

    const handleUserClick = (targetHandle: string) => {
        if (targetHandle === handle) return
        navigate(`/u/${targetHandle}`)
    }

    // Shim for loadUserPosts to maintain interface if needed by UI (though UI should use fetchNextPosts)
    // The UI likely calls `loadUserPosts(id, true)` for infinite scroll
    const loadUserPosts = (userId: string, isLoadMore = false) => {
        if (isLoadMore) fetchNextPosts();
    };

    return {
        handle,
        profile,
        loading: loadingProfile, // Mapped to new loading state
        userPosts,
        setUserPosts: () => console.warn("setUserPosts is deprecated"), // Read-only from RQ
        activeProfileTab,
        setActiveProfileTab,
        loadingPosts,
        isFetchingMorePosts,
        hasMorePosts,
        filteredPosts,
        isFollowModalOpen,
        setIsFollowModalOpen,
        followModalType,
        followListData,
        isListLoading,
        isFetchingMoreFollows,
        hasMoreFollows,
        openFollowModal,
        handlePostClick,
        handleUserClick,
        loadUserPosts,
        currentUser,
        addToast,
        navigate,
    }
}
