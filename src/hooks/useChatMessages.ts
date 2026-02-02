import { useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    sendMessage,
    toggleMessageReaction,
    deleteMessage as deleteMessageApi,
    fetchReactionsByConversation,
    fetchMessages,
} from "@/lib/api";
import type { User, Message, Reaction } from "@/types/index";
import { useToast } from "@/context/ToastContext";

interface FormattedMessage {
    id: string;
    sender: 'me' | 'them';
    senderAvatar?: string;
    senderName?: string;
    text: string;
    type: string;
    media: any[];
    isRead: boolean;
    replyToId: string | null;
    reactions: Reaction[];
    time: string;
}

export const useChatMessages = (currentUser: User | null, activeConversationId?: string) => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

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

    // 1. Fetch Messages (Infinite Scroll)
    const {
        data: messagesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isMsgLoading,
        refetch: refetchMessages
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

    // 2. Fetch Reactions
    const { data: conversationReactions = [] } = useQuery({
        queryKey: ["reactions", activeConversationId],
        queryFn: () => fetchReactionsByConversation(activeConversationId!),
        enabled: !!activeConversationId,
        staleTime: 1000 * 60 * 5,
    });

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
            queryClient.invalidateQueries({ queryKey: ["messages", newMessage.conversation_id] });
            queryClient.invalidateQueries({ queryKey: ["conversations", currentUser!.id] });
        },
        onError: () => {
            addToast("Failed to send message", "error");
        }
    });

    const onToggleReaction = async (messageId: string, emoji: string) => {
        if (!currentUser?.id) return;
        try {
            await toggleMessageReaction(messageId, currentUser.id, emoji);
            queryClient.invalidateQueries({ queryKey: ["reactions", activeConversationId] });
        } catch (err) {
            console.error("Failed to toggle reaction:", err);
            addToast("Failed to update reaction", "error");
        }
    };

    const onDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessageApi(messageId);
            queryClient.invalidateQueries({ queryKey: ["messages", activeConversationId] });
            queryClient.invalidateQueries({ queryKey: ["conversations", currentUser?.id] });
        } catch (err) {
            console.error("Failed to delete message:", err);
            addToast("Failed to delete message", "error");
        }
    };

    const flatMessages = useMemo(() => {
        const pages = messagesData?.pages.flatMap(page => page) || [];
        return [...pages].reverse();
    }, [messagesData]);

    return {
        messages: flatMessages,
        isMsgLoading,
        refetchMessages,
        fetchNextMessages: fetchNextPage,
        hasMoreMessages: hasNextPage,
        isFetchingMoreMessages: isFetchingNextPage,
        sendMessage: (convId: string, text: string, type?: string, media?: string[], replyToId?: string | null) =>
            sendMutation.mutate({ convId, text, type, media, replyToId }),
        isSending: sendMutation.isPending,
        onToggleReaction,
        onDeleteMessage,
        conversationReactions,
        formatMessages,
    };
};
