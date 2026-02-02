import React, { useState, useCallback, useEffect, useRef } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import { Loader2, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
    onRefresh: () => Promise<any>
    children: React.ReactNode
    className?: string
    disabled?: boolean
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    className,
    disabled = false
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [pullDistance, setPullDistance] = useState(0)
    const [canPull, setCanPull] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const controls = useAnimation()
    
    const THRESHOLD = 70
    const MAX_PULL = 120

    // Check if we are at the top of the scrollable element
    const checkScrollTop = useCallback(() => {
        if (!containerRef.current) return
        
        // If it's the window scroll
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        
        // Or if the container itself is scrollable (like in Messages)
        const elementScrollTop = containerRef.current.scrollTop
        
        setCanPull(scrollTop <= 0 && elementScrollTop <= 0)
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', checkScrollTop, { passive: true })
        return () => window.removeEventListener('scroll', checkScrollTop)
    }, [checkScrollTop])

    const handleDrag = useCallback((_: any, info: PanInfo) => {
        if (disabled || isRefreshing || !canPull) return
        
        // Only allow pulling down when at the top
        if (info.offset.y > 0) {
            // Resistance formula
            const distance = Math.min(info.offset.y * 0.4, MAX_PULL)
            setPullDistance(distance)
        } else {
            setPullDistance(0)
        }
    }, [disabled, isRefreshing, canPull])

    const handleDragEnd = useCallback(async (_: any, info: PanInfo) => {
        if (disabled || isRefreshing || !canPull) return

        if (info.offset.y * 0.4 >= THRESHOLD) {
            setIsRefreshing(true)
            setPullDistance(THRESHOLD)
            
            try {
                await onRefresh()
            } catch (error) {
                console.error("Refresh failed:", error)
            } finally {
                setIsRefreshing(false)
                setPullDistance(0)
                controls.start({ y: 0 })
            }
        } else {
            setPullDistance(0)
            controls.start({ y: 0 })
        }
    }, [disabled, isRefreshing, onRefresh, controls, canPull])

    return (
        <div 
            ref={containerRef}
            onScroll={checkScrollTop}
            className={cn("relative w-full h-full", className)}
        >
            {/* Refresh Indicator Area */}
            <div 
                className="absolute top-0 left-0 right-0 flex justify-center items-center overflow-hidden pointer-events-none z-[60]"
                style={{ height: Math.max(pullDistance, isRefreshing ? THRESHOLD : 0) }}
            >
                <div className="flex flex-col items-center gap-1.5 transition-opacity duration-200 py-2">
                    <div className={cn(
                        "flex items-center justify-center size-9 rounded-full bg-white dark:bg-zinc-800 shadow-xl border border-zinc-100 dark:border-zinc-700 transition-transform duration-200",
                        pullDistance >= THRESHOLD && !isRefreshing ? "scale-110" : "scale-100"
                    )}>
                        {isRefreshing ? (
                            <Loader2 className="size-5 text-violet-600 animate-spin" />
                        ) : (
                            <ArrowDown 
                                className={cn(
                                    "size-5 text-zinc-400 transition-transform duration-300",
                                    pullDistance >= THRESHOLD ? "rotate-180 text-violet-600" : "rotate-0"
                                )} 
                                style={{ 
                                    opacity: Math.max(0.3, pullDistance / THRESHOLD),
                                    transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)` 
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <motion.div
                drag={canPull && !isRefreshing ? "y" : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ y: isRefreshing ? THRESHOLD : pullDistance }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </div>
    )
}

export default PullToRefresh