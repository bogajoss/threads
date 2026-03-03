"use client";

import type {
  ComponentProps,
  HTMLAttributes,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { VideoJSPlayer } from "@/components/features/post";

export type StoriesProps = ComponentProps<typeof Carousel>;

export const Stories = ({ className, opts, ...props }: StoriesProps) => (
  <Carousel
    className={cn("w-full", className)}
    opts={{
      align: "start",
      loop: false,
      dragFree: true,
      ...opts,
    }}
    {...props}
  />
);

export type StoriesContentProps = ComponentProps<typeof CarouselContent>;

export const StoriesContent = ({
  className,
  ...props
}: StoriesContentProps) => (
  <CarouselContent className={cn("-ml-2 gap-2", className)} {...props} />
);

export type StoryProps = HTMLAttributes<HTMLDivElement>;

export const Story = ({ className, ...props }: StoryProps) => (
  <CarouselItem
    className={cn(
      "basis-0 pl-2 md:pl-4 min-w-[150px] sm:min-w-[180px]",
      className,
    )}
  >
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-muted/40",
        "cursor-pointer transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      role="button"
      tabIndex={0}
      {...props}
    />
  </CarouselItem>
);

interface StoryVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

export const StoryVideo = ({ src, poster, className }: StoryVideoProps) => {
  return (
    <div className={cn("absolute inset-0 size-full bg-zinc-900 overflow-hidden", className)}>
      <VideoJSPlayer
        src={src}
        poster={poster}
        autoplay={false}
        showControls={false}
        aspectRatio="9:16"
        muted={true}
        loop={true}
        fillContainer={true}
      />
    </div>
  );
};

export type StoryImageProps = ComponentProps<"img"> & {
  alt: string;
};

export const StoryImage = ({ className, alt, ...props }: StoryImageProps) => (
  <img
    alt={alt}
    className={cn(
      "absolute inset-0 h-full w-full object-cover",
      "transition-opacity duration-200",
      "group-hover:opacity-90",
      className,
    )}
    {...props}
  />
);

export type StoryAuthorProps = HTMLAttributes<HTMLDivElement>;

export const StoryAuthor = ({
  className,
  children,
  ...props
}: StoryAuthorProps) => (
  <div
    className={cn(
      "absolute right-0 bottom-0 left-0 z-10",
      "p-3 text-white",
      className,
    )}
    {...props}
  >
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

export type StoryAuthorImageProps = ComponentProps<typeof Avatar> & {
  src?: string;
  name?: string;
  fallback?: string;
};

export const StoryAuthorImage = ({
  src,
  fallback,
  name,
  className,
  ...props
}: StoryAuthorImageProps) => (
  <Avatar className={cn("size-6 border border-white/20", className)} {...props}>
    {src && <AvatarImage alt={name} src={src} />}
    <AvatarFallback className="bg-white/10 text-white text-xs">
      {fallback || name?.charAt(0)?.toUpperCase()}
    </AvatarFallback>
  </Avatar>
);

export type StoryAuthorNameProps = HTMLAttributes<HTMLSpanElement>;

export const StoryAuthorName = ({
  className,
  ...props
}: StoryAuthorNameProps) => (
  <span className={cn("truncate font-medium text-sm", className)} {...props} />
);

export type StoryTitleProps = HTMLAttributes<HTMLDivElement>;

export const StoryTitle = ({ className, ...props }: StoryTitleProps) => (
  <div
    className={cn(
      "absolute top-0 right-0 left-0 z-10",
      "p-3 text-white",
      className,
    )}
    {...props}
  />
);

export type StoryOverlayProps = HTMLAttributes<HTMLDivElement> & {
  side?: "top" | "bottom";
};

export const StoryOverlay = ({
  className,
  side = "bottom",
  ...props
}: StoryOverlayProps) => {
  const positionClasses =
    side === "top" ? "top-0 bg-gradient-to-b" : "bottom-0 bg-gradient-to-t";

  return (
    <div
      className={cn(
        "absolute right-0 left-0 h-10 from-black/20 to-transparent",
        positionClasses,
        className,
      )}
      {...props}
    />
  );
};
