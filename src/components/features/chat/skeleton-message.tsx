import { Skeleton } from "@/components/ui/skeleton";

export default function MessageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="flex items-end gap-2 self-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 rounded-2xl rounded-bl-sm" />
          <Skeleton className="h-10 w-32 rounded-2xl rounded-bl-sm" />
        </div>
      </div>

      <div className="flex items-end gap-2 self-end">
        <div className="space-y-2 flex flex-col items-end">
          <Skeleton className="h-10 w-40 rounded-2xl rounded-br-sm" />
          <Skeleton className="h-24 w-64 rounded-2xl rounded-br-sm" />
        </div>
      </div>

      <div className="flex items-end gap-2 self-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-14 w-56 rounded-2xl rounded-bl-sm" />
      </div>
    </div>
  );
}
