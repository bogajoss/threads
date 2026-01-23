import React from "react";

const SkeletonPost = () => (
  <div className="px-5 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 animate-pulse">
    <div className="flex items-start gap-x-3">
      <div className="size-11 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
        </div>
        <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full" />
      </div>
    </div>
  </div>
);

export default SkeletonPost;
