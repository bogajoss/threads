import { useQuery } from "@tanstack/react-query";
import { fetchConversations, fetchUnreadMessagesCount } from "@/lib/api";
import type { User } from "@/types/index";

export const useConversations = (currentUser: User | null) => {
  const {
    data: conversations = [],
    isLoading: isConvLoading,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["conversations", currentUser?.id],
    queryFn: () => fetchConversations(currentUser?.id || ""),
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60,
  });

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