import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Volume2, VolumeX } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { incrementStoryViews } from "@/lib/api/stories";
import { shouldIncrementView } from "@/lib/utils";
import { VideoJSPlayer } from "@/components/features/post";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";

interface Story {
  id: string;
  media: string;
  content?: string;
  created_at: string;
  views_count?: number;
}

interface StoryGroup {
  user: {
    id: string;
    handle: string;
    avatar: string;
  };
  stories: Story[];
}

interface StoryViewerProps {
  story: StoryGroup;
  onClose: (storyId?: string) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  story: storyGroup,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("story-muted");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("story-muted", JSON.stringify(isMuted));
  }, [isMuted]);

  const [viewCounts, setViewCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    storyGroup.stories.forEach((s) => {
      initial[s.id] = s.views_count || 0;
    });
    return initial;
  });
  const [seenInSession] = useState(new Set<string>());

  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [0, 200], [1, 0.5]);
  const scale = useTransform(dragY, [0, 200], [1, 0.9]);

  const [videoDuration, setVideoDuration] = useState(5000);
  const playerRef = useRef<any>(null);

  const stories = storyGroup.stories;
  const currentStory = stories[currentIndex];
  const isVideo = currentStory.media.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || currentStory.media.includes("video");

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      setTimeout(() => onClose(storyGroup.user.id), 0);
    }
  }, [currentIndex, stories.length, onClose, storyGroup.user.id]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const togglePause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused((prev) => !prev);
    if (playerRef.current) {
      if (!isPaused) playerRef.current.pause();
      else playerRef.current.play()?.catch(() => {});
    }
  }, [isPaused]);

  useEffect(() => {
    if (isPaused) return;
    const step = 50;
    const increment = (step / videoDuration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 100;
        }
        return prev + increment;
      });
    }, step);
    return () => clearInterval(timer);
  }, [handleNext, currentIndex, isPaused, videoDuration]);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    player.on('loadedmetadata', () => {
      const duration = player.duration() * 1000;
      if (duration > 0) setVideoDuration(duration);
    });
    player.muted(isMuted);
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.muted(isMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    if (currentStory && !seenInSession.has(currentStory.id)) {
      seenInSession.add(currentStory.id);
      const timeout = setTimeout(() => {
        if (shouldIncrementView(currentStory.id, 'story')) {
          setViewCounts((prev) => ({ ...prev, [currentStory.id]: (prev[currentStory.id] || 0) + 1 }));
          incrementStoryViews(currentStory.id).then((newCount) => {
            if (newCount !== null) setViewCounts((prev) => ({ ...prev, [currentStory.id]: newCount }));
          });
        }
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [currentStory?.id, seenInSession]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setTimeout(() => onClose(storyGroup.user.id), 0)}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md"
    >
      <div className="absolute left-0 right-0 top-0 z-[110] flex flex-col gap-4 p-4 pointer-events-none">
        <div className="flex h-0.5 w-full gap-1.5 bg-transparent">
          {stories.map((_, idx) => (
            <div key={idx} className="h-full flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%" }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pointer-events-auto">
          <Link to={`/u/${storyGroup.user.handle}`} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Avatar className="size-10 border border-white/20">
              <AvatarImage src={storyGroup.user.avatar} alt="" className="object-cover" />
              <AvatarFallback>{storyGroup.user.handle?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-white">
              <span className="text-sm font-bold drop-shadow-md">@{storyGroup.user.handle}</span>
              <span className="text-[10px] text-white/60">{viewCounts[currentStory.id]} views</span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            {isVideo && (
              <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="rounded-full p-2 text-white hover:bg-white/10">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); setTimeout(() => onClose(storyGroup.user.id), 0); }} className="rounded-full p-2 text-white hover:bg-white/10">
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        style={{ y: dragY, opacity, scale }}
        onDragEnd={(_, info) => { if (info.offset.y > 100) setTimeout(() => onClose(storyGroup.user.id), 0); }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-lg items-center justify-center p-4 touch-none mx-auto"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative flex aspect-[9/16] w-full max-h-[85vh] items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl"
          >
            {isVideo ? (
              <VideoJSPlayer
                src={currentStory.media}
                autoplay={!isPaused}
                showControls={false}
                aspectRatio="9:16"
                className="h-full w-full object-contain"
                onReady={handlePlayerReady}
                muted={isMuted}
                loop={false}
              />
            ) : (
              <img 
                src={currentStory.media} 
                className="h-full w-full object-contain" 
                alt="" 
              />
            )}
            {currentStory.content && (
              <div className="absolute bottom-10 left-0 right-0 px-6 z-30">
                <div className="bg-black/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center">
                  <p className="text-white text-sm font-medium leading-relaxed">{currentStory.content}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex">
          <div className="w-[30%] cursor-w-resize" onClick={handlePrev} />
          <div className="flex w-[40%] cursor-pointer" onClick={togglePause} />
          <div className="w-[30%] cursor-e-resize" onClick={handleNext} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoryViewer;
