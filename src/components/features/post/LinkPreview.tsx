import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Globe } from "lucide-react";
import { getCachedLinkPreview } from "@/lib/api";

interface LinkPreviewProps {
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["link-preview", url],
    queryFn: () => getCachedLinkPreview(url),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours in memory too
    enabled: !!url,
  });

  if (isLoading) {
    return (
      <div className="mt-3 flex h-24 animate-pulse items-center justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <Globe
          className="animate-spin text-zinc-300 dark:text-zinc-700"
          size={24}
        />
      </div>
    );
  }

  if (isError || !data || (!data.title && !data.image)) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-3 flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      onClick={(e) => e.stopPropagation()}
    >
      {data.image && (
        <div className="aspect-[1.91/1] w-full overflow-hidden border-b border-zinc-100 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          <img
            src={data.image}
            alt={data.title ?? undefined}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            onError={(e) => ((e.target as HTMLElement).style.display = "none")}
          />
        </div>
      )}
      <div className="space-y-1 p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600">
          <Globe size={12} />
          <span>{data.siteName}</span>
        </div>
        <div className="line-clamp-2 text-[15px] font-bold leading-snug transition-colors group-hover:text-violet-700 dark:text-white">
          {data.title}
        </div>
        {data.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {data.description}
          </p>
        )}
        <div className="flex items-center gap-1 pt-1 text-[11px] font-medium text-zinc-500">
          <ExternalLink size={10} />
          <span className="truncate">{url}</span>
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
