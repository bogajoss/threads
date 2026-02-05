import React from "react";

interface PostStatsProps {
  views: number;
  likes: number;
  comments: number;
  commenterAvatars?: string[];
  isDetail?: boolean;
  isComment?: boolean;
  onRepliesClick?: (e: React.MouseEvent) => void;
}

const PostStats: React.FC<PostStatsProps> = ({
  views,
  likes,
  comments,
  commenterAvatars = [],
  isDetail = false,
  isComment = false,
  onRepliesClick,
}) => {
  if (isDetail) {
    return (
      <div className="mt-4 flex items-center gap-x-6 border-b border-zinc-100 pb-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="flex items-center gap-x-1">
          <span className="font-bold text-black dark:text-white">
            {views || 0}
          </span>{" "}
          <span className="opacity-70">Views</span>
        </div>
        <div className="flex items-center gap-x-1">
          <span className="font-bold text-black dark:text-white">
            {likes || 0}
          </span>{" "}
          <span className="opacity-70">Likes</span>
        </div>
        <div className="flex items-center gap-x-1">
          <span className="font-bold text-black dark:text-white">
            {comments || 0}
          </span>{" "}
          <span className="opacity-70">Comments</span>
        </div>
      </div>
    );
  }

  if (comments === 0 && likes === 0 && (views === 0 || isComment)) {
    return null;
  }

  return (
    <div className="mt-1 flex items-center gap-x-2">
      {comments > 0 && commenterAvatars.length > 0 && !isComment && (
        <div className="flex items-center -space-x-2 mr-1">
          {commenterAvatars.slice(0, 3).map((avatar, i) => (
            <div
              key={i}
              className="relative h-5 w-5 rounded-full border-2 border-white bg-zinc-100 dark:border-black dark:bg-zinc-800 overflow-hidden shadow-sm"
              style={{ zIndex: 3 - i }}
            >
              <img
                src={avatar}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
      <div
        className={`flex items-center gap-x-1.5 px-0.5 ${isComment ? "text-[12px]" : "text-[14px]"} font-medium text-zinc-500 dark:text-zinc-400`}
      >
        {views > 0 && !isComment && (
          <>
            <span className="hover:underline">
              {views} {views === 1 ? "view" : "views"}
            </span>
            {(comments > 0 || likes > 0) && <span className="opacity-50">·</span>}
          </>
        )}
        {comments > 0 && (
          <button
            className="hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (onRepliesClick) {
                onRepliesClick(e);
              }
            }}
          >
            {comments} {comments === 1 ? "reply" : "replies"}
          </button>
        )}
        {comments > 0 && likes > 0 && <span className="opacity-50">·</span>}
        {likes > 0 && (
          <button className="hover:underline">
            {likes} {likes === 1 ? "like" : "likes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostStats;
