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
    <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-zinc-100 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/75">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="mr-1 -ml-2.5 rounded-full p-2.5 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
        >
          <ArrowLeft size={24} />
        </button>
        <div
          className="relative cursor-pointer"
          onClick={() =>
            !conversation.isGroup &&
            conversation.user &&
            navigate(`/u/${conversation.user.handle}`)
          }
        >
          <Avatar className="size-10 border-2 border-white shadow-sm dark:border-zinc-800">
            <AvatarImage
              src={displayAvatar}
              alt={displayName || ""}
              className="object-cover"
            />
            <AvatarFallback>{displayName?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          {isOnline && !conversation.isGroup && (
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-black"></span>
          )}
        </div>
        <div
          className="flex flex-col cursor-pointer"
          onClick={() =>
            !conversation.isGroup &&
            conversation.user &&
            navigate(`/u/${conversation.user.handle}`)
          }
        >
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            {displayName}
          </h3>
          <span className="text-[11px] font-medium text-zinc-500">
            {conversation.isGroup ? (
              "Group Chat"
            ) : isOnline ? (
              <span className="text-emerald-500">Active now</span>
            ) : conversation.user?.lastSeen ? (
              `Last seen ${lastSeenTime}`
            ) : (
              "Offline"
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onOpenSettings}
          className="rounded-full p-2.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
