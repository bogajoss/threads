import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
    onRefresh: () => Promise<void> | void;
    children: React.ReactNode;
    className?: string;
    pullThreshold?: number;
    maxPullDistance?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    className,
    pullThreshold = 80,
    maxPullDistance = 150,
}) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef<number>(0);
    const isPulling = useRef<boolean>(false);

    const handleTouchStart = (e: TouchEvent) => {
        // Only allow pull to refresh if we are at the top of the container
        const isAtTop = window.scrollY === 0;
        if (!isAtTop || isRefreshing) return;

        startY.current = e.touches[0].pageY;
        isPulling.current = true;
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isPulling.current || isRefreshing) return;

        const currentY = e.touches[0].pageY;
        const diff = currentY - startY.current;

        if (diff > 0) {
            // Resistance factor to make pulling feel more natural
            const resistance = 0.5;
            const newDistance = Math.min(diff * resistance, maxPullDistance);
            setPullDistance(newDistance);

            // Prevent default scrolling if we are pulling down
            if (diff > 10 && e.cancelable) {
                e.preventDefault();
            }
        } else {
            setPullDistance(0);
            isPulling.current = false;
        }
    }, [isRefreshing, maxPullDistance]);

    const handleTouchEnd = async () => {
        if (!isPulling.current || isRefreshing) return;

        isPulling.current = false;

        if (pullDistance >= pullThreshold) {
            setIsRefreshing(true);
            setPullDistance(pullThreshold);

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

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("touchend", handleTouchEnd);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleTouchMove, handleTouchEnd, pullDistance, pullThreshold]);

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <div
                className="absolute left-0 right-0 flex justify-center overflow-hidden"
                style={{
                    height: pullDistance,
                    top: 0,
                    zIndex: 40,
                }}
            >
                <div
                    className="flex items-center justify-center py-4"
                    style={{ opacity: Math.min(pullDistance / pullThreshold, 1) }}
                >
                    {isRefreshing ? (
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                    ) : (
                        <motion.div
                            animate={{ rotate: (pullDistance / pullThreshold) * 180 }}
                            className="text-zinc-400"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 5v14M19 12l-7 7-7-7" />
                            </svg>
                        </motion.div>
                    )}
                </div>
            </div>

            <motion.div
                animate={{ y: pullDistance }}
                transition={isRefreshing ? { type: "spring", stiffness: 300, damping: 30 } : { type: "tween", duration: 0 }}
                className="relative bg-background"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default PullToRefresh;
