import React from 'react';
import { Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ChatList = ({ conversations, onSelect, selectedId, searchQuery, onSearchChange }) => (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="relative group">
                <Search size={18} className="absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-violet-500" />
                <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
                <div
                    key={conv.id}
                    onClick={() => onSelect(conv)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${selectedId === conv.id ? 'bg-zinc-50 dark:bg-zinc-900 border-r-2 border-violet-500' : ''}`}
                >
                    <Avatar className="size-12">
                        <AvatarImage src={conv.user.avatar} alt={conv.user.name} className="object-cover" />
                        <AvatarFallback>{conv.user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold dark:text-white truncate">{conv.user.name}</span>
                            <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">{conv.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-zinc-500 text-sm truncate pr-2">{conv.lastMessage}</p>
                            {conv.unread > 0 && <span className="bg-violet-600 text-white text-[10px] font-bold size-5 rounded-full flex items-center justify-center shrink-0">{conv.unread}</span>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ChatList;
