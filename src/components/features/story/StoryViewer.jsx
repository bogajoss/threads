import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const StoryViewer = ({ story: storyGroup, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const stories = storyGroup.stories;
  const currentStory = stories[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds per story
    return () => clearInterval(timer);
  }, [handleNext, currentIndex]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex flex-col gap-4">
        {/* Progress Bars */}
        <div className="flex gap-1.5 h-0.5 w-full bg-transparent">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-full bg-white/30 rounded-full overflow-hidden"
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
          <div className="flex items-center gap-3">
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
              <span className="text-white text-sm font-bold shadow-black drop-shadow-md">
                {storyGroup.user.handle}
              </span>
              <span className="text-white/60 text-[10px] shadow-black drop-shadow-md">
                {new Date(currentStory.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="w-full h-full max-w-xl relative flex items-center justify-center p-2">
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 z-30 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all active:scale-90"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <div className="relative w-full h-full flex items-center justify-center">
          <img
            key={currentStory.id}
            src={currentStory.media}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            alt=""
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 z-30 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all active:scale-90"
        >
          <ChevronRight size={32} />
        </button>

        {/* Click zones for navigation */}
        <div className="absolute inset-0 flex z-20">
          <div className="flex-1 cursor-w-resize" onClick={handlePrev}></div>
          <div className="flex-1 cursor-e-resize" onClick={handleNext}></div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
