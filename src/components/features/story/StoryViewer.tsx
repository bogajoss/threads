import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { incrementStoryViews } from "@/lib/api/stories";

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

import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";

const StoryViewer: React.FC<StoryViewerProps> = ({
  story: storyGroup,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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

  const stories = storyGroup.stories;
  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (currentStory && !seenInSession.has(currentStory.id)) {
      seenInSession.add(currentStory.id);

      // Optimistic increment
      setViewCounts((prev) => ({
        ...prev,
        [currentStory.id]: (prev[currentStory.id] || 0) + 1,
      }));

      incrementStoryViews(currentStory.id).then((newCount) => {
        if (newCount !== null) {
          setViewCounts((prev) => ({
            ...prev,
            [currentStory.id]: newCount,
          }));
        }
      });
    }
  }, [currentStory?.id, seenInSession]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose(storyGroup.user.id);
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
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [handleNext, currentIndex, isPaused]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onClose(storyGroup.user.id)}
      className="fixed inset-0 z-[9999] bg-black/90"
    >
      <div className="absolute left-0 right-0 top-0 z-[110] flex flex-col gap-4 p-4 pointer-events-none">
        <div className="flex h-0.5 w-full gap-1.5 bg-transparent">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className="h-full flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width:
                    idx < currentIndex
                      ? "100%"
                      : idx === currentIndex
                        ? `${progress}%`
                        : "0%",
                }}
              ></div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pointer-events-auto">
          <Link
            to={`/u/${storyGroup.user.handle}`}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="size-10 border border-white/20 shadow-sm">
              <AvatarImage
                src={storyGroup.user.avatar}
                alt={storyGroup.user.handle}
                className="object-cover"
              />
              <AvatarFallback>
                {storyGroup.user.handle?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-white">
              <span className="text-sm font-bold shadow-black drop-shadow-md">
                {storyGroup.user.handle}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-white/60 shadow-black drop-shadow-md">
                <span>
                  {new Date(currentStory.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {viewCounts[currentStory.id] !== undefined && (
                  <>
                    <span>•</span>
                    <span>{viewCounts[currentStory.id]} views</span>
                  </>
                )}
              </div>
            </div>
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(storyGroup.user.id);
            }}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.8 }}
        style={{ y: dragY, opacity, scale }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose(storyGroup.user.id);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-xl items-center justify-center p-2 touch-none"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex h-full w-full items-center justify-center"
          >
            <img
              src={currentStory.media}
              className="h-full max-h-full w-full object-contain rounded-xl shadow-2xl"
              alt=""
            />
            {currentStory.content && (
              <div className="absolute bottom-16 left-0 right-0 px-8 pb-4 z-30">
                <div className="bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-lg">
                  <p className="text-white text-sm font-medium leading-relaxed drop-shadow-sm text-center">
                    {currentStory.content}
                  </p>
                </div>
              </div>
            )}
            {isPaused && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold text-white backdrop-blur-md"
                >
                  PAUSED
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex">
          <div className="w-[30%] cursor-w-resize" onClick={handlePrev}></div>
          <div
            className="flex w-[40%] cursor-pointer items-center justify-center"
            onClick={togglePause}
          ></div>
          <div className="w-[30%] cursor-e-resize" onClick={handleNext}></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoryViewer;
