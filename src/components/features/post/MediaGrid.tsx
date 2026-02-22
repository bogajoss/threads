import React, { Suspense, useState } from "react";
const VideoPlayer = React.lazy(
  () => import("@/components/features/post/VideoPlayer"),
);
import FileCard from "@/components/features/post/FileCard";
import { useLightbox } from "@/context/LightboxContext";
import type { Media } from "@/types";

interface MediaGridProps {
  items?: Media[] | Media;
}

import { motion } from "motion/react";

const GridImage = ({
  item,
  onClick,
}: {
  item: Media;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative size-full overflow-hidden"
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      )}
      <motion.img
        src={item.url || (item as any).src}
        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="size-full object-cover"
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </motion.div>
  );
};

const MediaGrid: React.FC<MediaGridProps> = ({ items = [] }) => {
  const { openLightbox } = useLightbox();

  if (!items || (Array.isArray(items) && items.length === 0)) return null;

  const normalizedItems = Array.isArray(items) ? items : [items];
  const media = normalizedItems.filter(
    (i) => i.type === "image" || i.type === "video",
  );
  const files = normalizedItems.filter((i) => i.type === "file");
  const hasVideo = media.some((i) => i.type === "video");

  const handleImageClick = (idx: number) => {
    const imageUrls = media
      .filter((item) => item.type === "image")
      .map((item) => item.url || (item as any).src);

    const clickedItem = media[idx];
    const imageIndex = imageUrls.indexOf(
      clickedItem.url || (clickedItem as any).src,
    );

    openLightbox(imageUrls, imageIndex);
  };

  return (
    <div className="mt-2 space-y-2">
      {media.length > 0 && (
        <div
          className={`grid gap-2 overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 ${media.length === 1
              ? "grid-cols-1"
              : media.length === 2
                ? hasVideo
                  ? "aspect-[8/9] grid-cols-1 grid-rows-2"
                  : "aspect-[16/9] grid-cols-2"
                : media.length === 3
                  ? "aspect-[16/9] grid-cols-2 grid-rows-2"
                  : "aspect-[16/9] grid-cols-2 grid-rows-2"
            }`}
        >
          {media.map((item, idx) => (
            <div
              key={idx}
              className={`relative cursor-pointer overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${media.length === 3 && idx === 0 ? "row-span-2" : ""
                }`}
            >
              {item.type === "video" ? (
                <Suspense
                  fallback={
                    <div className="flex aspect-video w-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                      <div className="size-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                    </div>
                  }
                >
                  <VideoPlayer
                    src={item.url}
                    poster={item.poster || undefined}
                  />
                </Suspense>
              ) : (
                <GridImage
                  item={item}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(idx);
                  }}
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
  );
};

export default MediaGrid;
