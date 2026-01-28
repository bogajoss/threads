import React from "react";
import { Loader2, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import ReelItem from "@/components/features/post/ReelItem";
import { useReels } from "@/hooks";
import SEOHead from "@/components/seo/SEOHead";

const Reels = () => {
  const {
    reels,
    loading,
    loadingMore,
    activeReelId,
    isMuted,
    containerRef,
    navigate,
    toggleMute,
  } = useReels();

  if (loading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-black">
        <SEOHead title="Reels" />
        <Loader2 size={40} className="animate-spin text-white" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-black text-white gap-4">
        <SEOHead title="No Reels" />
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
      <SEOHead 
        title="Reels" 
        description="Watch short, trending videos and creative content on Sysm." 
      />
      {/* Fixed Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-50 p-2.5 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md rounded-full transition-all active:scale-90 border border-white/10 shadow-xl"
        title="Back"
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>

      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-50 p-2.5 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md rounded-full transition-all active:scale-90 border border-white/10 shadow-xl"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} strokeWidth={2.5} /> : <Volume2 size={24} strokeWidth={2.5} />}
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
            isMuted={isMuted}
            onToggleMute={toggleMute}
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