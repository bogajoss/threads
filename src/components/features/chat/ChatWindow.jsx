import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Send, Smile, Paperclip, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import TypingIndicator from '@/components/ui/TypingIndicator';
import { formatTimeAgo } from '@/lib/utils';

const ChatWindow = ({ conversation, messages, onBack, onSendMessage, onTyping, isLoading, isTyping, isOnline }) => {
    const [text, setText] = useState("");
    const scrollRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleTextChange = (e) => {
        const val = e.target.value;
        setText(val);

        if (onTyping) {
            // Signal that we are typing
            onTyping(true);

            // Clear existing timeout
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            // Set timeout to signal we stopped typing
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false);
            }, 2000);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        
        if (onTyping) {
            clearTimeout(typingTimeoutRef.current);
            onTyping(false);
        }
        
        onSendMessage(conversation.id, text);
        setText("");
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-black md:border-l md:border-zinc-100 dark:md:border-zinc-800">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white transition-colors"><ArrowLeft size={20} /></button>
                    <Avatar className="size-10 border border-zinc-200 dark:border-zinc-700">
                        <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} className="object-cover" />
                        <AvatarFallback>{conversation.user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-bold dark:text-white">{conversation.user.name}</div>
                        {isOnline ? (
                            <div className="text-xs text-emerald-500 font-medium">Online</div>
                        ) : (
                            <div className="text-xs text-zinc-500 font-medium">
                                {conversation.user.lastSeen ? `Last seen ${formatTimeAgo(conversation.user.lastSeen)}` : 'Offline'}
                            </div>
                        )}
                    </div>
                </div>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full dark:text-zinc-400"><MoreVertical size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                <div className="text-center py-8">
                    <Avatar className="size-20 mx-auto mb-3 border-4 border-zinc-50 dark:border-zinc-900 shadow-sm">
                        <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} className="object-cover" />
                        <AvatarFallback className="text-2xl font-bold">{conversation.user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold dark:text-white text-lg">{conversation.user.name}</h4>
                    <p className="text-sm text-zinc-500">@{conversation.user.handle}</p>
                    <p className="text-xs text-zinc-400 mt-4 max-w-xs mx-auto">This is the beginning of your direct message history with <span className="font-bold">@{conversation.user.handle}</span></p>
                </div>

                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin text-violet-500" size={32} />
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] shadow-sm ${msg.sender === 'me' ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-zinc-100 dark:bg-zinc-800 dark:text-white rounded-tl-none'}`}>
                                <p>{msg.text}</p>
                                <div className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-violet-200' : 'text-zinc-400'}`}>{msg.time}</div>
                            </div>
                        </div>
                    ))
                )}

                {isTyping && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-zinc-100 dark:bg-zinc-800/50 px-3 py-2 rounded-2xl rounded-tl-none border border-zinc-200/50 dark:border-zinc-700/30 shadow-sm">
                            <TypingIndicator />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-2xl border border-transparent focus-within:border-violet-500 transition-all">
                    <button type="button" className="p-2 text-zinc-500 hover:text-violet-600 transition-colors"><Smile size={20} /></button>
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none dark:text-white py-1 px-1"
                        placeholder="Start a new message"
                        value={text}
                        onChange={handleTextChange}
                    />
                    <button type="button" className="p-2 text-zinc-500 hover:text-violet-600 transition-colors"><Paperclip size={20} /></button>
                    <Button type="submit" className="size-10 !p-0 rounded-xl" disabled={!text.trim()}><Send size={18} /></Button>
                </form>
            </div>
        </div>
    );
};


export default ChatWindow;
