import { useState, useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { markMessagesAsRead } from "@/lib/api";
import type { User } from "@/types/index";

export const useChatRealtime = (
  currentUser: User | null,
  activeConversationId?: string,
) => {
  const queryClient = useQueryClient();
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const channelRef = useRef<any>(null);

  const markAsRead = useCallback(
    async (convId: string) => {
      if (!currentUser?.id || !convId) return;
      try {
        await markMessagesAsRead(convId);
        queryClient.invalidateQueries({
          queryKey: ["unread_messages_count", currentUser.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["conversations", currentUser.id],
        });
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    },
    [currentUser, queryClient],
  );

  useEffect(() => {
    if (!currentUser?.id) return;

    const messagesChannel = supabase
      .channel(`messages_realtime:${activeConversationId || "global"}`)
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          const newM = payload.new;

          if (
            activeConversationId &&
            newM.conversation_id === activeConversationId
          ) {
            queryClient.invalidateQueries({
              queryKey: ["messages", activeConversationId],
            });
            if (newM.sender_id !== currentUser.id) {
              markAsRead(activeConversationId);
            }
          }

          queryClient.invalidateQueries({
            queryKey: ["conversations", currentUser.id],
          });

          if (newM.sender_id !== currentUser.id) {
            queryClient.invalidateQueries({
              queryKey: ["unread_messages_count", currentUser.id],
            });
          }

          setTypingStatus((prev) => ({
            ...prev,
            [newM.conversation_id]: false,
          }));
        },
      )
      .on(
        "postgres_changes" as any,
        { event: "DELETE", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages"] });
          queryClient.invalidateQueries({
            queryKey: ["conversations", currentUser.id],
          });
        },
      )
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "message_reactions" },
        () => {
          if (activeConversationId) {
            queryClient.invalidateQueries({
              queryKey: ["reactions", activeConversationId],
            });
          }
        },
      )
      .subscribe();

    const typingChannel = supabase
      .channel("chat_typing_shared")
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const { conversationId, isTyping, userId } = payload;
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

  const sendTypingStatus = (conversationId: string, isTyping: boolean) => {
    if (channelRef.current && currentUser) {
      channelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { conversationId, isTyping, userId: currentUser.id },
      });
    }
  };

  return {
    typingStatus,
    sendTypingStatus,
    markAsRead,
  };
};
