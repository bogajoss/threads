import React from "react"
import { useNavigate } from "react-router-dom"
import SearchBar from "@/components/ui/search-bar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { User } from "@/types"

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
    const navigate = useNavigate()
    const isOnline = onlineUsers.has(conv.user?.id)

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (conv.user?.handle) {
            navigate(`/u/${conv.user.handle}`)
        }
    }

    return (
        <div
            onClick={() => onSelect(conv)}
            className={`group relative flex cursor-pointer items-center gap-3 p-3 mx-2 rounded-xl transition-all duration-200 
                ${selectedId === conv.id
                    ? "bg-violet-50 dark:bg-violet-900/10 shadow-sm"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
        >
            {selectedId === conv.id && (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-violet-600"></div>
            )}

            <div className="relative cursor-pointer" onClick={handleProfileClick}>
                <Avatar className="size-12 border-2 border-transparent transition-all group-hover:border-zinc-200 dark:group-hover:border-zinc-800">
                    <AvatarImage
                        src={conv.user?.avatar}
                        alt={conv.user?.name}
                        className="object-cover"
                    />
                    <AvatarFallback>{conv.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                {isOnline && (
                    <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white bg-emerald-500 ring-1 ring-emerald-500/20 dark:border-black"></span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between">
                    <span
                        className={`truncate font-bold ${selectedId === conv.id ? "text-violet-900 dark:text-violet-100" : "text-zinc-900 dark:text-zinc-100"}`}
                    >
                        {conv.user?.name}
                    </span>
                    <span className={`ml-2 whitespace-nowrap text-[10px] font-medium ${conv.unread > 0 ? "text-violet-600" : "text-zinc-400"}`}>
                        {conv.time}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-sm ${conv.unread > 0 ? "font-semibold text-zinc-900 dark:text-white" : "text-zinc-500"}`}>
                        {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-sm shadow-violet-200 dark:shadow-none">
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
    // Mock active users for demonstration if onlineUsers is empty, purely for visual
    // In real app, you'd filter friends who are online
    const activeUsers = conversations.filter(c => onlineUsers.has(c.user?.id));

    return (
        <div className="flex min-w-0 flex-1 flex-col bg-white dark:bg-black">
            <div className="border-b border-zinc-100/50 p-4 dark:border-zinc-800/50">
                <h2 className="mb-4 text-2xl font-black tracking-tight dark:text-white">Messages</h2>
                <SearchBar
                    value={searchQuery}
                    onChange={onSearchChange}
                    onClear={() => onSearchChange("")}
                    placeholder="Search messages..."
                    className="shadow-sm"
                />
            </div>

            <div className="flex-1 min-h-0 relative">
                <ScrollArea className="absolute inset-0 h-full">
                    <div className="flex flex-col min-h-full pb-4">
                        {/* Active Now Section */}
                        {!searchQuery && activeUsers.length > 0 && (
                            <div className="mt-2 mb-4 pl-4">
                                <div className="flex gap-2 overflow-x-auto pb-2 pr-4 no-scrollbar">
                                    {activeUsers.map(conv => (
                                        <div key={conv.id} onClick={() => onSelect(conv)} className="flex flex-col items-center gap-1.5 cursor-pointer group min-w-[72px]">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-[2px]">
                                                    <div className="h-full w-full rounded-full bg-white dark:bg-black"></div>
                                                </div>
                                                <Avatar className="size-[56px] border-[2px] border-transparent group-hover:border-transparent group-hover:p-[1.5px] transition-all">
                                                    <AvatarImage src={conv.user?.avatar} className="object-cover rounded-full" />
                                                    <AvatarFallback>{conv.user?.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="absolute bottom-1 right-1 size-3.5 rounded-full border-2 border-white bg-emerald-500 ring-2 ring-white dark:border-black dark:ring-black"></span>
                                            </div>
                                            <span className="w-full truncate text-center text-[10px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                                {conv.user?.name.split(' ')[0]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Messages Header */}
                        {!searchQuery && (
                            <div className="px-5 py-2 text-xs font-bold text-zinc-900 dark:text-white">
                                Messages
                            </div>
                        )}

                        {/* Existing Conversations */}
                        {conversations.length > 0 && (
                            <div className="space-y-0.5 px-2">
                                {conversations
                                    .filter(
                                        (conv) =>
                                            conv.lastMessage !== "No messages yet" || conv.id === selectedId
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
                            <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    People
                                </div>
                                {userResults.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => onStartNew(user)}
                                        className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                    >
                                        <Avatar className="size-10">
                                            <AvatarImage
                                                src={user.avatar}
                                                alt={user.name}
                                                className="object-cover"
                                            />
                                            <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate font-bold dark:text-white">
                                                {user.name}
                                            </div>
                                            <div className="truncate text-sm text-zinc-500">
                                                @{user.handle}
                                            </div>
                                        </div>
                                        <UserPlus size={18} className="text-violet-500" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {conversations.length === 0 && userResults.length === 0 && searchQuery && (
                            <div className="p-8 text-center">
                                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                                    <UserPlus className="text-zinc-400" />
                                </div>
                                <p className="text-sm text-zinc-500">
                                    No conversations or people found for "{searchQuery}"
                                </p>
                            </div>
                        )}

                        {conversations.length === 0 && !searchQuery && (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                                <div className="mb-4 rounded-2xl bg-violet-50 p-6 dark:bg-violet-900/20">
                                    <UserPlus size={32} className="text-violet-500" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No messages yet</h3>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Connect with others to start chatting!
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

export default ChatList
