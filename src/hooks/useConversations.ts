import { useQuery } from "@tanstack/react-query";
import { fetchConversations, fetchUnreadMessagesCount } from "@/lib/api";
import type { User } from "@/types/index";

export const useConversations = (currentUser: User | null) => {
  // 1. Fetch Conversations
  const {
    data: conversations = [],
    isLoading: isConvLoading,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["conversations", currentUser?.id],
    queryFn: () => fetchConversations(currentUser?.id || ""),
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60, // 1 minute
  });

  // 2. Fetch Global Unread Count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread_messages_count", currentUser?.id],
    queryFn: () => fetchUnreadMessagesCount(currentUser?.id || ""),
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60,
  });

  return {
    conversations,
    unreadCount,
    isConvLoading,
    refetchConversations,
  };
};
