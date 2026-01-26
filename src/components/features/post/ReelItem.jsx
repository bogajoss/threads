import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Music } from "lucide-react";
import { Plyr } from "plyr-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import { useNavigate } from "react-router-dom";

const ReelItem = ({ reel, isActive }) => {
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  const videoUrl = Array.isArray(reel.media)
    ? reel.media[0]?.src || reel.media[0]?.url
    : reel.media?.src || reel.media?.url || reel.url;

  useEffect(() => {
    if (playerRef.current?.plyr) {
      if (isActive) {
        playerRef.current.plyr.play().catch((err) => {
          console.error("Autoplay failed:", err);
          // Fallback to muted if needed, though Plyr usually handles this
          playerRef.current.plyr.muted = true;
          playerRef.current.plyr.play();
        });
      } else {
        playerRef.current.plyr.pause();
      }
    }
  }, [isActive]);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  };

  const plyrProps = {
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
  };

  return (
    <div
      data-id={reel.id}
      className="reel-item relative h-screen w-full bg-black snap-start flex items-center justify-center overflow-hidden"
      onClick={handleDoubleTap}
    >
      <div className="w-full h-full max-w-[450px]">
        <Plyr ref={playerRef} {...plyrProps} />
      </div>

      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-in zoom-in-50 fade-in duration-300">
          <Heart
            size={100}
            fill="white"
            className="text-white drop-shadow-2xl scale-125"
          />
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

              if (href.startsWith("/u/") || href.startsWith("/explore")) {
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
        <div className="flex flex-col items-center gap-1">
          <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90">
            <Heart size={28} />
          </button>
          <span className="text-white text-xs font-bold">
            {reel.stats?.likes || 0}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90">
            <MessageCircle size={28} />
          </button>
          <span className="text-white text-xs font-bold">
            {reel.stats?.comments || 0}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button className="p-3 bg-zinc-800/50 rounded-full text-white backdrop-blur-md hover:bg-zinc-700 transition-colors active:scale-90">
            <Share2 size={28} />
          </button>
          <span className="text-white text-xs font-bold">
            {reel.stats?.shares || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReelItem;
