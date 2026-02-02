import type { User } from "@/types/index";
import { useConversations } from "./useConversations";
import { useChatMessages } from "./useChatMessages";
import { useChatRealtime } from "./useChatRealtime";

export const useMessages = (currentUser: User | null, activeConversationId?: string) => {
    const {
        conversations,
        unreadCount,
        isConvLoading,
        refetchConversations
    } = useConversations(currentUser);

    const {
        messages,
        isMsgLoading,
        refetchMessages,
        fetchNextMessages,
        hasMoreMessages,
        isFetchingMoreMessages,
        sendMessage,
        isSending,
        onToggleReaction,
        onDeleteMessage,
        conversationReactions,
        formatMessages,
    } = useChatMessages(currentUser, activeConversationId);

    const {
        typingStatus,
        sendTypingStatus,
        markAsRead,
    } = useChatRealtime(currentUser, activeConversationId);

    return {
        conversations,
        unreadCount,
        isConvLoading,
        refetchConversations,
        refetchMessages,
        sendMessage,
        sendTypingStatus,
        typingStatus,
        markAsRead,
        formatMessages,
        onToggleReaction,
        onDeleteMessage,
        conversationReactions,
        isSending,
        messages,
        isMsgLoading,
        fetchNextMessages,
        hasMoreMessages,
        isFetchingMoreMessages,
    };
};
