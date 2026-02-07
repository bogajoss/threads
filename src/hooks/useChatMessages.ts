import { useCallback, useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  sendMessage,
  fetchMessages,
  toggleMessageReaction,
  deleteMessage as deleteMessageApi,
  fetchReactionsByConversation,
  editMessage as editMessageApi,
} from "@/lib/api";
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
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  } | null;
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
      return messages.map((m) => {
        const replyToId = m.reply_to_id;
        let replyTo = null;

        if (replyToId) {
          const repliedMsg = messages.find((rm) => rm.id === replyToId);
          if (repliedMsg) {
            replyTo = {
              id: repliedMsg.id,
              senderName:
                repliedMsg.sender?.name ||
                (repliedMsg.sender as any)?.display_name ||
                "Unknown",
              text:
                repliedMsg.content ||
                (repliedMsg.type === "image"
                  ? "Photo"
                  : repliedMsg.type === "video"
                    ? "Video"
                    : repliedMsg.type === "voice"
                      ? "Voice message"
                      : ""),
            };
          }
        }

        return {
          id: m.id,
          sender: m.sender_id === currentUser?.id ? "me" : "them",
          senderAvatar: m.sender?.avatar,
          senderName: m.sender?.name,
          text: m.content || "",
          type: m.type || "text",
          media: m.media ? (Array.isArray(m.media) ? m.media : [m.media]) : [],
          isRead: m.is_read || false,
          replyToId,
          replyTo,
          reactions: reactions.filter((r) => r.message_id === m.id),
          time: m.created_at
            ? new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Just now",
          updatedAt: m.updated_at,
          isOptimistic: m.isOptimistic,
        };
      });
    },
    [currentUser?.id],
  );

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

  const { data: conversationReactions = [] } = useQuery({
    queryKey: ["reactions", activeConversationId],
    queryFn: () => fetchReactionsByConversation(activeConversationId!),
    enabled: !!activeConversationId,
    staleTime: 1000 * 60 * 5,
  });

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
    }) =>
      sendMessage(convId, currentUser!.id, text, type, media as any, replyToId),

    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", activeConversationId],
      });
      const previousMessages = queryClient.getQueryData([
        "messages",
        activeConversationId,
      ]);

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
          handle: currentUser!.handle,
          name: currentUser!.name,
          avatar: currentUser!.avatar,
        } as any,
      };

      queryClient.setQueryData(
        ["messages", activeConversationId],
        (old: any) => {
          if (!old) return { pages: [[optimisticMsg]], pageParams: [null] };
          const newPages = [...old.pages];
          newPages[0] = [optimisticMsg, ...newPages[0]];
          return { ...old, pages: newPages };
        },
      );

      return { previousMessages };
    },
    onError: (_err, _newMessage, context) => {
      queryClient.setQueryData(
        ["messages", activeConversationId],
        context?.previousMessages,
      );
      addToast("Failed to send message", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", activeConversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser!.id],
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => editMessageApi(messageId, content),
    onMutate: async ({ messageId, content }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", activeConversationId],
      });
      const previousMessages = queryClient.getQueryData([
        "messages",
        activeConversationId,
      ]);

      queryClient.setQueryData(
        ["messages", activeConversationId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any[]) =>
              page.map((m: any) =>
                m.id === messageId ? { ...m, content } : m
              )
            ),
          };
        }
      );

      return { previousMessages };
    },
    onSuccess: (updatedMessage) => {
      if (!updatedMessage) return;
      queryClient.invalidateQueries({
        queryKey: ["messages", activeConversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser?.id],
      });
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(
        ["messages", activeConversationId],
        context?.previousMessages
      );
      addToast("Failed to edit message", "error");
    },
  });

  const onToggleReaction = async (messageId: string, emoji: string) => {
    if (!currentUser?.id || !activeConversationId) return;

    await queryClient.cancelQueries({
      queryKey: ["reactions", activeConversationId],
    });
    const previousReactions = queryClient.getQueryData<Reaction[]>([
      "reactions",
      activeConversationId,
    ]);

    const existingReaction = previousReactions?.find(
      (r) => r.message_id === messageId && r.user_id === currentUser.id && r.emoji === emoji
    );

    queryClient.setQueryData<Reaction[]>(
      ["reactions", activeConversationId],
      (old = []) => {
        if (existingReaction) {
          return old.filter((r) => r.id !== existingReaction.id);
        }
        const optimisticReaction: Reaction = {
          id: `temp-${Date.now()}`,
          message_id: messageId,
          user_id: currentUser.id,
          emoji,
          created_at: new Date().toISOString(),
        };
        return [...old, optimisticReaction];
      }
    );

    try {
      await toggleMessageReaction(messageId, currentUser.id, emoji);
      queryClient.invalidateQueries({
        queryKey: ["reactions", activeConversationId],
      });
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
      queryClient.setQueryData(
        ["reactions", activeConversationId],
        previousReactions
      );
      addToast("Failed to update reaction", "error");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessageApi(messageId),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", activeConversationId],
      });
      const previousMessages = queryClient.getQueryData([
        "messages",
        activeConversationId,
      ]);

      queryClient.setQueryData(
        ["messages", activeConversationId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any[]) =>
              page.filter((m: any) => m.id !== messageId)
            ),
          };
        }
      );

      return { previousMessages };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", activeConversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser?.id],
      });
    },
    onError: (_err, _messageId, context) => {
      queryClient.setQueryData(
        ["messages", activeConversationId],
        context?.previousMessages
      );
      addToast("Failed to delete message", "error");
    },
  });

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
    onDeleteMessage: (messageId: string) => deleteMutation.mutate(messageId),
    conversationReactions,
    formatMessages,
  };
};