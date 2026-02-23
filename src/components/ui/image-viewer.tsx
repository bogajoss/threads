import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
} from "lucide-react";
import type { Media } from "@/types";

interface ImageViewerProps {
  media?: (string | Media)[];
  currentIndex?: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";

import { Plyr } from "plyr-react";

const ImageViewer: React.FC<ImageViewerProps> = ({
  media,
  currentIndex = 0,
  onClose,
  onNavigate,
}) => {
  const [scale, setScale] = useState(1);
  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [-200, 0, 200], [0.5, 1, 0.5]);
  const viewScale = useTransform(dragY, [-200, 0, 200], [0.8, 1, 0.8]);

  const handleReset = () => setScale(1);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      handleReset();
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < (media?.length || 0) - 1) {
      handleReset();
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, media?.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, onClose, handlePrev, handleNext]);

  if (!media || media.length === 0) return null;

  const currentItem = media[currentIndex];
  const isVideo =
    typeof currentItem !== "string" && currentItem.type === "video";
  const currentUrl =
    typeof currentItem === "string" ? currentItem : currentItem.url;
  const hasMultiple = media.length > 1;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = currentUrl;
    link.download = `threads-${Date.now()}${isVideo ? ".mp4" : ".jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const plyrProps = {
    source: {
      type: "video" as const,
      sources: [{ src: currentUrl, type: "video/mp4" }],
      poster: (typeof currentItem !== "string" ? currentItem.poster : undefined) ?? undefined,
    },
    options: {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "fullscreen",
      ],
      settings: ["quality", "speed"],
      ratio: "16:9",
      autoplay: true,
      clickToPlay: true,
      hideControls: true,
      resetOnEnd: true,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md touch-none"
      onClick={onClose}
    >
      <motion.div
        style={{ opacity }}
        className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4"
      >
        <div className="flex flex-col text-white">
          <span className="text-lg font-bold drop-shadow-md">
            {hasMultiple
              ? `${currentIndex + 1} / ${media.length}`
              : isVideo
                ? "Video"
                : "Image"}
          </span>
        </div>

        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {!isVideo && (
            <button
              onClick={handleReset}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/10 active:scale-90"
            >
              <RotateCcw size={20} />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10 active:scale-90"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>
      </motion.div>

      <div className="relative flex h-full w-full items-center justify-center">
        {hasMultiple && currentIndex > 0 && scale === 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-6 z-10 hidden rounded-full bg-white/5 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90 md:flex"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <motion.div
          drag={scale === 1 ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.8}
          style={{ y: dragY, opacity, scale: viewScale }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 500) {
              onClose();
            }
          }}
          className="relative flex h-full w-full items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex h-full w-full items-center justify-center p-4"
              drag={scale === 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) handlePrev();
                else if (info.offset.x < -100) handleNext();
              }}
            >
              {isVideo ? (
                <div className="flex size-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <div className="relative w-full max-w-[95vw] max-h-[85vh] overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-sm border border-white/5">
                    <Plyr {...plyrProps} />
                  </div>
                </div>
              ) : (
                <motion.img
                  src={currentUrl}
                  animate={{ scale }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl pointer-events-none"
                  alt=""
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {hasMultiple && currentIndex < media.length - 1 && scale === 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 z-10 hidden rounded-full bg-white/5 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90 md:flex"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {hasMultiple && scale === 1 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="hide-scrollbar absolute bottom-8 flex max-w-[90%] gap-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl z-30"
            onClick={(e) => e.stopPropagation()}
          >
            {media.map((item, idx) => {
              const url = typeof item === "string" ? item : item.url;
              const thumb =
                typeof item !== "string" && item.poster ? item.poster : url;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    handleReset();
                    onNavigate(idx);
                  }}
                  className={`size-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all active:scale-90 ${idx === currentIndex
                    ? "scale-110 border-white shadow-lg shadow-white/20"
                    : "border-transparent opacity-40 hover:opacity-100"
                    }`}
                >
                  <img src={thumb} className="size-full object-cover" alt="" />
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageViewer;
