import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonComment() {
  return (
    <div className="flex gap-3 px-4 py-2">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-3/4 rounded" />
      </div>
    </div>
  );
}
