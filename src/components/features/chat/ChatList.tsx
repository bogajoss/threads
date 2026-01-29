import React from "react"
import { useNavigate } from "react-router-dom"
import SearchBar from "@/components/ui/search-bar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus } from "lucide-react"
// @ts-ignore
import { useTimeAgo } from "@/hooks/useTimeAgo"
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
    const timeAgo = useTimeAgo(conv.user?.lastSeen)
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
            className={`flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${selectedId === conv.id
                ? "border-r-2 border-violet-500 bg-zinc-50 dark:bg-zinc-900"
                : ""
                }`}
        >
            <div className="group relative" onClick={handleProfileClick}>
                <Avatar className="size-12 transition-all group-hover:brightness-90">
                    <AvatarImage
                        src={conv.user?.avatar}
                        alt={conv.user?.name}
                        className="object-cover"
                    />
                    <AvatarFallback>{conv.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                {isOnline && (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-black"></span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between">
                    <div className="flex min-w-0 flex-col">
                        <span
                            onClick={handleProfileClick}
                            className="mt-1 cursor-pointer truncate font-bold dark:text-white"
                        >
                            {conv.user?.name}
                        </span>
                        {isOnline ? (
                            <span className="mb-1 text-[10px] font-medium leading-none text-emerald-500">
                                Online
                            </span>
                        ) : (
                            conv.user?.lastSeen && (
                                <span className="mb-1 text-[10px] font-medium leading-none text-zinc-500">
                                    {timeAgo}
                                </span>
                            )
                        )}
                    </div>
                    <span className="ml-2 whitespace-nowrap text-xs text-zinc-500">
                        {conv.time}
                    </span>
                </div>
                <div className="flex flex-1 items-center justify-between">
                    <p className="truncate pr-2 text-sm text-zinc-500">
                        {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
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
}) => (
    <div className="flex min-w-0 flex-1 flex-col bg-white dark:bg-black">
        <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
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
                <div className="border-t border-zinc-100 dark:border-zinc-800">
                    <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        People
                    </div>
                    {userResults.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => onStartNew(user)}
                            className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        >
                            <Avatar className="size-12">
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
                    <p className="text-sm text-zinc-500">
                        No conversations or people found for "{searchQuery}"
                    </p>
                </div>
            )}

            {conversations.length === 0 && !searchQuery && (
                <div className="p-8 text-center">
                    <p className="text-sm text-zinc-500">
                        No messages yet. Search for people to start a chat!
                    </p>
                </div>
            )}
        </div>
    </div>
)

export default ChatList
