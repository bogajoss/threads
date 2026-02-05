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
        editMessage,
        isSending,
        isEditing,
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
        editMessage,
        sendTypingStatus,
        typingStatus,
        markAsRead,
        formatMessages,
        onToggleReaction,
        onDeleteMessage,
        conversationReactions,
        isSending,
        isEditing,
        messages,
        isMsgLoading,
        fetchNextMessages,
        hasMoreMessages,
        isFetchingMoreMessages,
    };
};
