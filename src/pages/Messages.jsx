import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ChatList from '../components/features/chat/ChatList';
import ChatWindow from '../components/features/chat/ChatWindow';
import { Mail, Loader2, Zap } from 'lucide-react';
import { fetchConversations, fetchMessages, sendMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Messages = () => {
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [msgSearchQuery, setMsgSearchQuery] = useState("");
    const [realtimeMessagesMap, setRealtimeMessagesMap] = useState({});

    // 1. Fetch Conversations
    const { data: conversations = [], isLoading: isConvLoading } = useQuery({
        queryKey: ['conversations', currentUser?.id],
        queryFn: () => fetchConversations(currentUser?.id),
        enabled: !!currentUser?.id
    });

    // 2. Fetch Messages for selected conversation
    const { data: fetchedMessages = [], isLoading: isMsgLoading } = useQuery({
        queryKey: ['messages', selectedConversation?.id],
        queryFn: () => fetchMessages(selectedConversation?.id),
        enabled: !!selectedConversation?.id
    });

    // Combine fetched and realtime messages
    const localMessages = useMemo(() => {
        const convId = selectedConversation?.id;
        if (!convId) return [];

        const fetched = fetchedMessages || [];
        const realtime = realtimeMessagesMap[convId] || [];

        const combined = [...fetched];

        realtime.forEach(rm => {
            if (!combined.find(m => m.id === rm.id)) {
                combined.push(rm);
            }
        });

        return combined.map(m => ({
            id: m.id,
            sender: m.sender_id === currentUser?.id ? 'me' : 'them',
            text: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    }, [fetchedMessages, realtimeMessagesMap, selectedConversation, currentUser]);

    // 3. Realtime subscription for messages
    useEffect(() => {
        const convId = selectedConversation?.id;
        if (!convId) return;

        const channel = supabase
            .channel(`msg:${convId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${convId}`
            }, (payload) => {
                const newM = payload.new;
                setRealtimeMessagesMap(prev => ({
                    ...prev,
                    [convId]: [...(prev[convId] || []), newM]
                }));
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [selectedConversation, currentUser]);

    // 4. Send Message Mutation
    const sendMutation = useMutation({
        mutationFn: ({ convId, text }) => sendMessage(convId, currentUser.id, text),
        onSuccess: () => {
            queryClient.invalidateQueries(['conversations', currentUser?.id]);
        }
    });

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 p-8 text-center bg-white dark:bg-black md:rounded-xl md:border border-zinc-100 dark:border-zinc-800">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full">
                    <Zap size={40} className="text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">Sign in to message others</h3>
                <p className="text-zinc-500 max-w-xs">Start decentralized conversations with anyone on the network.</p>
            </div>
        );
    }

    if (isConvLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black md:rounded-xl md:border border-zinc-100 dark:border-zinc-800">
                <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
        );
    }

    const filteredConversations = conversations.filter(c =>
        c.user.name.toLowerCase().includes(msgSearchQuery.toLowerCase()) ||
        c.user.handle.toLowerCase().includes(msgSearchQuery.toLowerCase())
    );

    const onSendMessage = async (convId, text) => {
        sendMutation.mutate({ convId, text });
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
                    messages={localMessages}
                    onBack={() => setSelectedConversation(null)}
                    onSendMessage={onSendMessage}
                    isLoading={isMsgLoading}
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
