import { cn } from "@/lib/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse animate-in fade-in duration-500 rounded-md bg-zinc-200 dark:bg-zinc-800", className)}
            {...props}
        />
    );
}

export { Skeleton };
