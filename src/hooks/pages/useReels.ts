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
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("reel-volume");
    return saved ? JSON.parse(saved) : 1;
  });

  useEffect(() => {
    localStorage.setItem("reel-volume", JSON.stringify(volume));
  }, [volume]);

  const handleSetVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  const [reelsSeed] = useState(() => Math.random().toString(36).substring(7));

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["reels", reelsSeed],
      queryFn: ({ pageParam }) => fetchReels(pageParam, 10, reelsSeed),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.length < 10) return undefined;
        const lastReel = lastPage[lastPage.length - 1];
        if (lastReel.score !== undefined) {
          return `${lastReel.id}:${lastReel.score}`;
        }
        return lastReel.sort_timestamp || lastReel.created_at;
      },
    });

  const reels = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

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

  const hasScrolledToTarget = useRef(false);
  useEffect(() => {
    if (reels.length > 0 && targetId && !hasScrolledToTarget.current) {
      const element = reelRefs.current.get(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "instant" });
        hasScrolledToTarget.current = true;
      }
    }
  }, [reels.length, targetId]);

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

  useEffect(() => {
    if (reels.length === 0) return;

    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      // Find the entry with the highest intersection ratio
      const visibleEntry = entries.reduce((max, entry) => {
        return entry.intersectionRatio > max.intersectionRatio ? entry : max;
      }, entries[0]);

      // Only set the most visible reel as active
      if (visibleEntry?.isIntersecting) {
        const id = visibleEntry.target.getAttribute("data-id");
        if (id) setActiveReelId(id);
      }
    };

    const observer = new IntersectionObserver(callback, options);

    reelRefs.current.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [reels.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

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
        case " ": {
          e.preventDefault();
          const activeElement = reelRefs.current.get(activeReelId || "");
          if (activeElement) {
            const playButton = activeElement.querySelector(
              ".reel-item",
            ) as HTMLElement;
            if (playButton) {
              playButton.click();
            }
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReelId, scrollToNext, scrollToPrev]);

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
    volume,
    setVolume: handleSetVolume,
    containerRef,
    setReelRef,
    navigate,
    scrollToNext,
    scrollToPrev,
    loadReels: fetchNextPage,
  };
};
