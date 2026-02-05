import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Music, Play, Pause } from "lucide-react";
const Plyr = React.lazy(() =>
  import("plyr-react").then((m) => ({ default: m.Plyr })),
);
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
// @ts-ignore
import { ReelCommentsModal, ShareModal } from "@/components/features/post";
import { toggleLike, checkIfLiked } from "@/lib/api/posts";
import { toggleFollow, checkIfFollowing } from "@/lib/api/users";
import {
  ShareIcon,
  FollowIcon,
  FollowingIcon,
  ChatIcon,
} from "@/components/ui";

interface ReelItemProps {
  reel: any; // Using any for reel as it's complex, better to define Key interface later
  isActive: boolean;
  isMuted: boolean;
  onToggleMute?: () => void;
}

const ReelItem: React.FC<ReelItemProps> = React.memo(
  ({ reel, isActive, isMuted }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const playerRef = useRef<any>(null);
    const [showHeart, setShowHeart] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [showPlayPauseIcon, setShowPlayPauseIcon] = useState<
      "play" | "pause" | null
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

    useEffect(() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      const player = playerRef.current?.plyr;

      if (player) {
        if (isActive) {
          timeoutId = setTimeout(() => {
            if (typeof player.play === "function") {
              player.play().catch(() => {
                // Ignore play error, try muted
                if (player) {
                  player.muted = true;
                  player.play().catch(() => {});
                }
              });
            }
          }, 100);
        } else {
          if (typeof player.pause === "function") {
            player.pause();
          }
        }
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [isActive]);

    // Fetch initial interaction status
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

    // Sync mute state
    useEffect(() => {
      const player = playerRef.current?.plyr;
      if (player) {
        // eslint-disable-next-line react-hooks/immutability
        player.muted = isMuted;
      }
    }, [isMuted]);

    // Track progress
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

    // Cleanup timer on unmount
    useEffect(() => {
      return () => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
      };
    }, []);

    const handleInteraction = (e: React.MouseEvent) => {
      // Don't trigger if clicked on interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".plyr__controls")
      )
        return;

      if (clickTimer.current) {
        // Double Tap Detected
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
        handleDoubleLike();
      } else {
        // Snappier Single Tap detection
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null;
          handleTogglePlay();
        }, 250); // Slightly more time for double-tap recognition
      }
    };

    const handleTogglePlay = () => {
      const player = playerRef.current?.plyr;
      if (player) {
        if (player.paused) {
          player.play().catch(() => {});
          setShowPlayPauseIcon("play");
        } else {
          player.pause();
          setShowPlayPauseIcon("pause");
        }
        // Auto-hide icon
        setTimeout(() => setShowPlayPauseIcon(null), 800);
      }
    };

    const handleDoubleLike = async () => {
      if (!currentUser) return;

      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);

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
          clickToPlay: false, // Important: disable Plyr's default click to avoid conflict
          ratio: "9:16",
        },
      }),
      [videoUrl],
    );

    return (
      <div
        data-id={reel.id}
        className="reel-item relative flex h-[100dvh] w-full snap-start items-center justify-center overflow-hidden bg-black cursor-pointer"
        onClick={handleInteraction}
      >
        <div className="relative flex h-full w-full max-w-[450px] items-center justify-center">
          <div className="w-full">
            <React.Suspense
              fallback={
                <div className="aspect-[9/16] w-full bg-zinc-900 animate-pulse" />
              }
            >
              <Plyr ref={playerRef} {...plyrProps} />
            </React.Suspense>
          </div>

          {showHeart && (
            <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
              <div className="animate-in zoom-in-50 fade-out fill-mode-forwards duration-500">
                <Heart
                  size={120}
                  fill="white"
                  className="scale-125 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>
          )}

          {showPlayPauseIcon && (
            <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
              <div className="animate-in fade-in zoom-in-90 scale-100 animate-out zoom-out-110 fade-out fill-mode-forwards duration-500">
                <div className="rounded-full border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
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
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          <div className="pointer-events-none absolute bottom-6 left-4 right-16 text-white">
            <div className="pointer-events-auto mb-3 flex items-center gap-2">
              <Link
                to={`/u/${reel.user?.handle}`}
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
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
                  className={`ml-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                    isFollowing
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
            <Linkify
              options={{
                ...linkifyOptions,
                render: ({ attributes, content }) => {
                  const { href, ...props } = attributes;
                  const isExternal =
                    !href.startsWith("/") &&
                    (href.startsWith("http") || href.startsWith("www"));

                  if (
                    href.startsWith("/u/") ||
                    href.startsWith("/tags/") ||
                    href.startsWith("/c/") ||
                    href.startsWith("/explore")
                  ) {
                    return (
                      <span
                        key={content}
                        {...props}
                        className="cursor-pointer font-bold text-white hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(href);
                        }}
                      >
                        {content}
                      </span>
                    );
                  }
                  return (
                    <a
                      key={content}
                      href={href}
                      {...props}
                      className="text-white hover:underline"
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {content}
                    </a>
                  );
                },
              }}
            >
              <p className="mb-3 line-clamp-2 text-sm">{reel.content}</p>
            </Linkify>
            <div className="flex items-center gap-2 text-xs opacity-90">
              <Music size={14} className="animate-spin-slow" />
              <span>Original Audio - {reel.user?.handle}</span>
            </div>
          </div>

          <div className="absolute bottom-6 right-2 z-10 flex flex-col items-center gap-6">
            <div className="pointer-events-auto flex flex-col items-center gap-1">
              <button
                className={`rounded-full p-3 backdrop-blur-md transition-all active:scale-90 ${
                  isLiked
                    ? "bg-rose-500/20 text-rose-500"
                    : "bg-zinc-800/50 text-white hover:bg-zinc-700"
                }`}
                onClick={handleToggleLike}
              >
                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <span className="text-xs font-bold text-white">{likesCount}</span>
            </div>
            <div className="pointer-events-auto flex flex-col items-center gap-1">
              <button
                className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-zinc-700 active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCommentsOpen(true);
                }}
              >
                <ChatIcon size={28} />
              </button>
              <span className="text-xs font-bold text-white">
                {reel.stats?.comments || 0}
              </span>
            </div>
            <div className="pointer-events-auto flex flex-col items-center gap-1">
              <button
                className="rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-zinc-700 active:scale-90"
                onClick={handleShare}
              >
                <ShareIcon size={28} />
              </button>
              <span className="text-xs font-bold text-white">
                {reel.stats?.shares || 0}
              </span>
            </div>
          </div>

          {/* Video Progress Bar */}
          <div className="absolute bottom-0 left-0 z-50 h-[3px] w-full bg-white/20">
            <div
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
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
          url={`${window.location.origin}/r/${reel.id}`}
          title="Share Reel"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isActive === nextProps.isActive &&
      prevProps.reel.id === nextProps.reel.id &&
      prevProps.isMuted === nextProps.isMuted
    );
  },
);

export default ReelItem;
