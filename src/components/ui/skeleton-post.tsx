import { Skeleton } from "./skeleton";

export default function SkeletonPost() {
  return (
    <div className="flex items-start gap-x-3 border-b border-zinc-100 px-4 py-4 dark:border-zinc-800">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-4 w-24 rounded-sm" />
            <Skeleton className="h-4 w-12 rounded-sm" />
          </div>
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-[90%] rounded-sm" />
        </div>

        {/* Optional media skeleton - keeping it as it reduces layout shift for media posts */}
        <Skeleton className="mt-2 h-64 w-full rounded-xl" />

        <div className="mt-3 flex items-center gap-6">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="size-5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
