import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, sendMessage, fetchUnreadMessagesCount, markMessagesAsRead } from '@/services/api';
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

    // 1.1 Fetch Global Unread Count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['unread_messages_count', currentUser?.id],
        queryFn: () => fetchUnreadMessagesCount(currentUser?.id),
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
                
                // Update messages cache
                queryClient.setQueryData(['messages', newM.conversation_id], (old) => {
                    if (!old) return [newM];
                    if (old.find(m => m.id === newM.id)) return old;
                    return [...old, newM];
                });

                // Update unread count if it's not my message
                if (newM.sender_id !== currentUser.id) {
                    queryClient.invalidateQueries({ queryKey: ['unread_messages_count', currentUser.id] });
                }

                queryClient.invalidateQueries(['conversations', currentUser.id]);
                setTypingStatus(prev => ({ ...prev, [newM.conversation_id]: false }));
            })
            .subscribe();

        // Channel for Typing Broadcast (shared)
        const typingChannel = supabase
            .channel('chat_typing_shared')
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                const { conversationId, isTyping, userId } = payload;
                if (userId !== currentUser.id) {
                    setTypingStatus(prev => ({ ...prev, [conversationId]: isTyping }));
                }
            })
            .subscribe();

        channelRef.current = typingChannel;

        return () => {
            supabase.removeChannel(messagesChannel);
            supabase.removeChannel(typingChannel);
        };
    }, [currentUser?.id, queryClient]);

    // 3. Mutation to send message
    const sendMutation = useMutation({
        mutationFn: ({ convId, text, type = 'text', media = [] }) => 
            sendMessage(convId, currentUser.id, text, type, media),
        onSuccess: (newMessage) => {
            // Optimistically update the message cache
            queryClient.setQueryData(['messages', newMessage.conversation_id], (old) => {
                if (!old) return [newMessage];
                if (old.find(m => m.id === newMessage.id)) return old;
                return [...old, newMessage];
            });
            // Refresh conversation list
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

    /**
     * Mark messages as read
     */
    const markAsRead = useCallback(async (convId) => {
        if (!currentUser?.id || !convId) return;
        await markMessagesAsRead(convId, currentUser.id);
        queryClient.invalidateQueries({ queryKey: ['unread_messages_count', currentUser.id] });
        queryClient.invalidateQueries({ queryKey: ['conversations', currentUser.id] });
    }, [currentUser, queryClient]);

    const formatMessages = (messages = []) => {
        return messages.map(m => ({
            id: m.id,
            sender: m.sender_id === currentUser?.id ? 'me' : 'them',
            text: m.content,
            type: m.type || 'text',
            media: m.media || [],
            isRead: m.is_read,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    };

    return {
        conversations,
        unreadCount,
        isConvLoading,
        sendMessage: (convId, text, type, media) => sendMutation.mutate({ convId, text, type, media }),
        sendTypingStatus,
        typingStatus,
        markAsRead,
        formatMessages,
        isSending: sendMutation.isPending
    };
};
