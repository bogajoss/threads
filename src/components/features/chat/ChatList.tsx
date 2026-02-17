import React, { useState } from "react";
import { Search, UserPlus, Edit } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

interface ConversationProps {
  conv: any;
  selectedId: string | null;
  onSelect: (conv: any) => void;
  onlineUsers: Set<string>;
  isTyping?: boolean;
}

const ConversationItem: React.FC<ConversationProps> = ({
  conv,
  selectedId,
  onSelect,
  onlineUsers,
  isTyping,
}) => {
  const isOnline =
    !conv.isGroup && conv.user ? onlineUsers.has(conv.user.id) : false;
  const isSelected = selectedId === conv.id;
  const hasUnread = conv.unread > 0;

  const displayName = conv.isGroup ? conv.name : conv.user?.name;
  const displayAvatar = conv.isGroup ? conv.avatar : conv.user?.avatar;

  return (
    <div
      onClick={() => onSelect(conv)}
      className={cn(
        "group relative flex cursor-pointer items-center gap-[10px] py-2 px-3 transition-all duration-150 rounded-xl",
        isSelected
          ? "bg-violet-600 dark:bg-violet-600"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-900/80",
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          className={cn(
            "size-[54px] border-0 transition-all",
            isSelected ? "opacity-90" : "opacity-100",
          )}
        >
          <AvatarImage
            src={displayAvatar}
            alt={displayName || ""}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-violet-100 to-violet-200 text-violet-700 font-bold text-xl dark:from-zinc-800 dark:to-zinc-700 dark:text-zinc-300">
            {displayName?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && !isSelected && (
          <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-[2.5px] border-white bg-emerald-500 ring-0 dark:border-black"></span>
        )}
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-center py-1">
        <div className="flex items-center justify-between gap-1">
          <span
            className={cn(
              "truncate text-[16px] font-bold tracking-tight leading-tight",
              isSelected ? "text-white" : "text-zinc-900 dark:text-zinc-100",
            )}
          >
            {displayName}
            {conv.isMuted && (
              <span className="ml-1 text-zinc-400 dark:text-zinc-500"></span>
            )}
          </span>
          <span
            className={cn(
              "shrink-0 text-[12px] font-medium ml-2",
              isSelected ? "text-white/80" : "text-zinc-400 dark:text-zinc-500",
            )}
          >
            {conv.time}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          {isTyping ? (
            <p
              className={cn(
                "truncate text-[14px] leading-relaxed flex-1 italic animate-pulse",
                isSelected
                  ? "text-white/90"
                  : "text-violet-500 dark:text-violet-400 font-medium",
              )}
            >
              typing...
            </p>
          ) : (
            <p
              className={cn(
                "truncate text-[14px] leading-relaxed flex-1",
                isSelected
                  ? "text-white/90"
                  : hasUnread
                    ? "text-zinc-900 font-medium dark:text-zinc-200"
                    : "text-zinc-500 dark:text-zinc-400",
              )}
            >
              {conv.isGroup && conv.lastMessageSender && (
                <span
                  className={cn(
                    "font-semibold mr-1",
                    isSelected
                      ? "text-white"
                      : "text-violet-500 dark:text-violet-400",
                  )}
                >
                  {conv.lastMessageSender}:
                </span>
              )}
              {conv.currentUserSent && !conv.lastMessageSender && "You: "}
              {conv.lastMessage}
            </p>
          )}
          {hasUnread && (
            <span
              className={cn(
                "flex min-w-[20px] h-[20px] px-1.5 items-center justify-center rounded-full text-[11px] font-bold shadow-sm",
                isSelected
                  ? "bg-white text-violet-600"
                  : "bg-violet-600 text-white dark:bg-violet-500",
              )}
            >
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface ChatListProps {
  conversations: any[];
  userResults?: User[];
  onSelect: (conv: any) => void;
  onStartNew: (user: User) => void;
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onlineUsers?: Set<string>;
  typingStatus?: Record<string, boolean>;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  userResults = [],
  onSelect,
  onStartNew,
  selectedId,
  searchQuery,
  onSearchChange,
  onlineUsers = new Set(),
  typingStatus = {},
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const activeUsers = conversations.filter((c) => onlineUsers.has(c.user?.id));

  const filteredByTab = conversations.filter((conv) => {
    if (activeTab === "unread") return conv.unread > 0;
    if (activeTab === "groups") return conv.isGroup;
    return true;
  });

  const tabs = [
    { id: "all", label: "All" },
    {
      id: "unread",
      label: "Unread",
      count: conversations.filter((c) => c.unread > 0).length,
    },
    { id: "groups", label: "Groups" },
  ];

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white dark:bg-[#0f0f0f] h-full shadow-inner">
      <div className="px-4 md:px-4 pt-4 pb-2 shrink-0 w-full overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 group min-w-0">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border-none bg-zinc-100 py-2.5 pl-11 pr-4 text-sm font-medium text-zinc-900 placeholder:text-zinc-500 transition-all focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:bg-zinc-900 dark:text-white dark:focus:bg-black"
            />
          </div>
          <button
            onClick={() => navigate("/create-group")}
            className="shrink-0 rounded-full bg-zinc-100 p-2.5 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Edit size={20} />
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-zinc-100 dark:border-zinc-800 mb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center px-4 py-2.5 text-[13px] font-bold transition-all",
                activeTab === tab.id
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              {tab.label}
              {tab.count ? (
                <span className="ml-1.5 flex size-4 items-center justify-center rounded-full bg-violet-600/10 text-[9px] dark:bg-violet-400/10">
                  {tab.count}
                </span>
              ) : null}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-violet-600 dark:bg-violet-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full min-w-0">
          <div className="flex flex-col pb-4 min-w-0">
            {!searchQuery && activeTab === "all" && activeUsers.length > 0 && (
              <div className="mb-4 mt-2 min-w-0 w-full overflow-hidden">
                <div className="flex gap-4 overflow-x-auto px-4 md:px-5 pb-4 pt-2 no-scrollbar w-full">
                  <div className="flex flex-col items-center gap-2 min-w-[64px] cursor-pointer group">
                    <div className="relative flex size-[60px] items-center justify-center rounded-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors">
                      <UserPlus size={24} className="text-zinc-400" />
                      <div className="absolute bottom-0 right-0 size-5 bg-white dark:bg-black rounded-full flex items-center justify-center">
                        <div className="size-4 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                          <span className="text-[10px] text-zinc-500 font-bold">
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-500">
                      Your Story
                    </span>
                  </div>
                  {activeUsers.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => onSelect(conv)}
                      className="flex flex-col items-center gap-2 cursor-pointer group min-w-[64px] transition-transform active:scale-95"
                    >
                      <div className="relative">
                        <div className="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-orange-500 opacity-90 p-[2px]"></div>
                        <div className="relative rounded-full border-[3px] border-white dark:border-black p-[2px] bg-white dark:bg-black">
                          <Avatar className="size-[50px]">
                            <AvatarImage
                              src={conv.user?.avatar}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {conv.user?.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="absolute bottom-1 right-1 size-3.5 rounded-full border-[2.5px] border-white bg-emerald-500 dark:border-black"></span>
                      </div>
                      <span className="w-full truncate text-center text-[11px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {conv.user?.name.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-2 space-y-0.5 mt-2">
              {filteredByTab.length > 0 &&
                filteredByTab
                  .filter(
                    (conv) =>
                      conv.lastMessage !== "No messages yet" ||
                      conv.id === selectedId ||
                      searchQuery,
                  )
                  .map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      selectedId={selectedId}
                      onSelect={onSelect}
                      onlineUsers={onlineUsers}
                      isTyping={typingStatus[conv.id]}
                    />
                  ))}
            </div>

            {userResults.length > 0 && (
              <>
                <div className="px-6 py-3 mt-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  More People
                </div>
                <div className="px-2 space-y-1">
                  {userResults.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => onStartNew(user)}
                      className="flex cursor-pointer items-center gap-4 px-3 py-2 rounded-2xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    >
                      <Avatar className="size-10">
                        <AvatarImage
                          src={user.avatar}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {user.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="truncate text-xs text-zinc-500">
                          @{user.handle}
                        </div>
                      </div>
                      <button className="flex size-8 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                        <UserPlus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {conversations.length === 0 &&
              userResults.length === 0 &&
              searchQuery && (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                    <Search className="text-zinc-400" size={24} />
                  </div>
                  <p className="text-zinc-500">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatList;
