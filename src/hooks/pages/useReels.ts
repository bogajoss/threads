import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate, useSearchParams, useParams } from "react-router-dom"
import { useInfiniteQuery } from "@tanstack/react-query"
// @ts-ignore
import { fetchReels } from "@/lib/api/posts"

export const useReels = () => {
    const navigate = useNavigate()
    const { id: routeId } = useParams()
    const [searchParams] = useSearchParams()
    const targetId = routeId || searchParams.get("id")
    const containerRef = useRef<HTMLDivElement>(null)
    const reelRefs = useRef<Map<string, HTMLDivElement>>(new Map())
    const [activeReelId, setActiveReelId] = useState<string | null>(null)
    const [isMuted, setIsMuted] = useState(true)

    // 1. Fetch Reels using useInfiniteQuery
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ["reels"],
        queryFn: ({ pageParam }) => fetchReels(pageParam, 10),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 10) return undefined;
            return lastPage[lastPage.length - 1].sort_timestamp || lastPage[lastPage.length - 1].created_at;
        },
    });

    const reels = useMemo(() => {
        return data?.pages.flatMap((page) => page) || [];
    }, [data]);

    // Set initial active reel or scroll to targetId
    useEffect(() => {
        if (reels.length > 0) {
            if (targetId) {
                const targetReel = reels.find(r => r.id === targetId)
                if (targetReel) {
                    setActiveReelId(targetId)
                    const element = reelRefs.current.get(targetId)
                    if (element) {
                         element.scrollIntoView({ behavior: "instant" })
                    }
                } else if (!activeReelId) {
                    setActiveReelId(reels[0].id)
                }
            } else if (!activeReelId) {
                setActiveReelId(reels[0].id)
            }
        }
    }, [reels, targetId, activeReelId])

    // Intersection Observer for Active Reel
    useEffect(() => {
        if (reels.length === 0) return

        const options = {
            root: containerRef.current,
            threshold: 0.6,
        }

        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                     const id = entry.target.getAttribute("data-id")
                     if (id) setActiveReelId(id)
                }
            })
        }

        const observer = new IntersectionObserver(callback, options)
        
        reelRefs.current.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [reels.length]) // Only re-run if length changes

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    const setReelRef = (id: string, el: HTMLDivElement | null) => {
        if (el) {
            reelRefs.current.set(id, el)
        } else {
            reelRefs.current.delete(id)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || isFetchingNextPage || !hasNextPage) return

            const { scrollTop, scrollHeight, clientHeight } = containerRef.current
            if (scrollTop + clientHeight >= scrollHeight - 800) {
                fetchNextPage()
            }
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("scroll", handleScroll)
            return () => container.removeEventListener("scroll", handleScroll)
        }
    }, [isFetchingNextPage, hasNextPage, fetchNextPage])


    return {
        reels,
        loading: isLoading,
        loadingMore: isFetchingNextPage,
        activeReelId,
        hasMore: hasNextPage,
        isMuted,
        containerRef,
        setReelRef,
        navigate,
        toggleMute,
        loadReels: fetchNextPage, 
    }
}
