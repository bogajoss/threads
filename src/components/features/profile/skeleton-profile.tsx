import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 dark:border-zinc-800">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-20 w-20 rounded-full" />
            </div>

            <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-full max-w-sm rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            <div className="mt-6 flex gap-8 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
            </div>
        </div>
    );
}
