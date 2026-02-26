import React, { useState } from "react";
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
      className="group relative size-full overflow-hidden"
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      )}
      <motion.img
        src={item.url || (item as any).src}
        initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
        animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="size-full object-cover"
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
    </motion.div>
  );
};

import { Play } from "lucide-react";

const VideoPreview = ({
  item,
  onClick,
}: {
  item: Media;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className="group relative size-full overflow-hidden"
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      )}
      {item.poster && (
        <motion.img
          src={item.poster}
          initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="size-full object-cover"
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
      {!item.poster && (
        <div className="flex size-full items-center justify-center bg-zinc-100 dark:bg-zinc-900" onMouseEnter={() => setLoaded(true)}>
          <div className="size-full bg-zinc-800/20" />
        </div>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/30 transition-all group-hover:bg-white/25 group-hover:scale-110 group-active:scale-95 shadow-2xl">
          <Play className="ml-1 size-7 text-white fill-white drop-shadow-xl" strokeWidth={0} />
        </div>
      </div>

      {/* Duration Badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-black/40 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/10 shadow-lg">
          <Play className="size-2.5 fill-white" strokeWidth={0} />
          <span className="tabular-nums tracking-wider">{item.duration || "0:00"}</span>
        </div>
      </div>
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

  const handleMediaClick = (idx: number) => {
    openLightbox(media, idx);
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
              className={`relative cursor-pointer overflow-hidden bg-zinc-100 dark:bg-zinc-900 group ${media.length === 3 && idx === 0 ? "row-span-2" : ""
                }`}
            >
              {item.type === "video" ? (
                <VideoPreview
                  item={item}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMediaClick(idx);
                  }}
                />
              ) : (
                <GridImage
                  item={item}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMediaClick(idx);
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
