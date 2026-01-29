import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
// @ts-ignore
import {
    fetchCommunityByHandle,
    fetchCommunityPosts,
    toggleCommunityMembership,
    checkIfMember,
} from "@/lib/api"

export const useCommunity = () => {
    const { handle } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { addToast } = useToast()

    const [community, setCommunity] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isMember, setIsMember] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null) // 'admin', 'moderator', 'member'
    const [isJoining, setIsJoining] = useState(false)

    // Post loading state
    const [communityPosts, setCommunityPosts] = useState<any[]>([])
    const [loadingPosts, setLoadingPosts] = useState(true)
    const [isFetchingMorePosts, setIsFetchingMorePosts] = useState(false)
    const [hasMorePosts, setHasMorePosts] = useState(true)

    const postsRef = useRef(communityPosts)
    useEffect(() => {
        postsRef.current = communityPosts
    }, [communityPosts])

    const loadCommunityPosts = useCallback(
        async (communityId: string, isLoadMore = false) => {
            if (!communityId) return
            if (isLoadMore) setIsFetchingMorePosts(true)
            else setLoadingPosts(true)

            try {
                const currentPosts = postsRef.current
                const lastTimestamp =
                    isLoadMore && currentPosts.length > 0
                        ? currentPosts[currentPosts.length - 1].sort_timestamp
                        : null

                const data = await fetchCommunityPosts(communityId, lastTimestamp, 10)

                if (data.length < 10) setHasMorePosts(false)
                else setHasMorePosts(true)

                if (isLoadMore) {
                    setCommunityPosts((prev) => [...prev, ...data])
                } else {
                    setCommunityPosts(data)
                }
            } catch (err) {
                console.error("Failed to fetch community posts:", err)
            } finally {
                setLoadingPosts(false)
                setIsFetchingMorePosts(false)
            }
        },
        []
    )

    useEffect(() => {
        const loadData = async () => {
            if (!handle) return
            setLoading(true)
            try {
                const c = await fetchCommunityByHandle(handle)
                setCommunity(c)
                if (c?.id) {
                    loadCommunityPosts(c.id)
                    if (currentUser) {
                        const membership = await checkIfMember(c.id, currentUser.id)
                        setIsMember(!!membership)
                        setUserRole(membership?.role || null)
                    }
                }
            } catch {
                // Silently fail or handle error
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [handle, currentUser, loadCommunityPosts])

    const handleJoinToggle = async () => {
        if (!currentUser)
            return addToast("Please login to join communities", "error")

        setIsJoining(true)
        try {
            const joined = await toggleCommunityMembership(
                community.id,
                currentUser.id
            )
            setIsMember(joined)
            setUserRole(joined ? "member" : null)
            setCommunity((prev: any) => ({
                ...prev,
                membersCount: joined ? prev.membersCount + 1 : prev.membersCount - 1,
            }))
            addToast(joined ? `Joined ${community.name}` : `Left ${community.name}`)
        } catch {
            addToast("Failed to update membership", "error")
        } finally {
            setIsJoining(false)
        }
    }

    return {
        community,
        loading,
        isMember,
        userRole,
        isJoining,
        communityPosts,
        loadingPosts,
        isFetchingMorePosts,
        hasMorePosts,
        handleJoinToggle,
        loadCommunityPosts,
        currentUser,
        addToast,
        navigate,
    }
}
