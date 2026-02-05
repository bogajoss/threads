import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<any>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className,
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const THRESHOLD = 70;
  const MAX_PULL = 120;

  // Find the actual scrollable element
  const getScrollableElement = useCallback(() => {
    if (!containerRef.current) return null;
    // 1. Radix ScrollArea
    const radixViewport = containerRef.current.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (radixViewport) return radixViewport;

    // 2. Standard overflow auto
    const overflowAuto = containerRef.current.querySelector(".overflow-y-auto");
    if (overflowAuto) return overflowAuto;

    // 3. Fallback: Check direct children for scrolling
    const children = containerRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      if (
        window.getComputedStyle(child).overflowY === "auto" ||
        window.getComputedStyle(child).overflowY === "scroll"
      ) {
        return child;
      }
    }

    return containerRef.current; // Worst case, assume container itself
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (disabled || isRefreshing) return;
      const scrollable = getScrollableElement();
      if (!scrollable) return;

      // Only start if we are at the top
      if (scrollable.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = false;
      } else {
        startY.current = -1; // Invalid start
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === -1 || disabled || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const delta = currentY - startY.current;

      // If pulling down
      if (delta > 0) {
        // Check scrollTop again to be sure
        const scrollable = getScrollableElement();
        if (scrollable && scrollable.scrollTop <= 0) {
          // Prevent default only if we are significantly pulling,
          // otherwise it might feel like we blocked a slight scroll up gesture
          if (e.cancelable) {
            e.preventDefault(); // Stop native scroll/refresh
          }

          isPulling.current = true;
          // Logarithmic resistance
          const distance = Math.min(delta * 0.4, MAX_PULL);
          setPullDistance(distance);
        }
      } else {
        // Moving up (scrolling down content) - let it happen
        isPulling.current = false;
        setPullDistance(0);
        startY.current = -1; // Reset to avoid jitter
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current || disabled || isRefreshing) {
        setPullDistance(0);
        return;
      }

      isPulling.current = false;

      if (pullDistance >= THRESHOLD) {
        setIsRefreshing(true);
        setPullDistance(THRESHOLD); // Snap to threshold

        try {
          await onRefresh();
        } catch (error) {
          console.error("Refresh failed:", error);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    }); // non-passive to allow preventDefault
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [
    disabled,
    isRefreshing,
    onRefresh,
    getScrollableElement,
    pullDistance,
    THRESHOLD,
    MAX_PULL,
  ]);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      {/* Refresh Indicator Area */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center items-center overflow-hidden pointer-events-none z-[60]"
        style={{ height: Math.max(pullDistance, isRefreshing ? THRESHOLD : 0) }}
      >
        <div className="flex flex-col items-center gap-1.5 transition-opacity duration-200 py-2">
          <div
            className={cn(
              "flex items-center justify-center size-9 rounded-full bg-white dark:bg-zinc-800 shadow-xl border border-zinc-100 dark:border-zinc-700 transition-transform duration-200",
              pullDistance >= THRESHOLD && !isRefreshing
                ? "scale-110"
                : "scale-100",
            )}
          >
            {isRefreshing ? (
              <Loader2 className="size-5 text-violet-600 animate-spin" />
            ) : (
              <ArrowDown
                className={cn(
                  "size-5 text-zinc-400 transition-transform duration-300",
                  pullDistance >= THRESHOLD
                    ? "rotate-180 text-violet-600"
                    : "rotate-0",
                )}
                style={{
                  opacity: Math.max(0.3, pullDistance / THRESHOLD),
                  transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)`,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        animate={{ y: isRefreshing ? THRESHOLD : pullDistance }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
