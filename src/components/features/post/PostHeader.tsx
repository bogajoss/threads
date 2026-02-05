import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedIcon, ChevronTagIcon } from "@/components/ui";
import type { User, CommunityShort } from "@/types";

interface PostHeaderProps {
  user: User;
  timeAgo: string;
  community?: CommunityShort | null;
  onUserClick?: (handle: string) => void;
  actionsMenu?: React.ReactNode;
  isComment?: boolean;
  isDetail?: boolean;
  showAvatar?: boolean;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  user,
  timeAgo,
  community,
  onUserClick,
  actionsMenu,
  isComment,
  isDetail,
  showAvatar = false,
}) => {
  const navigate = useNavigate();

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) onUserClick(user.handle);
  };

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (community) navigate(`/c/${community.handle}`);
  };

  return (
    <div
      className={`flex items-center justify-between ${isDetail ? "pb-4" : "min-h-[40px] mb-1"}`}
    >
      <div className="flex items-center gap-x-3 flex-1 min-w-0">
        {showAvatar && (
          <button className="shrink-0" onClick={handleUserClick}>
            <Avatar
              className={`${isDetail ? "size-12" : isComment ? "size-8" : "size-10"} border-0 shadow-sm`}
            >
              <AvatarImage
                src={user.avatar}
                alt={user.handle}
                className="object-cover"
              />
              <AvatarFallback className="text-xs">
                {user.handle[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-x-1.5 leading-none">
            <div className="flex min-w-0 max-w-full items-center gap-1.5">
              <button
                className={`flex shrink-0 items-center gap-1 font-bold text-zinc-900 hover:underline dark:text-white ${
                  isDetail
                    ? "text-base sm:text-lg"
                    : isComment
                      ? "text-[14px]"
                      : "text-[15px]"
                }`}
                onClick={handleUserClick}
              >
                <span className="max-w-[150px] truncate sm:max-w-none">
                  {user.handle}
                </span>
                {user.verified && (
                  <VerifiedIcon
                    size={isDetail ? 16 : isComment ? 12 : 14}
                    className="text-blue-500"
                  />
                )}
              </button>

              {community && (
                <div className="flex min-w-0 items-center gap-1 text-zinc-500">
                  <ChevronTagIcon
                    size={isDetail ? 14 : 12}
                    className="shrink-0 text-zinc-400"
                  />
                  <button
                    className={`flex items-center gap-1 font-bold text-zinc-900 hover:underline dark:text-zinc-100 ${
                      isDetail ? "text-[14px] sm:text-[15px]" : "text-[13px]"
                    }`}
                    onClick={handleCommunityClick}
                  >
                    <Avatar className="size-3.5 shrink-0 border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                      <AvatarImage
                        src={community.avatar}
                        alt={community.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-[6px] font-bold text-zinc-500">
                        {community.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[150px] truncate sm:max-w-none">
                      {community.name}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="-mt-1 flex items-center gap-2">
        <span className="whitespace-nowrap text-[12px] text-zinc-500 dark:text-zinc-400">
          {timeAgo || "Recent"}
        </span>
        {actionsMenu}
      </div>
    </div>
  );
};

export default PostHeader;
