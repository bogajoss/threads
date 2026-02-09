import {
  ArrowLeft,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import SkeletonReel from "@/components/features/reels/skeleton-reel";

import ReelItem from "@/components/features/post/ReelItem";
import { useReels } from "@/hooks/pages/useReels";

const Reels = () => {
  const {
    reels,
    loading,
    loadingMore,
    activeReelId,
    isMuted,
    containerRef,
    setReelRef,
    navigate,
    toggleMute,
    scrollToNext,
    scrollToPrev,
  } = useReels();

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
          onClick={() => navigate(-1)}
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
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 z-50 rounded-full border border-white/10 bg-black/20 p-2.5 text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
        title="Back"
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>

      <button
        onClick={toggleMute}
        className="absolute right-6 top-6 z-50 rounded-full border border-white/10 bg-black/20 p-2.5 text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX size={24} strokeWidth={2.5} />
        ) : (
          <Volume2 size={24} strokeWidth={2.5} />
        )}
      </button>

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
        {reels.map((reel) => (
          <div
            key={reel.feed_id || reel.id}
            ref={(el) => setReelRef(reel.id, el)}
            data-id={reel.id}
            className="snap-start snap-always h-full w-full"
          >
            <ReelItem
              reel={reel}
              isActive={activeReelId === reel.id}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              shouldLoad={
                // Load current, previous, and next videos
                Math.abs(
                  reels.findIndex((r) => r.id === activeReelId) -
                  reels.findIndex((r) => r.id === reel.id),
                ) <= 1
              }
            />
          </div>
        ))}
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