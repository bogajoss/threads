import React from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/context/PostContext";
import ReelItem from "@/components/features/post/ReelItem";

const Reels = () => {
  const { posts, loading } = usePosts();
  const navigate = useNavigate();
  const videoPosts = posts.filter(
    (p) => p.type === "video" || p.category === "video",
  );

  if (loading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-black">
        <Loader2 size={40} className="animate-spin text-white" />
      </div>
    );
  }

  if (videoPosts.length === 0) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-black text-white gap-4">
        <p className="text-zinc-500">No reels found.</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-auto no-scrollbar bg-black md:rounded-xl relative">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-50 p-2.5 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md rounded-full transition-all active:scale-90 border border-white/10 shadow-xl"
        title="Back"
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>

      {videoPosts.map((reel) => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

export default Reels;
