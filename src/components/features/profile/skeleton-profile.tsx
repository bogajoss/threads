import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Cover Image Skeleton */}
      <div className="relative h-32 w-full bg-zinc-200 dark:bg-zinc-800 sm:h-48">
        <Skeleton className="h-full w-full" />
        <div className="absolute -bottom-12 left-4 sm:-bottom-16 sm:left-6">
          <div className="relative rounded-full bg-white p-1 shadow-xl ring-4 ring-white dark:bg-black dark:ring-black">
            <Skeleton className="size-24 rounded-full sm:size-32" />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 p-4 pt-16 sm:p-6 sm:pt-20">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 pr-4"></div>
          {/* Action Buttons Skeleton */}
          <div className="flex shrink-0 gap-2">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          {/* Name & Badge */}
          <div className="mt-1 flex items-center gap-1.5">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="size-5 rounded-full" />
          </div>
          {/* Handle */}
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        {/* Bio */}
        <div className="space-y-1 pt-1">
          <Skeleton className="h-4 w-full max-w-md rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>

        {/* Location/Link */}
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        {/* Stats */}
        <div className="flex gap-6 pt-2">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
