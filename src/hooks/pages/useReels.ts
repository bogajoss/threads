import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useInfiniteQuery } from "@tanstack/react-query"
// @ts-ignore
import { fetchReels } from "@/lib/api/posts"

export const useReels = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const targetId = searchParams.get("id")
    const containerRef = useRef<HTMLDivElement>(null)
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
                    // Wait a tick for DOM
                    setTimeout(() => {
                        const element = document.querySelector(`[data-id="${targetId}"]`)
                        element?.scrollIntoView({ behavior: "instant" })
                    }, 100)
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
                    // @ts-ignore
                    setActiveReelId(entry.target.dataset.id)
                }
            })
        }

        const observer = new IntersectionObserver(callback, options)
        // Wait a tick for DOM updates
        setTimeout(() => {
             const elements = document.querySelectorAll(".reel-item")
             elements.forEach((el) => observer.observe(el))
        }, 100)

        return () => observer.disconnect()
    }, [reels.length]) // Only re-run if length changes

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    // Manual load more wrapper if needed by UI scroll event, 
    // BUT the UI should ideally check scroll position and call fetchNextPage directly.
    // Preserving the handleScroll interface if the UI component calls it manually on scroll event.
    // However, the previous implementation attached the listener HERE. 
    // Now we need to expose 'fetchNextPage' to be called when user scrolls near bottom.
    // Let's re-add the scroll listener here to match original behavior, but using fetchNextPage.

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
        navigate,
        toggleMute,
        loadReels: fetchNextPage, // Expose as loadReels for backward compat if needed
    }
}
