import React, { useState, useMemo } from "react";
import { Search, MoreVertical, MessageSquarePlus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types";
import { cn, formatTimeAgo } from "@/lib/utils";
import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const ConversationItem = React.memo(({ 
  conv, 
  isSelected, 
  isOnline, 
  isTyping, 
  onClick 
}: { 
  conv: any, 
  isSelected: boolean, 
  isOnline: boolean, 
  isTyping: boolean, 
  onClick: () => void 
}) => {
  const displayName = conv.isGroup ? conv.name : conv.user?.name || "Unknown User";
  const displayAvatar = conv.isGroup ? conv.avatar : conv.user?.avatar;
  
  let timeDisplay = "";
  try {
      if (conv.created_at) {
          timeDisplay = formatTimeAgo(conv.created_at);
      }
  } catch {
      timeDisplay = "";
  } 

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 transition-all",
        isSelected 
          ? "bg-violet-600/10 dark:bg-violet-500/10" 
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-12 w-12 border border-zinc-200 dark:border-zinc-800">
          <AvatarImage src={displayAvatar} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white text-lg font-bold">
            {displayName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && !conv.isGroup && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[2px] border-white bg-emerald-500 ring-0 dark:border-zinc-950" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <div className="flex items-center justify-between">
          <h4 className={cn(
            "truncate text-[15px] font-semibold",
            isSelected ? "text-violet-900 dark:text-violet-100" : "text-zinc-900 dark:text-zinc-100"
          )}>
            {displayName}
          </h4>
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            {timeDisplay}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0 flex items-center gap-1">
             {isTyping ? (
               <p className="truncate text-[13px] leading-relaxed text-violet-600 dark:text-violet-400 font-medium italic">
                 Typing...
               </p>
             ) : (
                <p className={cn(
                  "truncate text-[13px] leading-relaxed",
                  conv.unread > 0 ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
                )}>
                  {conv.lastMessageSender && conv.isGroup && (
                    <span className="mr-1 font-medium">{conv.lastMessageSender}:</span>
                  )}
                  {conv.currentUserSent && <span className="mr-1">You:</span>}
                  {conv.lastMessage || "Start a conversation"}
                </p>
             )}
          </div>
          
          {conv.unread > 0 && (
            <span className="flex h-5 w-auto min-w-[20px] items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white shadow-sm ring-1 ring-violet-500 dark:bg-violet-500">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
      
      {/* Active Indicator Bar on Left */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-violet-600 dark:bg-violet-500" />
      )}
    </div>
  );
});

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  onSelect,
  selectedId,
  searchQuery,
  onSearchChange,
  onlineUsers = new Set(),
  typingStatus = {},
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');

  const filteredConversations = useMemo(() => {
    let result = conversations;
    
    // 1. Filter by tab
    if (filter === 'unread') result = result.filter(c => c.unread > 0);
    if (filter === 'groups') result = result.filter(c => c.isGroup);

    return result;
  }, [conversations, filter]);

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#09090b] overflow-hidden">
       {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-100 p-4 dark:border-zinc-800/50 shrink-0">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Messages</h2>
           <div className="flex items-center gap-1">
             <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => navigate("/create-group")}
                title="New Group"
              >
               <MessageSquarePlus size={20} />
             </Button>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                   <MoreVertical size={20} />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-48">
                 <DropdownMenuItem onClick={() => setFilter('all')}>
                    <span>All Chats</span>
                    {filter === 'all' && <span className="ml-auto text-violet-500">✓</span>}
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setFilter('unread')}>
                    <span>Unread</span>
                    {filter === 'unread' && <span className="ml-auto text-violet-500">✓</span>}
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setFilter('groups')}>
                    <span>Groups</span>
                    {filter === 'groups' && <span className="ml-auto text-violet-500">✓</span>}
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-violet-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border-none bg-zinc-100 py-2.5 pl-9 pr-4 text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-500 transition-all focus:ring-2 focus:ring-violet-500/20 dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800"
          />
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
           {conversations.length === 0 && !searchQuery && (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                  <MessageSquarePlus size={24} className="text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">No messages yet</h3>
                <p className="max-w-[180px] text-xs text-zinc-500">
                   Start a conversation with a friend or create a group.
                </p>
                <Button 
                  size="sm" 
                  className="mt-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={() => navigate("/explore")} 
                >
                  Start New Chat
                </Button>
              </div>
           )}

           {conversations.length > 0 && filteredConversations.length === 0 && (
             <div className="py-8 text-center text-sm text-zinc-500">
               No messages found
             </div>
           )}

           {filteredConversations.map((conv) => (
             <ConversationItem
               key={conv.id}
               conv={conv}
               isSelected={selectedId === conv.id}
               isOnline={!conv.isGroup && conv.user && onlineUsers.has(conv.user.id)}
               isTyping={!!typingStatus[conv.id]}
               onClick={() => onSelect(conv)}
             />
           ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;
