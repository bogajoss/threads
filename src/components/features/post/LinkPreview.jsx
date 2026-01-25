import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Globe } from "lucide-react";
import { getCachedLinkPreview } from "@/lib/api";

const LinkPreview = ({ url }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["link-preview", url],
    queryFn: () => getCachedLinkPreview(url),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours in memory too
    enabled: !!url,
  });

  if (isLoading) {
    return (
      <div className="mt-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-pulse bg-zinc-50 dark:bg-zinc-900/50 h-24 flex items-center justify-center">
        <Globe className="text-zinc-300 dark:text-zinc-700 animate-spin" size={24} />
      </div>
    );
  }

  if (isError || !data || (!data.title && !data.image)) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {data.image && (
        <div className="w-full aspect-[1.91/1] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}
      <div className="p-3.5 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold uppercase tracking-wider">
          <Globe size={12} />
          <span>{data.siteName}</span>
        </div>
        <h4 className="font-bold text-[15px] line-clamp-2 dark:text-white leading-snug group-hover:text-violet-600 transition-colors">
          {data.title}
        </h4>
        {data.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}
        <div className="pt-1 flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
          <ExternalLink size={10} />
          <span className="truncate">{url}</span>
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
