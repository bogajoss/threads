import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchConversations,
    sendMessage,
    fetchUnreadMessagesCount,
    markMessagesAsRead,
    toggleMessageReaction,
    deleteMessage as deleteMessageApi,
    fetchAllReactions,
} from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { User, Message, Reaction } from "@/types/index";

interface FormattedMessage {
    id: string;
    sender: 'me' | 'them';
    text: string;
    type: string;
    media: string[];
    isRead: boolean;
    replyToId: string | null;
    reactions: Reaction[];
    time: string;
}

export const useMessages = (currentUser: User | null) => {
    const queryClient = useQueryClient();
    const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({}); // { convId: boolean }
    const channelRef = useRef<any>(null);

    // 1. Fetch Conversations
    const { data: conversations = [], isLoading: isConvLoading } = useQuery({
        queryKey: ["conversations", currentUser?.id],
        queryFn: () => fetchConversations(currentUser?.id || ""),
        enabled: !!currentUser?.id,
    });

    // 1.1 Fetch Global Unread Count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ["unread_messages_count", currentUser?.id],
        queryFn: () => fetchUnreadMessagesCount(currentUser?.id || ""),
        enabled: !!currentUser?.id,
    });

    const { data: _allReactions = [] } = useQuery({
        queryKey: ["reactions"],
        queryFn: fetchAllReactions,
        enabled: !!currentUser?.id,
    });

    // 2. Realtime subscription (Messages + Typing + Reactions)
    useEffect(() => {
        if (!currentUser?.id) return;

        // Channel for DB changes (private to user)
        const messagesChannel = supabase
            .channel(`user_messages:${currentUser.id}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload: any) => {
                    const newM = payload.new;
                    queryClient.setQueryData(
                        ["messages", newM.conversation_id],
                        (old: Message[] | undefined) => {
                            if (!old) return [newM];
                            if (old.find((m) => m.id === newM.id)) return old;
                            return [...old, newM];
                        },
                    );
                    if (newM.sender_id !== currentUser.id) {
                        queryClient.invalidateQueries({
                            queryKey: ["unread_messages_count", currentUser.id],
                        });
                    }
                    queryClient.invalidateQueries({
                        queryKey: ["conversations", currentUser.id]
                    });
                    setTypingStatus((prev) => ({
                        ...prev,
                        [newM.conversation_id]: false,
                    }));
                },
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "messages" },
                (_payload: any) => {
                    // const _oldM = payload.old;
                    // Optimistically update all message caches or wait for refetch
                    // Invalidate messages for the likely conversation
                    queryClient.invalidateQueries({ queryKey: ["messages"] });
                    queryClient.invalidateQueries({
                        queryKey: ["conversations", currentUser.id],
                    });
                },
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "message_reactions" },
                () => {
                    // Simplest: invalidate all reactions or use payload to find conversation
                    // Since we don't have convId in payload directly without join,
                    // we might need to invalidate conversation reactions.
                    queryClient.invalidateQueries({ queryKey: ["reactions"] });
                },
            )
            .subscribe();

        // Channel for Typing Broadcast (shared)
        const typingChannel = supabase
            .channel("chat_typing_shared")
            .on("broadcast", { event: "typing" }, ({ payload: _payload }: { payload: any }) => {
                const { conversationId, isTyping, userId } = _payload;
                if (userId !== currentUser.id) {
                    setTypingStatus((prev) => ({ ...prev, [conversationId]: isTyping }));
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
        mutationFn: ({
            convId,
            text,
            type = "text",
            media = [],
            replyToId = null,
        }: {
            convId: string;
            text: string;
            type?: string;
            media?: string[];
            replyToId?: string | null;
        }) => sendMessage(convId, currentUser!.id, text, type, media, replyToId),
        onSuccess: (newMessage: Message | null) => {
            if (!newMessage) return;
            // Optimistically update the message cache
            queryClient.setQueryData(
                ["messages", newMessage.conversation_id],
                (old: Message[] | undefined) => {
                    if (!old) return [newMessage];
                    if (old.find((m) => m.id === newMessage.id)) return old;
                    return [...old, newMessage];
                },
            );
            // Refresh conversation list
            queryClient.invalidateQueries({
                queryKey: ["conversations", currentUser!.id]
            });
        },
    });

    /**
     * Broadcast typing status to the conversation channel.
     */
    const sendTypingStatus = (conversationId: string, isTyping: boolean) => {
        if (channelRef.current && currentUser) {
            channelRef.current.send({
                type: "broadcast",
                event: "typing",
                payload: { conversationId, isTyping, userId: currentUser.id },
            });
        }
    };

    /**
     * Mark messages as read
     */
    const markAsRead = useCallback(
        async (convId: string) => {
            if (!currentUser?.id || !convId) return;
            await markMessagesAsRead(convId, currentUser.id);
            queryClient.invalidateQueries({
                queryKey: ["unread_messages_count", currentUser.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["conversations", currentUser.id],
            });
        },
        [currentUser, queryClient],
    );

    const onToggleReaction = async (messageId: string, emoji: string) => {
        if (!currentUser?.id) return;
        try {
            await toggleMessageReaction(messageId, currentUser.id, emoji);
            // Invalidate query to trigger UI update (realtime will also catch it)
            queryClient.invalidateQueries({ queryKey: ["reactions"] });
        } catch (err) {
            console.error("Failed to toggle reaction:", err);
        }
    };

    const onDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessageApi(messageId);
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const formatMessages = (messages: Message[] = [], reactions: Reaction[] = []): FormattedMessage[] => {
        return messages.map((m) => ({
            id: m.id,
            sender: m.sender_id === currentUser?.id ? "me" : "them",
            text: m.content,
            type: m.type || "text",
            media: m.media ? (Array.isArray(m.media) ? m.media : [m.media]) : [],
            isRead: m.is_read,
            replyToId: m.reply_to_id,
            reactions: reactions.filter((r) => r.message_id === m.id),
            time: new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        }));
    };

    return {
        conversations,
        unreadCount,
        isConvLoading,
        sendMessage: (convId: string, text: string, type?: string, media?: string[], replyToId?: string | null) =>
            sendMutation.mutate({ convId, text, type, media, replyToId }),
        sendTypingStatus,
        typingStatus,
        markAsRead,
        formatMessages,
        onToggleReaction,
        onDeleteMessage,
        allReactions: _allReactions,
        isSending: sendMutation.isPending,
    };
};
