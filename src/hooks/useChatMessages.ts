import { useCallback, useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { sendMessage, fetchMessages, toggleMessageReaction, deleteMessage as deleteMessageApi, fetchReactionsByConversation, editMessage as editMessageApi } from "@/lib/api";
import type { User, Message, Reaction } from "@/types/index";
import { useToast } from "@/context/ToastContext";

interface FormattedMessage {
  id: string;
  sender: "me" | "them";
  senderAvatar?: string;
  senderName?: string;
  text: string;
  type: string;
  media: any[];
  isRead: boolean;
  replyToId: string | null;
  reactions: Reaction[];
  time: string;
  updatedAt?: string;
  isOptimistic?: boolean;
}

export const useChatMessages = (
  currentUser: User | null,
  activeConversationId?: string,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const formatMessages = useCallback(
    (
      messages: Message[] = [],
      reactions: Reaction[] = [],
    ): FormattedMessage[] => {
      return messages.map((m) => ({
        id: m.id,
        sender: m.sender_id === currentUser?.id ? "me" : "them",
        senderAvatar: m.sender?.avatar,
        senderName: m.sender?.name,
        text: m.content || "",
        type: m.type || "text",
        media: m.media ? (Array.isArray(m.media) ? m.media : [m.media]) : [],
        isRead: m.is_read || false,
        replyToId: m.reply_to_id,
        reactions: reactions.filter((r) => r.message_id === m.id),
        time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) : "Just now",
        updatedAt: m.updated_at,
        isOptimistic: m.isOptimistic,
      }));
    },
    [currentUser?.id],
  );

  // 1. Fetch Messages (Infinite Scroll)
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMsgLoading,
    refetch: refetchMessages,
  } = useInfiniteQuery({
    queryKey: ["messages", activeConversationId],
    queryFn: ({ pageParam }) =>
      fetchMessages(activeConversationId!, pageParam, 20),
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

  // 3. Mutation to send message with Optimistic UI
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
      media?: any[];
      replyToId?: string | null;
    }) => sendMessage(convId, currentUser!.id, text, type, media as any, replyToId),
    
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ["messages", activeConversationId] });
      const previousMessages = queryClient.getQueryData(["messages", activeConversationId]);

      const optimisticMsg = {
        id: `temp-${Date.now()}`,
        conversation_id: activeConversationId,
        sender_id: currentUser!.id,
        content: newMessage.text,
        type: newMessage.type || "text",
        media: newMessage.media || [],
        reply_to_id: newMessage.replyToId,
        is_read: false,
        created_at: new Date().toISOString(),
        isOptimistic: true,
        sender: {
          id: currentUser!.id,
          username: currentUser!.handle,
          display_name: currentUser!.name,
          avatar_url: currentUser!.avatar
        } as any
      };

      queryClient.setQueryData(["messages", activeConversationId], (old: any) => {
        if (!old) return { pages: [[optimisticMsg]], pageParams: [null] };
        const newPages = [...old.pages];
        newPages[0] = [optimisticMsg, ...newPages[0]];
        return { ...old, pages: newPages };
      });

      return { previousMessages };
    },
    onError: (_err, _newMessage, context) => {
      queryClient.setQueryData(["messages", activeConversationId], context?.previousMessages);
      addToast("Failed to send message", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeConversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations", currentUser!.id] });
    },
  });

  // 4. Mutation to edit message
  const editMutation = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => editMessageApi(messageId, content),
    onSuccess: (updatedMessage) => {
      if (!updatedMessage) return;
      queryClient.invalidateQueries({
        queryKey: ["messages", activeConversationId],
      });
      // Also update last message in conversation list if needed
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser?.id],
      });
    },
    onError: () => {
      addToast("Failed to edit message", "error");
    },
  });

  const onToggleReaction = async (messageId: string, emoji: string) => {
    if (!currentUser?.id) return;
    try {
      await toggleMessageReaction(messageId, currentUser.id, emoji);
      queryClient.invalidateQueries({
        queryKey: ["reactions", activeConversationId],
      });
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
      addToast("Failed to update reaction", "error");
    }
  };

  const onDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessageApi(messageId);
      queryClient.invalidateQueries({
        queryKey: ["messages", activeConversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser?.id],
      });
    } catch (err) {
      console.error("Failed to delete message:", err);
      addToast("Failed to delete message", "error");
    }
  };

  const flatMessages = useMemo(() => {
    const pages = messagesData?.pages.flatMap((page) => page) || [];
    return [...pages].reverse();
  }, [messagesData]);

  return {
    messages: flatMessages,
    isMsgLoading,
    refetchMessages,
    fetchNextMessages: fetchNextPage,
    hasMoreMessages: hasNextPage,
    isFetchingMoreMessages: isFetchingNextPage,
    sendMessage: (
      convId: string,
      text: string,
      type?: string,
      media?: string[],
      replyToId?: string | null,
    ) => sendMutation.mutate({ convId, text, type, media, replyToId }),
    editMessage: (messageId: string, content: string) =>
      editMutation.mutate({ messageId, content }),
    isSending: sendMutation.isPending,
    isEditing: editMutation.isPending,
    onToggleReaction,
    onDeleteMessage,
    conversationReactions,
    formatMessages,
  };
};
