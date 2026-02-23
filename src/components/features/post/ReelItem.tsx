import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Music, Play, Pause } from "lucide-react";
import { Plyr } from "plyr-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import RichText from "@/components/ui/rich-text";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ReelCommentsModal, ShareModal } from "@/components/features/post";
import { useReportModal } from "@/context/ReportContext";
import SkeletonReel from "@/components/features/reels/skeleton-reel";
import { toggleLike, checkIfLiked } from "@/lib/api/posts";
import { toggleFollow, checkIfFollowing } from "@/lib/api/users";
import {
  ShareIcon,
  FollowIcon,
  FollowingIcon,
  ChatIcon,
} from "@/components/ui";
import { Flag } from "lucide-react";
import { generateReelUrl } from "@/lib/config";

interface ReelItemProps {
  reel: any;
  isActive: boolean;
  volume: number;
  onVolumeChange?: (volume: number) => void;
  shouldLoad?: boolean;
}

import { motion, AnimatePresence } from "motion/react";

// Global lock to ensure only one reel plays at a time
let currentlyPlayingPlayer: any = null;

// Export function to reset global lock (used when leaving Reels page)
export const resetCurrentlyPlayingPlayer = () => {
  currentlyPlayingPlayer = null;
};

const ReelItem: React.FC<ReelItemProps> = React.memo(
  ({ reel, isActive, volume, shouldLoad = true }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { openReport } = useReportModal();
    const playerRef = useRef<any>(null);
    const [showHeart, setShowHeart] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [showPlayPauseIcon, setShowPlayPauseIcon] = useState<
      "play" | "pause" | null
    >(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(reel.stats?.likes || 0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const videoUrl = useMemo(() => {
      return Array.isArray(reel.media)
        ? reel.media[0]?.src || reel.media[0]?.url
        : reel.media?.src || reel.media?.url || reel.url;
    }, [reel.media, reel.url]);

    useEffect(() => {
      setIsVideoLoaded(false);
      setHasPlayedOnce(false);
      const player = playerRef.current?.plyr;

      if (player && typeof player.on === "function") {
        const handleLoaded = () => setIsVideoLoaded(true);
        const handlePlaying = () => setHasPlayedOnce(true);

        player.on("ready", handleLoaded);
        player.on("canplay", handleLoaded);
        player.on("loadeddata", handleLoaded);
        player.on("playing", handlePlaying);

        // Safety timeout to hide skeleton if events don't fire
        const safetyTimeout = setTimeout(() => {
          if (!hasPlayedOnce && isActive) setHasPlayedOnce(true);
        }, 3000);

        return () => {
          clearTimeout(safetyTimeout);
          if (typeof player.off === "function") {
            player.off("ready", handleLoaded);
            player.off("canplay", handleLoaded);
            player.off("loadeddata", handleLoaded);
            player.off("playing", handlePlaying);
          }
        };
      } else {
        // Fallback if player API is not available (e.g. during initialization)
        const timer = setTimeout(() => {
          setIsVideoLoaded(true);
          if (isActive) setHasPlayedOnce(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [videoUrl, isActive]);

    // Ref to track the pending play timeout so we can cancel it
    const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      const player = playerRef.current?.plyr;

      // Always cancel any pending play call first
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }

      if (!player || !isVideoLoaded) return;

      if (isActive) {
        // Small delay to ensure smooth transition
        playTimeoutRef.current = setTimeout(() => {
          playTimeoutRef.current = null;
          const p = playerRef.current?.plyr;
          if (p && typeof p.play === "function") {
            // Pause any currently playing video first (global lock)
            if (currentlyPlayingPlayer && currentlyPlayingPlayer !== p) {
              currentlyPlayingPlayer.pause();
              if (typeof currentlyPlayingPlayer.currentTime !== "undefined") {
                currentlyPlayingPlayer.currentTime = 0;
              }
            }

            p.play().catch(() => {
              const p2 = playerRef.current?.plyr;
              if (p2) {
                p2.muted = true;
                p2.play().catch(() => { });
              }
            }).then(() => {
              // Update global lock
              currentlyPlayingPlayer = p;
            });
          }
        }, 50); // Reduced timeout for faster response
      } else {
        // Pause immediately when not active - ensure video is fully stopped
        if (typeof player.pause === "function") {
          player.pause();
          // Reset to beginning to prevent audio from continuing
          if (typeof player.currentTime !== "undefined") {
            player.currentTime = 0;
          }
          // Clear global lock if this was the playing video
          if (currentlyPlayingPlayer === player) {
            currentlyPlayingPlayer = null;
          }
        }
      }

      return () => {
        // Cancel any pending play call
        if (playTimeoutRef.current) {
          clearTimeout(playTimeoutRef.current);
          playTimeoutRef.current = null;
        }
        // Immediately pause when cleanup runs (isActive changed or unmount)
        const p = playerRef.current?.plyr;
        if (p && typeof p.pause === "function") {
          p.pause();
          if (typeof p.currentTime !== "undefined") {
            p.currentTime = 0;
          }
          // Clear global lock if this was the playing video
          if (currentlyPlayingPlayer === p) {
            currentlyPlayingPlayer = null;
          }
        }
      };
    }, [isActive, isVideoLoaded]);

    // Dedicated unmount cleanup — ensures video always stops when component leaves DOM
    useEffect(() => {
      return () => {
        if (playTimeoutRef.current) {
          clearTimeout(playTimeoutRef.current);
          playTimeoutRef.current = null;
        }
        const p = playerRef.current?.plyr;
        if (p) {
          p.pause();
          // Reset video to beginning to ensure clean state
          p.currentTime = 0;
          // Clear global lock if this was the playing video
          if (currentlyPlayingPlayer === p) {
            currentlyPlayingPlayer = null;
          }
        }
        // Reset all local states
        setIsVideoLoaded(false);
        setHasPlayedOnce(false);
        setProgress(0);
      };
    }, []);

    useEffect(() => {
      if (!currentUser?.id || !isActive) return;

      const checkStatus = async () => {
        try {
          const [liked, following] = await Promise.all([
            checkIfLiked(reel.id, currentUser.id),
            checkIfFollowing(currentUser.id, reel.user?.id),
          ]);
          setIsLiked(liked);
          setIsFollowing(following);
        } catch (err) {
          console.error("Failed to check interaction status:", err);
        }
      };

      checkStatus();
    }, [reel.id, currentUser?.id, isActive, reel.user?.id]);

    useEffect(() => {
      const player = playerRef.current?.plyr;
      if (player) {
        player.muted = volume === 0;
        player.volume = volume;
      }
    }, [volume, isVideoLoaded]); // Re-sync when video is loaded or volume changes

    useEffect(() => {
      const player = playerRef.current?.plyr;
      if (!player || !isActive) return;

      const handleTimeUpdate = () => {
        const current = player.currentTime;
        const duration = player.duration;
        if (duration > 0) {
          setProgress((current / duration) * 100);
        }
      };

      if (typeof player.on === "function") {
        player.on("timeupdate", handleTimeUpdate);
        return () => {
          if (typeof player.off === "function") {
            player.off("timeupdate", handleTimeUpdate);
          }
        };
      }
    }, [isActive]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.min(Math.max(0, x / rect.width), 1);
      const player = playerRef.current?.plyr;

      if (player && player.duration) {
        const newTime = percentage * player.duration;
        // eslint-disable-next-line react-hooks/immutability
        player.currentTime = newTime;
        setProgress(percentage * 100);
      }
    };

    useEffect(() => {
      return () => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
      };
    }, []);

    const handleInteraction = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".plyr__controls")
      )
        return;

      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
        handleDoubleLike();
      } else {
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null;
          handleTogglePlay();
        }, 250);
      }
    };

    const handleTogglePlay = () => {
      const player = playerRef.current?.plyr;
      if (player) {
        if (player.paused) {
          player.play().catch(() => { });
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
          await toggleLike(reel.id, currentUser.id);
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
        await toggleLike(reel.id, currentUser.id);
      } catch {
        setIsLiked(!newLiked);
        setLikesCount((prev: number) => (!newLiked ? prev + 1 : prev - 1));
      }
    };

    const handleToggleFollow = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentUser) return;

      const newFollowing = !isFollowing;
      setIsFollowing(newFollowing);

      try {
        await toggleFollow(currentUser.id, reel.user?.id);
      } catch {
        setIsFollowing(!newFollowing);
      }
    };

    const handleShare = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsShareOpen(true);
    };

    const plyrProps = useMemo(
      () => ({
        source: {
          type: "video" as const,
          sources: [{ src: videoUrl, type: "video/mp4" }],
        },
        options: {
          controls: [],
          loop: { active: true },
          clickToPlay: false,
          ratio: "9:16",
          autoplay: false, // Disabled - we control playback manually
          playsinline: true,
          muted: true, // Start muted to allow autoplay
        },
      }),
      [videoUrl],
    );

    return (
      <div
        data-id={reel.id}
        className="reel-item relative flex h-[100dvh] w-full snap-start items-center justify-center overflow-hidden bg-black cursor-pointer select-none"
        onClick={handleInteraction}
      >
        <div className="relative flex h-full w-full max-w-[450px] items-center justify-center">
          <div className="w-full">
            {shouldLoad ? (
              <Plyr ref={playerRef} {...plyrProps} />
            ) : (
              <div className="aspect-[9/16] w-full bg-zinc-900">
                <img
                  src={
                    reel.media?.[0]?.preview ||
                    reel.media?.[0]?.thumbnail ||
                    videoUrl
                  }
                  className="h-full w-full object-cover opacity-50 blur-xl"
                  alt="Reel preview"
                />
              </div>
            )}
          </div>

          {!hasPlayedOnce && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center bg-zinc-900 pointer-events-none">
              <SkeletonReel />
            </div>
          )}

          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 400, damping: 20 }}
                className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
              >
                <Heart
                  size={120}
                  fill="white"
                  className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPlayPauseIcon && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-50 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlay();
                }}
              >
                <div className="rounded-full border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md cursor-pointer hover:bg-white/20 transition-colors">
                  {showPlayPauseIcon === "play" ? (
                    <Play
                      size={50}
                      fill="white"
                      className="ml-1.5 text-white"
                    />
                  ) : (
                    <Pause size={50} fill="white" className="text-white" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          <div className="pointer-events-none absolute bottom-6 left-4 right-16 text-white">
            <div className="pointer-events-auto mb-3 flex items-center gap-2">
              <Link
                to={`/u/${reel.user?.handle}`}
                className="flex items-center gap-2 transition-opacity hover:opacity-80 active:scale-95"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="size-10 border-2 border-white">
                  <AvatarImage
                    src={reel.user?.avatar}
                    alt={reel.user?.handle}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {reel.user?.handle?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-bold">@{reel.user?.handle}</span>
              </Link>
              {currentUser?.id !== reel.user?.id && (
                <button
                  className={`ml-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${isFollowing
                    ? "border border-white/50 bg-transparent text-white"
                    : "bg-white text-black hover:bg-zinc-200"
                    }`}
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? (
                    <>
                      <FollowingIcon size={14} />
                      <span className="hidden sm:inline">Following</span>
                    </>
                  ) : (
                    <>
                      <FollowIcon size={14} />
                      <span className="hidden sm:inline">Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <RichText
              content={reel.content}
              className="mb-3 line-clamp-2 text-sm text-white"
            />
            <div className="flex items-center gap-2 text-xs opacity-90">
              <Music size={14} className="animate-spin-slow" />
              <span>Original Audio - {reel.user?.handle}</span>
            </div>
          </div>

          <div className="absolute bottom-6 right-2 z-10 flex flex-col items-center gap-6">
            <div className="pointer-events-auto flex flex-col items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.8 }}
                className={`rounded-full p-3 backdrop-blur-md transition-all ${isLiked
                  ? "bg-rose-500/20 text-rose-500"
                  : "bg-zinc-800/50 text-white hover:bg-zinc-700"
                  }`}
                onClick={handleToggleLike}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
                </motion.div>
              </motion.button>
              <span className="text-xs font-bold text-white">{likesCount}</span>
            </div>
            <div className="pointer-events-auto flex flex-col items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.8 }}
                className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-zinc-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCommentsOpen(true);
                }}
              >
                <ChatIcon size={28} />
              </motion.button>
              <span className="text-xs font-bold text-white">
                {reel.stats?.comments || 0}
              </span>
            </div>
            <div className="pointer-events-auto flex flex-col items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.8 }}
                className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-zinc-700"
                onClick={handleShare}
              >
                <ShareIcon size={28} />
              </motion.button>
              <span className="text-xs font-bold text-white">
                {reel.stats?.shares || 0}
              </span>
            </div>
            <div className="pointer-events-auto flex flex-col items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.8 }}
                className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-rose-500/20 hover:text-rose-500"
                onClick={(e) => {
                  e.stopPropagation();
                  openReport("reel", reel.id);
                }}
              >
                <Flag size={28} />
              </motion.button>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 z-50 h-[3px] w-full bg-white/20 hover:h-[8px] transition-all cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-100 ease-linear relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>
        </div>
        <ReelCommentsModal
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          reelId={reel.id}
          currentUser={currentUser}
          showToast={addToast}
        />

        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          url={generateReelUrl(reel.id)}
          title="Share Reel"
          overlayClassName="z-[9999]"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isActive === nextProps.isActive &&
      prevProps.reel.id === nextProps.reel.id &&
      prevProps.volume === nextProps.volume &&
      prevProps.shouldLoad === nextProps.shouldLoad
    );
  },
);

export default ReelItem;
