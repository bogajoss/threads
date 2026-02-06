import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Story {
  id: string;
  media: string;
  created_at: string;
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

  const stories = storyGroup.stories;
  const currentStory = stories[currentIndex];

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
    <div className="fixed inset-0 z-[100] flex animate-in fade-in flex-col items-center justify-center bg-black duration-300">
      <div className="absolute left-0 right-0 top-0 z-20 flex flex-col gap-4 p-4">
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

        <div className="flex items-center justify-between">
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
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white shadow-black drop-shadow-md">
                {storyGroup.user.handle}
              </span>
              <span className="text-[10px] text-white/60 shadow-black drop-shadow-md">
                {new Date(currentStory.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </Link>
          <button
            onClick={() => onClose(storyGroup.user.id)}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="relative flex h-full w-full max-w-xl items-center justify-center p-2">
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 z-30 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <div className="relative flex h-full w-full items-center justify-center">
          <img
            key={currentStory.id}
            src={currentStory.media}
            className="h-full max-h-full w-full animate-in fade-in zoom-in-95 object-contain rounded-xl shadow-2xl duration-300"
            alt=""
          />
          {isPaused && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div className="animate-in fade-in zoom-in rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold text-white backdrop-blur-md duration-200">
                PAUSED
              </div>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 z-30 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
        >
          <ChevronRight size={32} />
        </button>

        <div className="absolute inset-0 z-20 flex">
          <div className="w-[30%] cursor-w-resize" onClick={handlePrev}></div>
          <div
            className="flex w-[40%] cursor-pointer items-center justify-center"
            onClick={togglePause}
          ></div>
          <div className="w-[30%] cursor-e-resize" onClick={handleNext}></div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;