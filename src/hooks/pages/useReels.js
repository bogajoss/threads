import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReels } from "@/lib/api/posts";

export const useReels = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeReelId, setActiveReelId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const loadReels = useCallback(async (lastTimestamp = null) => {
    try {
      const data = await fetchReels(lastTimestamp);
      if (data.length < 10) {
        setHasMore(false);
      }
      if (lastTimestamp) {
        setReels((prev) => [...prev, ...data]);
      } else {
        setReels(data);
        if (data.length > 0 && !activeReelId) {
          setActiveReelId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeReelId]);

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 800) {
      setLoadingMore(true);
      const lastReel = reels[reels.length - 1];
      loadReels(lastReel?.sort_timestamp || lastReel?.created_at);
    }
  }, [reels, loadingMore, hasMore, loadReels]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (reels.length === 0) return;

    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveReelId(entry.target.dataset.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const elements = document.querySelectorAll(".reel-item");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [reels]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
    reels,
    loading,
    loadingMore,
    activeReelId,
    hasMore,
    isMuted,
    containerRef,
    navigate,
    toggleMute,
    loadReels,
  };
};
