import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/ui/SearchBar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { useTimeAgo } from "@/hooks/useTimeAgo";

const ConversationItem = ({ conv, selectedId, onSelect, onlineUsers }) => {
  const navigate = useNavigate();
  const timeAgo = useTimeAgo(conv.user?.lastSeen);
  const isOnline = onlineUsers.has(conv.user?.id);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (conv.user?.handle) {
      navigate(`/u/${conv.user.handle}`);
    }
  };

  return (
    <div
      onClick={() => onSelect(conv)}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${selectedId === conv.id ? "bg-zinc-50 dark:bg-zinc-900 border-r-2 border-violet-500" : ""}`}
    >
      <div className="relative group" onClick={handleProfileClick}>
        <Avatar className="size-12 group-hover:brightness-90 transition-all">
          <AvatarImage
            src={conv.user?.avatar}
            alt={conv.user?.name}
            className="object-cover"
          />
          <AvatarFallback>{conv.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <div className="flex flex-col min-w-0">
            <span
              onClick={handleProfileClick}
              className="font-bold dark:text-white truncate cursor-pointer"
            >
              {conv.user?.name}
            </span>
            {isOnline ? (
              <span className="text-[10px] text-emerald-500 font-medium leading-none mb-1">
                Online
              </span>
            ) : (
              conv.user?.lastSeen && (
                <span className="text-[10px] text-zinc-500 font-medium leading-none mb-1">
                  {timeAgo}
                </span>
              )
            )}
          </div>
          <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">
            {conv.time}
          </span>
        </div>
        <div className="flex-1 flex justify-between items-center">
          <p className="text-zinc-500 text-sm truncate pr-2">
            {conv.lastMessage}
          </p>
          {conv.unread > 0 && (
            <span className="bg-violet-600 text-white text-[10px] font-bold size-5 rounded-full flex items-center justify-center shrink-0">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatList = ({
  conversations,
  userResults = [],
  onSelect,
  onStartNew,
  selectedId,
  searchQuery,
  onSearchChange,
  onlineUsers = new Set(),
}) => (
  <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black">
    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onClear={() => onSearchChange("")}
        placeholder="Search people or messages..."
      />
    </div>
    <div className="flex-1 overflow-y-auto">
      {/* Existing Conversations */}
      {conversations.length > 0 && (
        <div className="py-2">
          {conversations
            .filter(
              (conv) =>
                conv.lastMessage !== "No messages yet" || conv.id === selectedId,
            )
            .map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                selectedId={selectedId}
                onSelect={onSelect}
                onlineUsers={onlineUsers}
              />
            ))}
        </div>
      )}

      {/* People Search Results */}
      {userResults.length > 0 && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            People
          </div>
          {userResults.map((user) => (
            <div
              key={user.id}
              onClick={() => onStartNew(user)}
              className="flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <Avatar className="size-12">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-bold dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-zinc-500 text-sm truncate">
                  @{user.handle}
                </div>
              </div>
              <UserPlus size={18} className="text-violet-500" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {conversations.length === 0 &&
        userResults.length === 0 &&
        searchQuery && (
          <div className="p-8 text-center">
            <p className="text-zinc-500 text-sm">
              No conversations or people found for "{searchQuery}"
            </p>
          </div>
        )}

      {conversations.length === 0 && !searchQuery && (
        <div className="p-8 text-center">
          <p className="text-zinc-500 text-sm">
            No messages yet. Search for people to start a chat!
          </p>
        </div>
      )}
    </div>
  </div>
);

export default ChatList;
