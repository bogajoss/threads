import React, { useState, useEffect, useRef, useCallback } from "react"
import {
    X,
    ChevronLeft,
    ChevronRight,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCcw,
} from "lucide-react"

interface ImageViewerProps {
    images?: string[]
    currentIndex?: number
    onClose: () => void
    onNavigate: (index: number) => void
}

const ImageViewer: React.FC<ImageViewerProps> = ({
    images,
    currentIndex = 0,
    onClose,
    onNavigate,
}) => {
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [touchStart, setTouchStart] = useState<{
        x: number
        y: number
        time: number
    } | null>(null)
    const [initialDistance, setInitialDistance] = useState<number | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    // Handle Zoom
    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4))
    const handleZoomOut = () => {
        setScale((prev) => {
            const newScale = Math.max(prev - 0.5, 1)
            if (newScale === 1) setPosition({ x: 0, y: 0 })
            return newScale
        })
    }
    const handleReset = () => {
        setScale(1)
        setPosition({ x: 0, y: 0 })
    }

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            handleReset()
            onNavigate(currentIndex - 1)
        }
    }, [currentIndex, onNavigate])

    const handleNext = useCallback(() => {
        if (currentIndex < (images?.length || 0) - 1) {
            handleReset()
            onNavigate(currentIndex + 1)
        }
    }, [currentIndex, images?.length, onNavigate])

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowLeft") handlePrev()
            if (e.key === "ArrowRight") handleNext()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [currentIndex, onClose, handlePrev, handleNext])

    if (!images || images.length === 0) return null

    const currentImage = images[currentIndex]
    const hasMultiple = images.length > 1

    // Mouse Dragging (only when zoomed)
    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true)
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            })
        }
    }

    const handleMouseUp = () => setIsDragging(false)

    // Touch Events for Swipe & Pinch
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setTouchStart({
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                time: Date.now(),
            })
            if (scale > 1) {
                setIsDragging(true)
                setDragStart({
                    x: e.touches[0].clientX - position.x,
                    y: e.touches[0].clientY - position.y,
                })
            }
        } else if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            )
            setInitialDistance(distance)
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            if (isDragging && scale > 1) {
                setPosition({
                    x: e.touches[0].clientX - dragStart.x,
                    y: e.touches[0].clientY - dragStart.y,
                })
            }
        } else if (e.touches.length === 2 && initialDistance) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            )
            const newScale = Math.min(
                Math.max(scale * (distance / initialDistance), 1),
                4
            )
            setScale(newScale)
            setInitialDistance(distance)
        }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.touches.length < 2) setInitialDistance(null)
        setIsDragging(false)

        if (touchStart && scale === 1) {
            const touchEnd = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
            }
            const dx = touchEnd.x - touchStart.x
            const dy = touchEnd.y - touchStart.y
            const dt = Date.now() - touchStart.time

            if (Math.abs(dx) > 50 && Math.abs(dy) < 50 && dt < 300) {
                if (dx > 0) handlePrev()
                else handleNext()
            }
        }
        setTouchStart(null)
    }

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation()
        const link = document.createElement("a")
        link.href = currentImage
        link.download = `sysm-${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex touch-none flex-col items-center justify-center overflow-hidden bg-black/95 backdrop-blur-md"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={onClose}
        >
            {/* Header Toolbar */}
            <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4">
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-white drop-shadow-md">
                        {hasMultiple
                            ? `${currentIndex + 1} / ${images.length}`
                            : "Image View"}
                    </span>
                </div>

                <div
                    className="flex items-center gap-1 sm:gap-3"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleZoomOut}
                        className="hidden rounded-full p-2 text-white transition-colors hover:bg-white/10 sm:block"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <button
                        onClick={handleZoomIn}
                        className="hidden rounded-full p-2 text-white transition-colors hover:bg-white/10 sm:block"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button
                        onClick={handleReset}
                        className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                    >
                        <RotateCcw size={20} />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                    >
                        <Download size={20} />
                    </button>
                    <div className="mx-1 hidden h-6 w-px bg-white/20 sm:block" />
                    <button
                        onClick={onClose}
                        className="rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative flex h-full w-full items-center justify-center">
                {hasMultiple && currentIndex > 0 && scale === 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handlePrev()
                        }}
                        className="absolute left-6 z-10 hidden rounded-full bg-white/5 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90 md:flex"
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}

                <div
                    className="relative cursor-grab transition-transform duration-200 ease-out active:cursor-grabbing"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    }}
                    onMouseDown={handleMouseDown}
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        ref={imageRef}
                        src={currentImage}
                        className="max-h-[85vh] max-w-[95vw] select-none rounded-sm object-contain shadow-2xl"
                        alt=""
                        draggable={false}
                    />
                </div>

                {hasMultiple && currentIndex < images.length - 1 && scale === 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNext()
                        }}
                        className="absolute right-6 z-10 hidden rounded-full bg-white/5 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90 md:flex"
                    >
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>

            {/* Footer Info / Thumbnails */}
            {hasMultiple && (
                <div
                    className="hide-scrollbar absolute bottom-8 flex max-w-[90%] gap-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                handleReset()
                                onNavigate(idx)
                            }}
                            className={`size-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${idx === currentIndex
                                    ? "scale-110 border-violet-500 shadow-lg shadow-violet-500/20"
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
                <div className="absolute bottom-4 text-[10px] font-bold uppercase tracking-widest text-white/30 md:hidden">
                    Swipe to navigate
                </div>
            )}
        </div>
    )
}

export default ImageViewer
