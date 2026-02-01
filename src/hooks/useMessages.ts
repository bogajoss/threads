import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    fetchConversations,
    sendMessage,
    fetchUnreadMessagesCount,
    markMessagesAsRead,
    toggleMessageReaction,
    deleteMessage as deleteMessageApi,
    fetchReactionsByConversation,
    fetchMessages,
} from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { User, Message, Reaction } from "@/types/index";

interface FormattedMessage {
    id: string;
    sender: 'me' | 'them';
    senderAvatar?: string;
    senderName?: string;
    text: string;
    type: string;
    media: string[];
    isRead: boolean;
    replyToId: string | null;
    reactions: Reaction[];
    time: string;
}

export const useMessages = (currentUser: User | null, activeConversationId?: string) => {
    const queryClient = useQueryClient();
    const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({}); // { convId: boolean }
    const channelRef = useRef<any>(null);

    // --- Helpers defined early for use in effects ---

    const markAsRead = useCallback(
        async (convId: string) => {
            if (!currentUser?.id || !convId) return;
            try {
                await markMessagesAsRead(convId, currentUser.id);
                queryClient.invalidateQueries({ queryKey: ["unread_messages_count", currentUser.id] });
                queryClient.invalidateQueries({ queryKey: ["conversations", currentUser.id] });
            } catch (err) {
                console.error("Failed to mark as read:", err);
            }
        },
        [currentUser?.id, queryClient],
    );

    const formatMessages = useCallback((messages: Message[] = [], reactions: Reaction[] = []): FormattedMessage[] => {
        return messages.map((m) => ({
            id: m.id,
            sender: m.sender_id === currentUser?.id ? "me" : "them",
            senderAvatar: m.sender?.avatar,
            senderName: m.sender?.name,
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
    }, [currentUser?.id]);

    // 1. Fetch Conversations
    const { data: conversations = [], isLoading: isConvLoading } = useQuery({
        queryKey: ["conversations", currentUser?.id],
        queryFn: () => fetchConversations(currentUser?.id || ""),
        enabled: !!currentUser?.id,
        staleTime: 1000 * 60, // 1 minute
    });

    // 1.1 Fetch Global Unread Count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ["unread_messages_count", currentUser?.id],
        queryFn: () => fetchUnreadMessagesCount(currentUser?.id || ""),
        enabled: !!currentUser?.id,
        staleTime: 1000 * 60,
    });

    // 2. Fetch Messages (Infinite Scroll) for active conversation
    const {
        data: messagesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isMsgLoading
    } = useInfiniteQuery({
        queryKey: ["messages", activeConversationId],
        queryFn: ({ pageParam }) => fetchMessages(activeConversationId!, pageParam, 20),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 20) return undefined;
            return lastPage[lastPage.length - 1].created_at;
        },
        enabled: !!activeConversationId,
        refetchOnWindowFocus: false,
    });

    // 3. Fetch Reactions for active conversation
    const { data: conversationReactions = [] } = useQuery({
        queryKey: ["reactions", activeConversationId],
        queryFn: () => fetchReactionsByConversation(activeConversationId!),
        enabled: !!activeConversationId,
        staleTime: 1000 * 60 * 5,
    });

    // 4. Realtime subscription
    useEffect(() => {
        if (!currentUser?.id) return;

        // Channel for DB changes
        const messagesChannel = supabase
            .channel(`messages_realtime:${activeConversationId || 'global'}`)
            .on(
                // @ts-ignore
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload: any) => {
                    const newM = payload.new;
                    console.log("Realtime INSERT received:", newM);
                    
                    // 1. If it's for the current open conversation, refetch immediately
                    if (activeConversationId && newM.conversation_id === activeConversationId) {
                        queryClient.invalidateQueries({ 
                            queryKey: ["messages", activeConversationId]
                        });
                        
                        // If sent by someone else, mark as read
                        if (newM.sender_id !== currentUser.id) {
                            markAsRead(activeConversationId);
                        }
                    }

                    // 2. Always refresh conversation list to update last message/unread count
                    queryClient.invalidateQueries({
                        queryKey: ["conversations", currentUser.id]
                    });

                    // 3. Update global unread count
                    if (newM.sender_id !== currentUser.id) {
                        queryClient.invalidateQueries({
                            queryKey: ["unread_messages_count", currentUser.id],
                        });
                    }

                    // 4. Clear typing status
                    setTypingStatus((prev) => ({
                        ...prev,
                        [newM.conversation_id]: false,
                    }));
                },
            )
            .on(
                // @ts-ignore
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "messages" },
                (payload: any) => {
                    console.log("Realtime DELETE received:", payload.old.id);
                    queryClient.invalidateQueries({ queryKey: ["messages"] });
                    queryClient.invalidateQueries({
                        queryKey: ["conversations", currentUser.id],
                    });
                },
            )
            .on(
                // @ts-ignore
                "postgres_changes",
                { event: "*", schema: "public", table: "message_reactions" },
                () => {
                    if (activeConversationId) {
                        queryClient.invalidateQueries({ queryKey: ["reactions", activeConversationId] });
                    }
                },
            )
            .subscribe((status) => {
                console.log(`Supabase Realtime Status (${activeConversationId || 'global'}):`, status);
            });

        // Channel for Typing Broadcast
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
    }, [currentUser?.id, queryClient, activeConversationId, markAsRead]);

    // 5. Mutation to send message
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
            queryClient.invalidateQueries({ queryKey: ["messages", newMessage.conversation_id] });
            queryClient.invalidateQueries({ queryKey: ["conversations", currentUser!.id] });
        },
    });

    const sendTypingStatus = (conversationId: string, isTyping: boolean) => {
        if (channelRef.current && currentUser) {
            channelRef.current.send({
                type: "broadcast",
                event: "typing",
                payload: { conversationId, isTyping, userId: currentUser.id },
            });
        }
    };

    const onToggleReaction = async (messageId: string, emoji: string) => {
        if (!currentUser?.id) return;
        try {
            await toggleMessageReaction(messageId, currentUser.id, emoji);
            queryClient.invalidateQueries({ queryKey: ["reactions", activeConversationId] });
        } catch (err) {
            console.error("Failed to toggle reaction:", err);
        }
    };

    const onDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessageApi(messageId);
            queryClient.invalidateQueries({ queryKey: ["messages", activeConversationId] });
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    // Memoize the flat list of messages
    const flatMessages = useMemo(() => {
        const pages = messagesData?.pages.flatMap(page => page) || [];
        return [...pages].reverse();
    }, [messagesData]);

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
        conversationReactions,
        isSending: sendMutation.isPending,
        messages: flatMessages,
        isMsgLoading,
        fetchNextMessages: fetchNextPage,
        hasMoreMessages: hasNextPage,
        isFetchingMoreMessages: isFetchingNextPage,
    };
};