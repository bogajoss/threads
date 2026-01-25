import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

const ImageViewer = ({ images, currentIndex = 0, onClose, onNavigate }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState(null);
  const [initialDistance, setInitialDistance] = useState(null);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Handle Zoom
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      handleReset();
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < (images?.length || 0) - 1) {
      handleReset();
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, images?.length, onNavigate]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, onClose, handlePrev, handleNext]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  // Mouse Dragging (only when zoomed)
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Events for Swipe & Pinch
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() });
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
      }
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      if (isDragging && scale > 1) {
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        });
      }
    } else if (e.touches.length === 2 && initialDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.min(Math.max(scale * (distance / initialDistance), 1), 4);
      setScale(newScale);
      setInitialDistance(distance);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) setInitialDistance(null);
    setIsDragging(false);

    if (touchStart && scale === 1) {
      const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      const dx = touchEnd.x - touchStart.x;
      const dy = touchEnd.y - touchStart.y;
      const dt = Date.now() - touchStart.time;

      if (Math.abs(dx) > 50 && Math.abs(dy) < 50 && dt < 300) {
        if (dx > 0) handlePrev();
        else handleNext();
      }
    }
    setTouchStart(null);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `sysm-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden touch-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
    >
      {/* Header Toolbar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg drop-shadow-md">
            {hasMultiple ? `${currentIndex + 1} / ${images.length}` : "Image View"}
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-3" onClick={e => e.stopPropagation()}>
          <button onClick={handleZoomOut} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
            <ZoomOut size={20} />
          </button>
          <button onClick={handleZoomIn} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
            <ZoomIn size={20} />
          </button>
          <button onClick={handleReset} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
            <RotateCcw size={20} />
          </button>
          <button onClick={handleDownload} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
            <Download size={20} />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1 hidden sm:block" />
          <button onClick={onClose} className="text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full relative flex items-center justify-center">
        {hasMultiple && currentIndex > 0 && scale === 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-6 z-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-sm transition-all active:scale-90 hidden md:flex"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <div 
          className="relative transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
          onMouseDown={handleMouseDown}
          onClick={e => e.stopPropagation()}
        >
          <img
            ref={imageRef}
            src={currentImage}
            className="max-w-[95vw] max-h-[85vh] object-contain select-none shadow-2xl rounded-sm"
            alt=""
            draggable={false}
          />
        </div>

        {hasMultiple && currentIndex < images.length - 1 && scale === 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-6 z-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-sm transition-all active:scale-90 hidden md:flex"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>

      {/* Footer Info / Thumbnails */}
      {hasMultiple && (
        <div
          className="absolute bottom-8 flex gap-3 p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-x-auto max-w-[90%] hide-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { handleReset(); onNavigate(idx); }}
              className={`size-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                idx === currentIndex
                  ? "border-violet-500 scale-110 shadow-lg shadow-violet-500/20"
                  : "border-transparent opacity-40 hover:opacity-100"
              }`}
            >
              <img src={img} className="size-full object-cover" alt="" />
            </button>
          ))}
        </div>
      )}

      {/* Mobile Swipe Indicator (Only at scale 1) */}
      {scale === 1 && hasMultiple && (
        <div className="absolute bottom-4 text-white/30 text-[10px] uppercase tracking-widest font-bold md:hidden">
          Swipe to navigate
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
