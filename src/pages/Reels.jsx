import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchReels } from "@/lib/api/posts";
import ReelItem from "@/components/features/post/ReelItem";

const Reels = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeReelId, setActiveReelId] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadReels = async (lastTimestamp = null) => {
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
  };

  useEffect(() => {
    loadReels();
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 800) {
      setLoadingMore(true);
      const lastReel = reels[reels.length - 1];
      // Use sort_timestamp or created_at for pagination
      loadReels(lastReel?.sort_timestamp || lastReel?.created_at);
    }
  }, [reels, loadingMore, hasMore]);

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

  if (loading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-black">
        <Loader2 size={40} className="animate-spin text-white" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-black text-white gap-4">
        <p className="text-zinc-500">No reels found.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-black md:rounded-xl relative overflow-hidden">
      {/* Fixed Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-50 p-2.5 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md rounded-full transition-all active:scale-90 border border-white/10 shadow-xl"
        title="Back"
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>

      <div
        ref={containerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-auto no-scrollbar scroll-smooth"
      >
        {reels.map((reel) => (
          <ReelItem
            key={reel.feed_id || reel.id}
            reel={reel}
            isActive={activeReelId === reel.id}
          />
        ))}
        {loadingMore && (
          <div className="h-screen w-full flex items-center justify-center bg-black snap-start">
            <Loader2 size={40} className="animate-spin text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;
