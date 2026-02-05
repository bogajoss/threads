import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchReels } from "@/lib/api";

export const useReels = () => {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const targetId = routeId || searchParams.get("id");
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // 1. Fetch Reels using useInfiniteQuery
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["reels"],
      queryFn: ({ pageParam }) => fetchReels(pageParam, 10),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.length < 10) return undefined;
        return (
          lastPage[lastPage.length - 1].sort_timestamp ||
          lastPage[lastPage.length - 1].created_at
        );
      },
    });

  const reels = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  // Adjust activeReelId during render if needed
  const [prevReelsLength, setPrevReelsLength] = useState(0);
  if (reels.length > 0 && reels.length !== prevReelsLength && !activeReelId) {
    setPrevReelsLength(reels.length);
    if (targetId) {
      const targetReel = reels.find((r) => r.id === targetId);
      if (targetReel) {
        setActiveReelId(targetId);
      } else {
        setActiveReelId(reels[0].id);
      }
    } else {
      setActiveReelId(reels[0].id);
    }
  }

  // Scroll to targetId on mount/reels load
  useEffect(() => {
    if (reels.length > 0 && targetId) {
      const element = reelRefs.current.get(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [reels.length, targetId]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const scrollToNext = useCallback(() => {
    if (reels.length === 0) return;
    const currentIndex = reels.findIndex((r) => r.id === activeReelId);
    if (currentIndex < reels.length - 1) {
      const nextReel = reels[currentIndex + 1];
      const element = reelRefs.current.get(nextReel.id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [reels, activeReelId]);

  const scrollToPrev = useCallback(() => {
    if (reels.length === 0) return;
    const currentIndex = reels.findIndex((r) => r.id === activeReelId);
    if (currentIndex > 0) {
      const prevReel = reels[currentIndex - 1];
      const element = reelRefs.current.get(prevReel.id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [reels, activeReelId]);

  // Intersection Observer for Active Reel
  useEffect(() => {
    if (reels.length === 0) return;

    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          if (id) setActiveReelId(id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    reelRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [reels.length]); // Only re-run if length changes

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      // Ignore if modifier keys are pressed
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          scrollToPrev();
          break;
        case "ArrowDown":
          e.preventDefault();
          scrollToNext();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case " ": {
          e.preventDefault();
          // Get the active reel's video element/plyr instance and toggle it
          const activeElement = reelRefs.current.get(activeReelId || "");
          if (activeElement) {
            const playButton = activeElement.querySelector(
              ".reel-item",
            ) as HTMLElement;
            if (playButton) {
              // We trigger the click interaction which already handles play/pause logic
              playButton.click();
            }
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReelId, scrollToNext, scrollToPrev, toggleMute]);

  const setReelRef = (id: string, el: HTMLDivElement | null) => {
    if (el) {
      reelRefs.current.set(id, el);
    } else {
      reelRefs.current.delete(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isFetchingNextPage || !hasNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 800) {
        fetchNextPage();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

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
    scrollToNext,
    scrollToPrev,
    loadReels: fetchNextPage,
  };
};
