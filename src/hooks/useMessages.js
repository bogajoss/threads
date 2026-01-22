import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, sendMessage } from '@/services/api';
import { supabase } from '@/lib/supabase';

/**
 * Custom hook to manage messages and conversations with realtime updates.
 */
export const useMessages = (currentUser) => {
    const queryClient = useQueryClient();
    const [realtimeMessagesMap, setRealtimeMessagesMap] = useState({});

    // 1. Fetch Conversations
    const { data: conversations = [], isLoading: isConvLoading } = useQuery({
        queryKey: ['conversations', currentUser?.id],
        queryFn: () => fetchConversations(currentUser?.id),
        enabled: !!currentUser?.id
    });

    // 2. Realtime subscription for ALL conversations of the user
    useEffect(() => {
        if (!currentUser?.id) return;

        const channel = supabase
            .channel(`user_messages:${currentUser.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            }, (payload) => {
                const newM = payload.new;
                setRealtimeMessagesMap(prev => ({
                    ...prev,
                    [newM.conversation_id]: [...(prev[newM.conversation_id] || []), newM]
                }));
                // Invalidate conversations to update "last message" timestamp
                queryClient.invalidateQueries(['conversations', currentUser.id]);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [currentUser, queryClient]);

    // 3. Mutation to send message
    const sendMutation = useMutation({
        mutationFn: ({ convId, text }) => sendMessage(convId, currentUser.id, text),
        onSuccess: (_, { convId }) => {
            queryClient.invalidateQueries(['messages', convId]);
        }
    });

    /**
     * Helper to get merged messages for a specific conversation.
     */
    const getMessagesForConversation = (convId, fetchedMessages = []) => {
        const realtime = realtimeMessagesMap[convId] || [];
        const combined = [...fetchedMessages];

        realtime.forEach(rm => {
            if (!combined.find(m => m.id === rm.id)) {
                combined.push(rm);
            }
        });

        return combined
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map(m => ({
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
        getMessagesForConversation,
        isSending: sendMutation.isPending
    };
};