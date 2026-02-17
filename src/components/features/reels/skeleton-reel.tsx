import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonReel() {
  return (
    <div className="relative h-[100dvh] w-full bg-zinc-900 border-zinc-800 md:rounded-xl md:border overflow-hidden">
      <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="absolute bottom-4 left-4 right-16 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}
