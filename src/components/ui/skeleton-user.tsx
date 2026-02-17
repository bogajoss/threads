import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonUser() {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800">
      <div className="flex flex-1 items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
      <Skeleton className="h-9 w-24 rounded-full" />
    </div>
  );
}
