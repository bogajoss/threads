import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Music, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Plyr } from "plyr-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ReelCommentsModal } from "@/components/features/post";
import { toggleLike, checkIfLiked } from "@/lib/api/posts";
import { toggleFollow, checkIfFollowing } from "@/lib/api/users";
import { ShareIcon, FollowIcon, FollowingIcon } from "@/components/ui";

const ReelItem = React.memo(({ reel, isActive, isMuted }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const playerRef = useRef(null);
  const [showHeart, setShowHeart] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(null); // 'play' or 'pause'
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.stats?.likes || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [progress, setProgress] = useState(0);
  const clickTimer = useRef(null);

  const videoUrl = useMemo(() => {
    return Array.isArray(reel.media)
      ? reel.media[0]?.src || reel.media[0]?.url
      : reel.media?.src || reel.media?.url || reel.url;
  }, [reel.media, reel.url]);

  useEffect(() => {
    let timeoutId;
    const player = playerRef.current?.plyr;

    if (player) {
      if (isActive) {
        timeoutId = setTimeout(() => {
          if (typeof player.play === "function") {
            player.play().catch(() => {
              // Ignore play error, try muted
              if (player) {
                player.muted = true;
                player.play().catch(() => { });
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
          checkIfFollowing(currentUser.id, reel.user?.id)
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

    if (typeof player.on === 'function') {
      player.on("timeupdate", handleTimeUpdate);
      return () => {
        if (typeof player.off === 'function') {
          player.off("timeupdate", handleTimeUpdate);
        }
      };
    }
  }, [isActive]);

  const handleInteraction = (e) => {
    // Don't trigger if clicked on interactive elements
    if (e.target.closest('button') || e.target.closest('a')) return;

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
      }, 200);
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
      setTimeout(() => setShowPlayPauseIcon(null), 500);
    }
  };

  const handleDoubleLike = async () => {
    if (!currentUser) return;

    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);

    if (!isLiked) {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      try {
        await toggleLike(reel.id, currentUser.id);
      } catch {
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      }
    }
  };

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;

    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      await toggleLike(reel.id, currentUser.id);
    } catch {
      setIsLiked(!newLiked);
      setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
    }
  };

  const handleToggleFollow = async (e) => {
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

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/reels?id=${reel.id}`;
    navigator.clipboard.writeText(url);
    addToast("Link copied to clipboard!");
  };

  const plyrProps = useMemo(() => ({
    source: {
      type: "video",
      sources: [{ src: videoUrl, type: "video/mp4" }],
    },
    options: {
      controls: [],
      loop: { active: true },
      clickToPlay: true,
      ratio: "9:16",
    },
  }), [videoUrl]);

  return (
    <div
      data-id={reel.id}
      className="reel-item relative h-screen w-full bg-black snap-start flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleInteraction}
    >
      <div className="w-full h-full max-w-[450px]">
        <Plyr ref={playerRef} {...plyrProps} />
      </div>

      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-in zoom-in-50 fade-out fill-mode-forwards duration-500">
            <Heart
              size={120}
              fill="white"
              className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-125"
            />
          </div>
        </div>
      )}

      {showPlayPauseIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-in fade-in zoom-in-90 scale-100 animate-out zoom-out-110 fade-out fill-mode-forwards duration-500">
            <div className="p-8 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
              {showPlayPauseIcon === "play" ? (
                <Play size={50} fill="white" className="text-white ml-1.5" />
              ) : (
                <Pause size={50} fill="white" className="text-white" />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      <div className="absolute bottom-6 left-4 right-16 text-white pointer-events-none">
        <div className="flex items-center gap-2 mb-3 pointer-events-auto">
          <Link
            to={`/u/${reel.user?.handle}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
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
              className={`text-xs font-bold px-3 py-1.5 rounded-full ml-2 transition-all active:scale-95 flex items-center gap-1.5 ${isFollowing
                ? "bg-transparent border border-white/50 text-white"
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
                    className="text-white font-bold hover:underline cursor-pointer"
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
          <p className="text-sm mb-3 line-clamp-2">{reel.content}</p>
        </Linkify>
        <div className="flex items-center gap-2 text-xs opacity-90">
          <Music size={14} className="animate-spin-slow" />
          <span>Original Audio - {reel.user?.handle}</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-2 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1 pointer-events-auto">
          <button
            className={`p-3 rounded-full backdrop-blur-md transition-all active:scale-90 ${isLiked ? "bg-rose-500/20 text-rose-500" : "bg-zinc-800/50 text-white hover:bg-zinc-700"
              }`}
            onClick={handleToggleLike}
          >
            <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <span className="text-white text-xs font-bold">
            {likesCount}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 pointer-events-auto">
          <button
            className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90"
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentsOpen(true);
            }}
          >
            <MessageCircle size={28} />
          </button>
          <span className="text-white text-xs font-bold">
            {reel.stats?.comments || 0}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 pointer-events-auto">
          <button
            className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90"
            onClick={handleShare}
          >
            <ShareIcon size={28} />
          </button>
          <span className="text-white text-xs font-bold">
            {reel.stats?.shares || 0}
          </span>
        </div>
      </div>

      {/* Video Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20 z-50">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ReelCommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        reelId={reel.id}
        currentUser={currentUser}
        showToast={addToast}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.isActive === nextProps.isActive &&
    prevProps.reel.id === nextProps.reel.id &&
    prevProps.isMuted === nextProps.isMuted;
});

export default ReelItem;
