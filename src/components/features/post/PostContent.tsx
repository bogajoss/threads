import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import { isBangla, cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface PostContentProps {
  content: string;
  isDetail?: boolean;
  isEditing?: boolean;
  editedContent?: string;
  setEditedContent?: (content: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  isUpdating?: boolean;
  contentClass?: string;
}

const PostContent: React.FC<PostContentProps> = ({
  content,
  isDetail,
  isEditing,
  editedContent,
  setEditedContent,
  onCancelEdit,
  onSaveEdit,
  isUpdating,
  contentClass,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const isTxtBangla = typeof content === "string" && isBangla(content);

  if (isEditing && setEditedContent) {
    return (
      <div
        className="mt-2 flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Textarea
          value={editedContent}
          onChange={(e: any) => setEditedContent(e.target.value)}
          className={`min-h-[100px] w-full rounded-xl border-zinc-200 bg-zinc-50 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900 ${
            isBangla(editedContent || "")
              ? "font-bangla text-lg"
              : "font-english"
          }`}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancelEdit}
            className="px-4 py-1.5 text-sm font-bold text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Cancel
          </button>
          <button
            onClick={onSaveEdit}
            disabled={
              isUpdating || !editedContent?.trim() || editedContent === content
            }
            className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-bold text-white transition-all hover:bg-violet-700 disabled:opacity-50 active:scale-95"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  const shouldTruncate = !isDetail && content.length > 280;
  const textToProcess =
    shouldTruncate && !isExpanded ? content.substring(0, 280) : content;

  return (
    <div
      className={cn(
        "whitespace-pre-line break-words",
        isDetail
          ? "text-lg leading-relaxed sm:text-xl sm:leading-8"
          : "text-[15px] leading-relaxed",
        isTxtBangla ? "font-bangla text-[1.15em]" : "font-english",
        contentClass,
      )}
    >
      <Linkify
        options={{
          ...linkifyOptions,
          render: ({ attributes, content: linkContent }) => {
            const { href, ...props } = attributes;
            const origin = window.location.origin;

            if (href.includes("internal.tag/")) {
              const tag = decodeURIComponent(href.split("internal.tag/")[1]);
              return (
                <span
                  key={linkContent as string}
                  {...props}
                  className={cn(
                    "cursor-pointer font-bold text-rose-600 hover:underline dark:text-rose-400 font-bangla",
                    props.className,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tags/${tag}`);
                  }}
                >
                  #{tag}
                </span>
              );
            }

            let internalPath = null;
            if (href.startsWith("/")) {
              internalPath = href;
            } else if (href.startsWith(origin)) {
              internalPath = href.replace(origin, "");
            }

            if (internalPath) {
              return (
                <span
                  key={linkContent as string}
                  {...props}
                  className={cn(
                    "cursor-pointer font-medium text-violet-600 hover:underline dark:text-violet-400",
                    props.className,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(internalPath!);
                  }}
                >
                  {linkContent}
                </span>
              );
            }

            return (
              <a
                key={linkContent as string}
                href={href}
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-violet-600 hover:underline dark:text-violet-400",
                  props.className,
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {linkContent}
              </a>
            );
          },
        }}
      >
        {typeof textToProcess === "string"
          ? textToProcess.replace(
              /#([\u0980-\u09FF\w]+)/g,
              "https://internal.tag/$1",
            )
          : textToProcess}
      </Linkify>
      {shouldTruncate && !isExpanded && "..."}
      {shouldTruncate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="ml-1 cursor-pointer font-bold text-rose-600 hover:underline dark:text-rose-400"
        >
          {isExpanded ? "Show less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default PostContent;
