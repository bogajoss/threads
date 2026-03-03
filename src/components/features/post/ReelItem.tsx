import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, Music, Play, Pause, Flag, Trash2 } from "lucide-react";
import { VideoJSPlayer } from "@/components/features/post";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import RichText from "@/components/ui/rich-text";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReelCommentsModal, ShareModal } from "@/components/features/post";
import { useReportModal } from "@/context/ReportContext";
import SkeletonReel from "@/components/features/reels/skeleton-reel";
import { toggleLike, checkIfLiked, incrementPostViews, deletePost } from "@/lib/api/posts";
import { toggleFollow, checkIfFollowing } from "@/lib/api/users";
import {
  ShareIcon,
  ChatIcon,
} from "@/components/ui";
import { generateReelUrl } from "@/lib/config";
import { motion, AnimatePresence } from "motion/react";

interface ReelItemProps {
  reel: any;
  isActive: boolean;
  volume: number;
  onVolumeChange?: (volume: number) => void;
  shouldLoad?: boolean;
  onDelete: (reelId: string) => void;
}

const ReelItem: React.FC<ReelItemProps> = React.memo(
  ({ reel, isActive, volume, shouldLoad = true, onDelete }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { openReport } = useReportModal();
    const queryClient = useQueryClient();
    const playerRef = useRef<any>(null);
    const [showHeart, setShowHeart] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [showPlayPauseIcon, setShowPlayPauseIcon] = useState<
      "play" | "pause" | "forward" | "rewind" | null
    >(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(reel.stats?.likes || 0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [progress, setProgress] = useState(0);
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const videoUrl = useMemo(() => {
      return Array.isArray(reel.media)
        ? reel.media[0]?.src || reel.media[0]?.url
        : reel.media?.src || reel.media?.url || reel.url;
    }, [reel.media, reel.url]);

    const handleDeleteReel = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentUser || reel.user.id !== currentUser.id) return;
  
      if (window.confirm("Are you sure you want to delete this reel? This action cannot be undone.")) {
        const toastId = toast.loading("Deleting reel...");
        try {
          await deletePost(reel.id);
          toast.success("Reel deleted successfully.", { id: toastId });
          onDelete(reel.id);
          queryClient.invalidateQueries({ queryKey: ["reels"] });
        } catch (error) {
          toast.error("Failed to delete reel.", { id: toastId });
          console.error("Failed to delete reel:", error);
        }
      }
    };

    // Track views
    useEffect(() => {
      if (isActive && reel.id && !reel.id.toString().startsWith("temp-")) {
        const timer = setTimeout(() => {
          incrementPostViews(reel.id).catch(console.error);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isActive, reel.id]);

    const handlePlayerReady = useCallback((player: any) => {
      playerRef.current = player;
      setIsVideoLoaded(true);
      
      player.on('timeupdate', () => {
        const current = player.currentTime();
        const duration = player.duration();
        if (duration > 0) {
          setProgress((current / duration) * 100);
        }
      });
    }, []);

    useEffect(() => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.volume(volume);
        playerRef.current.muted(volume === 0);
      }
    }, [volume]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!playerRef.current || playerRef.current.isDisposed()) return;
      
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.min(Math.max(0, x / rect.width), 1);
      
      const duration = playerRef.current.duration();
      if (duration) {
        playerRef.current.currentTime(percentage * duration);
      }
    };

    const handleInteraction = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".vjs-control-bar")
      )
        return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;

      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
        
        // Check where the double tap happened
        if (x < width / 3) {
          handleSkip(-10);
        } else if (x > (width * 2) / 3) {
          handleSkip(10);
        } else {
          handleDoubleLike();
        }
      } else {
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null;
          handleTogglePlay();
        }, 250);
      }
    };

    const handleSkip = (seconds: number) => {
      const player = playerRef.current;
      if (!player || player.isDisposed()) return;
      
      const currentTime = player.currentTime();
      const duration = player.duration();
      const newTime = Math.min(Math.max(0, currentTime + seconds), duration);
      player.currentTime(newTime);
      
      // Feedback
      setShowPlayPauseIcon(seconds > 0 ? "forward" : "rewind" as any);
      setTimeout(() => setShowPlayPauseIcon(null), 800);
    };

    const handleTogglePlay = () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        if (player.paused()) {
          player.play()?.catch(() => {});
          setShowPlayPauseIcon("play");
        } else {
          player.pause();
          setShowPlayPauseIcon("pause");
        }
        setTimeout(() => setShowPlayPauseIcon(null), 800);
      }
    };

    const handleDoubleLike = async () => {
      if (!currentUser) return;
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
      if (!isLiked) {
        setIsLiked(true);
        setLikesCount((prev: number) => prev + 1);
        try {
          await toggleLike(currentUser.id, reel.id);
        } catch {
          setIsLiked(false);
          setLikesCount((prev: number) => prev - 1);
        }
      }
    };

    const handleToggleLike = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentUser) return;
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      setLikesCount((prev: number) => (newLiked ? prev + 1 : prev - 1));
      try {
        await toggleLike(currentUser.id, reel.id);
      } catch {
        setIsLiked(!newLiked);
        setLikesCount((prev: number) => (!newLiked ? prev + 1 : prev - 1));
      }
    };

    const handleToggleFollow = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentUser || !reel.user?.id || reel.user.id === "undefined") return;
      const newFollowing = !isFollowing;
      setIsFollowing(newFollowing);
      try {
        await toggleFollow(currentUser.id, reel.user.id);
      } catch {
        setIsFollowing(!newFollowing);
      }
    };

    useEffect(() => {
      const checkStatus = async () => {
        if (!currentUser?.id || !isActive) return;
        
        try {
          const reelId = reel.id;
          if (!reelId || reelId.toString().startsWith("temp-")) return;
          
          const ownerId = reel.user?.id || reel.user_id;
          
          // Check liked status (always check if logged in)
          const liked = await checkIfLiked(currentUser.id, reelId);
          setIsLiked(liked);

          // Check following status (only if viewing someone else)
          if (ownerId && ownerId !== "undefined" && ownerId !== currentUser.id) {
            const following = await checkIfFollowing(currentUser.id, ownerId);
            setIsFollowing(following);
          }
        } catch (err) {
          console.error("Interaction check failed:", err);
        }
      };
      checkStatus();
    }, [reel.id, currentUser?.id, isActive, reel.user?.id, reel.user_id]);

    return (
      <div
        data-id={reel.id}
        className="reel-item relative flex h-[100dvh] w-full snap-start items-center justify-center overflow-hidden bg-black cursor-pointer select-none"
        onClick={handleInteraction}
      >
        <div className="relative flex h-full w-full max-w-[450px] items-center justify-center">
          <div className="w-full h-full">
            {shouldLoad ? (
              <VideoJSPlayer
                src={videoUrl}
                autoplay={isActive}
                showControls={false}
                aspectRatio="9:16"
                onReady={handlePlayerReady}
                volume={volume}
                muted={volume === 0}
                loop={true}
                fillContainer={true}
                enableDoubleTapSkip={false}
                enableTapPause={false}
              />
            ) : (
              <div className="aspect-[9/16] w-full bg-zinc-900">
                <img
                  src={reel.media?.[0]?.preview || reel.media?.[0]?.thumbnail || videoUrl}
                  className="h-full w-full object-cover opacity-50 blur-xl"
                  alt=""
                />
              </div>
            )}
          </div>

          <AnimatePresence>
            {!isVideoLoaded && (
              <motion.div 
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] flex items-center justify-center bg-zinc-900 pointer-events-none"
              >
                <SkeletonReel />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
              >
                <Heart size={120} fill="white" className="text-white drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPlayPauseIcon && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <div className="rounded-full bg-black/40 p-10 backdrop-blur-md flex flex-col items-center gap-2">
                  {showPlayPauseIcon === "play" && <Play size={50} fill="white" className="ml-1.5 text-white" />}
                  {showPlayPauseIcon === "pause" && <Pause size={50} fill="white" className="text-white" />}
                  {showPlayPauseIcon === "forward" && (
                    <>
                      <motion.div initial={{ x: -10 }} animate={{ x: 10 }} transition={{ repeat: Infinity, duration: 0.5 }}>
                        <Play size={50} fill="white" className="text-white" />
                      </motion.div>
                      <span className="text-xs font-bold text-white tracking-widest">+10s</span>
                    </>
                  )}
                  {showPlayPauseIcon === "rewind" && (
                    <>
                      <motion.div initial={{ x: 10 }} animate={{ x: -10 }} transition={{ repeat: Infinity, duration: 0.5 }}>
                        <Play size={50} fill="white" className="rotate-180 text-white" />
                      </motion.div>
                      <span className="text-xs font-bold text-white tracking-widest">-10s</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          <div className="pointer-events-none absolute bottom-6 left-4 right-16 text-white z-10">
            <div className="pointer-events-auto mb-3 flex items-center gap-2">
              <Link to={`/u/${reel.user?.handle}`} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Avatar className="size-10 border-2 border-white">
                  <AvatarImage src={reel.user?.avatar} alt="" className="object-cover" />
                  <AvatarFallback>{reel.user?.handle?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-bold text-shadow">@{reel.user?.handle}</span>
              </Link>
              {currentUser?.id !== reel.user?.id && (
                <button
                  className={`ml-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                    isFollowing ? "border border-white/50 bg-transparent text-white" : "bg-white text-black"
                  }`}
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
            <RichText content={reel.content} className="mb-3 line-clamp-2 text-sm text-white text-shadow" />
            <div className="flex items-center gap-2 text-xs opacity-90">
              <Music size={14} className="animate-spin-slow" />
              <span>Original Audio - {reel.user?.handle}</span>
            </div>
          </div>

          <div className="absolute bottom-6 right-2 z-20 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <button className={`rounded-full p-3 backdrop-blur-md ${isLiked ? "bg-rose-500/20 text-rose-500" : "bg-zinc-800/50 text-white"}`} onClick={handleToggleLike}>
                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <span className="text-xs font-bold text-white shadow-sm">{likesCount}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md" onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(true); }}>
                <ChatIcon size={28} />
              </button>
              <span className="text-xs font-bold text-white shadow-sm">{reel.stats?.comments || 0}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md" onClick={(e) => { e.stopPropagation(); setIsShareOpen(true); }}>
                <ShareIcon size={28} />
              </button>
              <span className="text-xs font-bold text-white shadow-sm">{reel.stats?.shares || 0}</span>
            </div>
            <button className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md" onClick={(e) => { e.stopPropagation(); openReport("reel", reel.id); }}>
              <Flag size={28} />
            </button>
            {currentUser?.id === reel.user?.id && (
              <button
                className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md"
                onClick={handleDeleteReel}
              >
                <Trash2 size={28} />
              </button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 z-50 h-1.5 w-full bg-white/10 transition-all cursor-pointer group/progress" onClick={handleSeek}>
            <div className="h-full bg-white shadow-[0_0_12px_white] transition-all duration-100 relative" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-lg border border-white/20" />
            </div>
          </div>
        </div>
        
        <ReelCommentsModal isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} reelId={reel.id} currentUser={currentUser} showToast={addToast} />
        <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} url={generateReelUrl(reel.id)} title="Share Reel" overlayClassName="z-[9999]" />
      </div>
    );
  }
);

export default ReelItem;
