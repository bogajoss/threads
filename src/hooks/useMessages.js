import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, sendMessage } from '@/services/api';
import { supabase } from '@/lib/supabase';

export const useMessages = (currentUser) => {
    const queryClient = useQueryClient();
    const [typingStatus, setTypingStatus] = useState({}); // { convId: boolean }
    const channelRef = useRef(null);

    // 1. Fetch Conversations
    const { data: conversations = [], isLoading: isConvLoading } = useQuery({
        queryKey: ['conversations', currentUser?.id],
        queryFn: () => fetchConversations(currentUser?.id),
        enabled: !!currentUser?.id
    });

    // 2. Realtime subscription (Messages + Typing)
    useEffect(() => {
        if (!currentUser?.id) return;

        // Channel for DB changes (private to user)
        const messagesChannel = supabase
            .channel(`user_messages:${currentUser.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            }, (payload) => {
                const newM = payload.new;
                queryClient.setQueryData(['messages', newM.conversation_id], (old) => {
                    if (!old) return [newM];
                    if (old.find(m => m.id === newM.id)) return old;
                    return [...old, newM];
                });
                queryClient.invalidateQueries(['conversations', currentUser.id]);
                setTypingStatus(prev => ({ ...prev, [newM.conversation_id]: false }));
            })
            .subscribe();

        // Channel for Typing Broadcast (shared)
        const typingChannel = supabase
            .channel('chat_typing_shared')
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                console.log('Received typing broadcast:', payload);
                const { conversationId, isTyping, userId } = payload;
                if (userId !== currentUser.id) {
                    setTypingStatus(prev => ({ ...prev, [conversationId]: isTyping }));
                }
            })
            .subscribe((status) => {
                console.log('Typing channel status:', status);
            });

        channelRef.current = typingChannel;

        return () => {
            console.log('Cleaning up channels');
            supabase.removeChannel(messagesChannel);
            supabase.removeChannel(typingChannel);
        };
    }, [currentUser?.id, queryClient]);

    // 3. Mutation to send message
    const sendMutation = useMutation({
        mutationFn: ({ convId, text }) => sendMessage(convId, currentUser.id, text),
        onSuccess: (newMessage) => {
            queryClient.setQueryData(['messages', newMessage.conversation_id], (old) => {
                if (!old) return [newMessage];
                if (old.find(m => m.id === newMessage.id)) return old;
                return [...old, newMessage];
            });
            queryClient.invalidateQueries(['conversations', currentUser.id]);
        }
    });

    /**
     * Broadcast typing status to the conversation channel.
     */
    const sendTypingStatus = (conversationId, isTyping) => {
        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'typing',
                payload: { conversationId, isTyping, userId: currentUser.id },
            });
        }
    };

    const formatMessages = (messages = []) => {
        return messages.map(m => ({
            id: m.id,
            sender: m.sender_id === currentUser?.id ? 'me' : 'them',
            text: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    };

    return {
        conversations,
        isConvLoading,
        sendMessage: (convId, text) => sendMutation.mutate({ convId, text }),
        sendTypingStatus,
        typingStatus,
        formatMessages,
        isSending: sendMutation.isPending
    };
};