import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Plyr } from "plyr-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ReelCommentsModal } from "@/components/features/post";

const ReelItem = React.memo(({ reel, isActive, isMuted, onToggleMute }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const playerRef = useRef(null);
  const [showHeart, setShowHeart] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(null); // 'play' or 'pause'
  const clickTimer = useRef(null);
  const lastTap = useRef(0);

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
            player.play().catch((err) => {
              console.error("Autoplay failed, retrying muted:", err);
              player.muted = true;
              player.play();
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

  // Sync mute state without re-rendering everything
  useEffect(() => {
    const player = playerRef.current?.plyr;
    if (player) {
      player.muted = isMuted;
    }
  }, [isMuted]);

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
        player.play();
        setIsPlaying(true);
        setShowPlayPauseIcon("play");
      } else {
        player.pause();
        setIsPlaying(false);
        setShowPlayPauseIcon("pause");
      }
      setTimeout(() => setShowPlayPauseIcon(null), 500);
    }
  };

  const handleDoubleLike = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
    // Here you would normally call the like API
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

      <div className="absolute bottom-20 left-4 right-16 text-white pointer-events-none">
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
          <button
            className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full ml-2 hover:scale-105 active:scale-95 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            Follow
          </button>
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

      <div className="absolute bottom-20 right-2 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1 pointer-events-auto">
          <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90">
            <Heart size={28} />
          </button>
          <span className="text-white text-xs font-bold">
            {reel.stats?.likes || 0}
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
          <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90">
            <Share2 size={28} />
          </button>
          <span className="text-white text-xs font-bold">
            {reel.stats?.shares || 0}
          </span>
        </div>
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
