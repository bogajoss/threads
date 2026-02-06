import React from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useTimeAgo } from "@/hooks";

interface ChatHeaderProps {
  conversation: any;
  isOnline: boolean;
  onBack: () => void;
  onOpenSettings: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  isOnline,
  onBack,
  onOpenSettings,
}) => {
  const navigate = useNavigate();
  const lastSeenTime = useTimeAgo(conversation.user?.lastSeen);

  const displayName = conversation.isGroup
    ? conversation.name
    : conversation.user?.name;
  const displayAvatar = conversation.isGroup
    ? conversation.avatar
    : conversation.user?.avatar;

  return (
    <div className="sticky top-0 z-40 flex shrink-0 items-center justify-between bg-white/95 px-2 py-1.5 backdrop-blur-md dark:bg-[#212121]/95 transition-all h-[56px]">
      <div className="flex items-center gap-1 w-full max-w-full">
        <button
          onClick={onBack}
          className="relative flex items-center justify-center size-11 rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5 md:hidden"
        >
          <ArrowLeft size={24} />
          {conversation.unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-500 px-1 text-[11px] font-bold text-white ring-2 ring-white dark:ring-[#212121]">
              {conversation.unread}
            </span>
          )}
        </button>

        <div
          className="flex items-center gap-3 px-2 flex-1 min-w-0 cursor-pointer"
          onClick={() =>
            !conversation.isGroup &&
            conversation.user &&
            navigate(`/u/${conversation.user.handle}`)
          }
        >
          <Avatar className="size-[42px] shrink-0">
            <AvatarImage
              src={displayAvatar}
              alt={displayName || ""}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-violet-100 to-violet-200 text-violet-700 font-bold dark:from-zinc-800 dark:to-zinc-700 dark:text-zinc-300">
              {displayName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0">
            <h3 className="text-[16px] font-bold text-zinc-900 dark:text-white truncate leading-tight">
              {displayName}
            </h3>
            <span className="text-[13px] text-zinc-500 dark:text-[#aaaaaa] leading-tight">
              {conversation.isGroup ? (
                "Group Chat"
              ) : isOnline ? (
                <span className="text-violet-500 dark:text-[#8774e1]">
                  Active now
                </span>
              ) : conversation.user?.lastSeen ? (
                `last seen ${lastSeenTime}`
              ) : (
                "offline"
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 pr-1">
        <button className="hidden sm:flex size-10 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-[#aaaaaa] dark:hover:bg-white/5 transition-colors">
          <Info size={20} />
        </button>
        <button
          onClick={onOpenSettings}
          className="flex size-10 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-[#aaaaaa] dark:hover:bg-white/5 transition-colors"
        >
          <Info size={22} className="rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;