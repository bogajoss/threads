import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ChatList from '../components/features/chat/ChatList';
import ChatWindow from '../components/features/chat/ChatWindow';
import { Mail, Loader2 } from 'lucide-react';
import { fetchConversations } from '../services/api';
import db from '../data/db.json';

const Messages = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [msgSearchQuery, setMsgSearchQuery] = useState("");

    const { data: initialConversations = [], isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: fetchConversations
    });

    const [localConversations, setLocalConversations] = useState(null);
    const [chats, setChats] = useState(db.chats);

    const conversations = localConversations || initialConversations;

    if (isLoading && conversations.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
        );
    }

    const filteredConversations = conversations.filter(c =>
        c.user.name.toLowerCase().includes(msgSearchQuery.toLowerCase()) ||
        c.user.handle.toLowerCase().includes(msgSearchQuery.toLowerCase())
    );

    const onSendMessage = (convId, text) => {
        const newMessage = {
            id: Date.now(),
            sender: 'me',
            text: text,
            time: 'Just now'
        };

        setChats(prev => ({
            ...prev,
            [convId]: [...(prev[convId] || []), newMessage]
        }));

        setLocalConversations(prev => {
            const current = prev || initialConversations;
            return current.map(c =>
                c.id === convId ? { ...c, lastMessage: text, time: 'Just now' } : c
            );
        });
    };

    return (
        <div className="flex h-screen bg-white dark:bg-black overflow-hidden md:rounded-xl md:border border-zinc-100 dark:border-zinc-800">
            <div className={`w-full md:w-80 flex flex-col border-r border-zinc-100 dark:border-zinc-800 ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold dark:text-white">Messages</h2>
                </div>
                <ChatList
                    conversations={filteredConversations}
                    onSelect={setSelectedConversation}
                    selectedId={selectedConversation?.id}
                    searchQuery={msgSearchQuery}
                    onSearchChange={setMsgSearchQuery}
                />
            </div>
            {selectedConversation ? (
                <ChatWindow
                    conversation={selectedConversation}
                    messages={chats[selectedConversation.id] || []}
                    onBack={() => setSelectedConversation(null)}
                    onSendMessage={onSendMessage}
                />
            ) : (
                <div className="hidden md:flex flex-1 items-center justify-center text-zinc-500 flex-col gap-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-full">
                        <Mail size={48} className="text-zinc-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Select a message</h3>
                        <p>Choose from your existing conversations or start a new one.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
