import { useRef, useEffect } from "react";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import videojs from "video.js";

import SkeletonReel from "@/components/features/reels/skeleton-reel";

import ReelItem from "@/components/features/post/ReelItem";
import { resetCurrentlyPlayingPlayer } from "@/lib/video-state";
import { useReels } from "@/hooks/pages/useReels";
import { Slider } from "@/components/ui/slider";

const Reels = () => {
  const location = useLocation();
  const prevLocationRef = useRef<string>(location.pathname);

  // Cleanup: Pause all videos when navigating away from Reels page
  useEffect(() => {
    const prevLocation = prevLocationRef.current;
    const currentLocation = location.pathname;

    // Check if navigating away from any Reels-related route
    const isReelsRoute = (path: string) => path.startsWith("/r");

    if (isReelsRoute(prevLocation) && !isReelsRoute(currentLocation)) {
      // Pause all Video.js player instances
      videojs.getAllPlayers().forEach((player) => {
        if (player && !player.paused()) {
          player.pause();
          player.currentTime(0);
        }
      });

      // Reset global playing lock
      resetCurrentlyPlayingPlayer();
    }

    prevLocationRef.current = currentLocation;
  }, [location]);

  // Cleanup on unmount (when Reels page component unmounts)
  useEffect(() => {
    return () => {
      // Pause all Video.js player instances
      videojs.getAllPlayers().forEach((player) => {
        if (player && !player.paused()) {
          player.pause();
          player.currentTime(0);
        }
      });

      // Reset global playing lock
      resetCurrentlyPlayingPlayer();
    };
  }, []);
  const {
    reels,
    loading,
    loadingMore,
    activeReelId,
    volume,
    setVolume,
    containerRef,
    setReelRef,
    navigate,
    scrollToNext,
    scrollToPrev,
  } = useReels();

  const handleBack = () => {
    // Cleanup videos before navigating away
    videojs.getAllPlayers().forEach((player) => {
      if (player && !player.paused()) {
        player.pause();
        player.currentTime(0);
      }
    });

    resetCurrentlyPlayingPlayer();
    navigate(-1);
  };

  const handleDelete = () => {
    // After a reel is deleted, scroll to the next one
    scrollToNext();
  };

  if (loading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-black">
        <SkeletonReel />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-black text-white">
        <p className="text-zinc-500">No reels found.</p>
        <button
          onClick={handleBack}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black md:rounded-xl">
      <button
        onClick={handleBack}
        className="absolute left-6 top-[max(1.5rem,env(safe-area-inset-top)+1.5rem)] z-50 rounded-full border border-white/10 bg-black/20 p-2.5 text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
        title="Back"
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>

      <div className="absolute right-6 top-[max(1.5rem,env(safe-area-inset-top)+1.5rem)] z-50 flex items-center gap-3" dir="ltr">
        <div className="flex h-10 w-32 items-center justify-center rounded-full border border-white/10 bg-black/20 px-4 py-2 shadow-xl backdrop-blur-md" dir="ltr">
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([val]) => setVolume(val / 100)}
            className="w-24"
          />
        </div>

        <button
          onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
          className="rounded-full border border-white/10 bg-black/20 p-2.5 text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
          title="Toggle Mute"
        >
          {volume === 0 ? (
            <VolumeX size={24} strokeWidth={2.5} />
          ) : (
            <Volume2 size={24} strokeWidth={2.5} />
          )}
        </button>
      </div>

      <div className="absolute right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 md:flex">
        <button
          onClick={scrollToPrev}
          className="group rounded-full border border-white/10 bg-black/20 p-3 text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
          title="Previous Reel"
        >
          <ChevronUp
            size={28}
            strokeWidth={3}
            className="transition-transform group-hover:-translate-y-0.5"
          />
        </button>
        <button
          onClick={scrollToNext}
          className="group rounded-full border border-white/10 bg-black/20 p-3 text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
          title="Next Reel"
        >
          <ChevronDown
            size={28}
            strokeWidth={3}
            className="transition-transform group-hover:translate-y-0.5"
          />
        </button>
      </div>

      <div
        ref={containerRef}
        className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-auto"
      >
        {(() => {
          const activeIndex = reels.findIndex((r: any) => r.id === activeReelId);
          return reels.map((reel: any, index: number) => (
            <div
              key={reel.feed_id || reel.id}
              ref={(el) => setReelRef(reel.id, el)}
              data-id={reel.id}
              className="snap-start snap-always h-full w-full"
            >
              <ReelItem
                reel={reel}
                isActive={activeReelId === reel.id}
                volume={volume}
                onDelete={handleDelete}
                shouldLoad={
                  // Load current, previous, and next videos
                  activeIndex === -1 || Math.abs(activeIndex - index) <= 1
                }
              />
            </div>
          ));
        })()}
        {loadingMore && (
          <div className="flex h-[100dvh] w-full snap-start items-center justify-center bg-black">
            <SkeletonReel />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;
