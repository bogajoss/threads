import React from "react"
import VideoPlayer from "@/components/features/post/VideoPlayer"
import FileCard from "@/components/features/post/FileCard"
import { useLightbox } from "@/context/LightboxContext"
import type { Media } from "@/types"

interface MediaGridProps {
    items?: Media[] | Media
}

const MediaGrid: React.FC<MediaGridProps> = ({ items = [] }) => {
    const { openLightbox } = useLightbox()

    if (!items || (Array.isArray(items) && items.length === 0)) return null

    // items can be a single object from old schema or array from new
    const normalizedItems = Array.isArray(items) ? items : [items]
    const media = normalizedItems.filter(
        (i) => i.type === "image" || i.type === "video"
    )
    const files = normalizedItems.filter((i) => i.type === "file")

    const handleImageClick = (idx: number) => {
        const imageUrls = media
            .filter((item) => item.type === "image")
            .map((item) => item.url || (item as any).src) // Support legacy src if needed

        // Find the index of the clicked image in the imageUrls array
        const clickedItem = media[idx]
        const imageIndex = imageUrls.indexOf(
            clickedItem.url || (clickedItem as any).src
        )

        openLightbox(imageUrls, imageIndex)
    }

    return (
        <div className="mt-3 space-y-2">
            {media.length > 0 && (
                <div
                    className={`grid gap-2 overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 ${media.length === 1
                            ? "grid-cols-1"
                            : media.length === 2
                                ? "aspect-[16/9] grid-cols-2"
                                : media.length === 3
                                    ? "aspect-[16/9] grid-cols-2 grid-rows-2"
                                    : "aspect-[16/9] grid-cols-2 grid-rows-2"
                        }`}
                >
                    {media.map((item, idx) => (
                        <div
                            key={idx}
                            className={`relative cursor-pointer overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${media.length === 3 && idx === 0 ? "row-span-2" : ""}
                                `}
                            onClick={(e) => {
                                if (item.type === "image") {
                                    e.stopPropagation()
                                    handleImageClick(idx)
                                }
                            }}
                        >
                            {item.type === "video" ? (
                                <VideoPlayer src={item.url} poster={item.poster || undefined} />
                            ) : (

                                <img
                                    src={item.url || (item as any).src}
                                    className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                    alt=""
                                    loading="lazy"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {files.map((file, idx) => (
                <FileCard key={idx} file={file} />
            ))}
        </div>
    )
}

export default MediaGrid
