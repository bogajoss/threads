import React, { useState } from "react"
import { Search, UserPlus, Edit, Users } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateGroupModal } from "@/components/features/modals"
import type { User } from "@/types"
import { cn } from "@/lib/utils"

interface ConversationProps {
    conv: any
    selectedId: string | null
    onSelect: (conv: any) => void
    onlineUsers: Set<string>
}

const ConversationItem: React.FC<ConversationProps> = ({
    conv,
    selectedId,
    onSelect,
    onlineUsers,
}) => {
    const isOnline = !conv.isGroup && conv.user ? onlineUsers.has(conv.user.id) : false
    const isSelected = selectedId === conv.id
    const hasUnread = conv.unread > 0

    const displayName = conv.isGroup ? conv.name : conv.user?.name
    const displayAvatar = conv.isGroup ? conv.avatar : conv.user?.avatar

    return (
        <div
            onClick={() => onSelect(conv)}
            className={cn(
                "group relative flex cursor-pointer items-center gap-4 p-3 mx-1 md:mx-2 rounded-2xl transition-all duration-200",
                isSelected
                    ? "bg-violet-500/10 dark:bg-violet-500/20"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            )}
        >
            <div className="relative">
                <Avatar className={cn(
                    "size-[52px] border-2 transition-all",
                    isSelected ? "border-violet-500/30" : "border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-700"
                )}>
                    <AvatarImage
                        src={displayAvatar}
                        alt={displayName || ""}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-zinc-100 text-zinc-500 font-bold text-lg dark:bg-zinc-800 dark:text-zinc-400">
                        {displayName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                {isOnline && (
                    <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-[2.5px] border-white bg-emerald-500 ring-0 dark:border-black"></span>
                )}
            </div>

            <div className="min-w-0 flex-1 py-1">
                <div className="flex items-center justify-between mb-0.5">
                    <span className={cn(
                        "truncate text-[15px] font-semibold",
                        hasUnread ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-200"
                    )}>
                        {displayName}
                    </span>
                    <span className={cn(
                        "ml-2 whitespace-nowrap text-[11px] font-medium",
                        hasUnread ? "text-violet-600 dark:text-violet-400" : "text-zinc-400"
                    )}>
                        {conv.time}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                        "truncate text-[13px] leading-relaxed",
                        hasUnread
                            ? "font-semibold text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                    )}>
                        {conv.currentUserSent ? "You: " : ""}{conv.lastMessage?.length > 40 ? conv.lastMessage.substring(0, 40) + "..." : conv.lastMessage}
                    </p>
                    {hasUnread && (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-sm shadow-violet-500/30">
                            {conv.unread}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

interface ChatListProps {
    conversations: any[]
    userResults?: User[]
    onSelect: (conv: any) => void
    onStartNew: (user: User) => void
    selectedId: string | null
    searchQuery: string
    onSearchChange: (query: string) => void
    onlineUsers?: Set<string>
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
}) => {
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
    const activeUsers = conversations.filter(c => onlineUsers.has(c.user?.id));

    return (
        <div className="flex min-w-0 flex-1 flex-col bg-white dark:bg-black h-full">
            {/* Header */}
            <div className="px-4 md:px-5 pt-5 pb-2">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Chats</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsCreateGroupOpen(true)}
                            className="rounded-full bg-zinc-100 p-2.5 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            title="New Group"
                        >
                            <Users size={20} />
                        </button>
                        <button className="rounded-full bg-zinc-100 p-2.5 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800">
                            <Edit size={20} />
                        </button>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search Messenger"
                        className="w-full rounded-2xl border-none bg-zinc-100 py-3 pl-12 pr-4 text-base font-medium text-zinc-900 placeholder:text-zinc-500 transition-all focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:shadow-md dark:bg-zinc-900 dark:text-white dark:focus:bg-black"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col pb-4">
                    {/* Active Now / Stories */}
                    {!searchQuery && activeUsers.length > 0 && (
                        <div className="mb-4 mt-2">
                            <div className="flex gap-4 overflow-x-auto px-4 md:px-5 pb-4 pt-2 no-scrollbar">
                                <div className="flex flex-col items-center gap-2 min-w-[64px] cursor-pointer group">
                                    <div className="relative flex size-[60px] items-center justify-center rounded-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors">
                                        <UserPlus size={24} className="text-zinc-400" />
                                        <div className="absolute bottom-0 right-0 size-5 bg-white dark:bg-black rounded-full flex items-center justify-center">
                                            <div className="size-4 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                                                <span className="text-[10px] text-zinc-500 font-bold">+</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium text-zinc-500">Your Story</span>
                                </div>
                                {activeUsers.map(conv => (
                                    <div key={conv.id} onClick={() => onSelect(conv)} className="flex flex-col items-center gap-2 cursor-pointer group min-w-[64px] transition-transform active:scale-95">
                                        <div className="relative">
                                            <div className="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-orange-500 opacity-90 p-[2px]"></div>
                                            <div className="relative rounded-full border-[3px] border-white dark:border-black p-[2px] bg-white dark:bg-black">
                                                <Avatar className="size-[50px]">
                                                    <AvatarImage src={conv.user?.avatar} className="object-cover" />
                                                    <AvatarFallback>{conv.user?.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <span className="absolute bottom-1 right-1 size-3.5 rounded-full border-[2.5px] border-white bg-emerald-500 dark:border-black"></span>
                                        </div>
                                        <span className="w-full truncate text-center text-[11px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                            {conv.user?.name.split(' ')[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages List */}
                    <div className="px-2 space-y-1">
                        {conversations.length > 0 && conversations
                            .filter(conv => conv.lastMessage !== "No messages yet" || conv.id === selectedId || searchQuery)
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

                    {/* Search Results for Users */}
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
                                            <AvatarImage src={user.avatar} className="object-cover" />
                                            <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-bold text-zinc-900 dark:text-white">{user.name}</div>
                                            <div className="truncate text-xs text-zinc-500">@{user.handle}</div>
                                        </div>
                                        <button className="flex size-8 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                                            <UserPlus size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Empty States */}
                    {conversations.length === 0 && userResults.length === 0 && searchQuery && (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                            <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                                <Search className="text-zinc-400" size={24} />
                            </div>
                            <p className="text-zinc-500">No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <CreateGroupModal
                isOpen={isCreateGroupOpen}
                onClose={() => setIsCreateGroupOpen(false)}
                onCreated={(convId) => {
                    // Force a selection of the new group
                    onSelect({ id: convId, isGroup: true });
                }}
            />
        </div>
    )
}

export default ChatList
