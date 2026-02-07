import { Skeleton } from "./skeleton";

export default function SkeletonPost() {
  return (
    <div className="flex items-start gap-x-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />

        {/* Optional media skeleton */}
        <Skeleton className="mt-2 h-64 w-full rounded-xl" />

        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-5 w-8 rounded-full" />
          <Skeleton className="h-5 w-8 rounded-full" />
          <Skeleton className="h-5 w-8 rounded-full" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
