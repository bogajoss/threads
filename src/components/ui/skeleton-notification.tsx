import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonNotification() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white dark:ring-black" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/4 rounded" />
      </div>
    </div>
  );
}
