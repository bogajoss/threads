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
  const typingTimeoutsRef = useRef<Record<string, number>>({});

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

  // Ref to track active conversation without triggering effect re-runs
  const activeConvRef = useRef<string | null>(null);

  useEffect(() => {
    activeConvRef.current = activeConversationId || null;
  }, [activeConversationId]);

  // Effect 1: Handle Messages Realtime (Global Subscription)
  useEffect(() => {
    if (!currentUser?.id) return;

    // Use a single stable channel name to prevent constant resubscription
    const messagesChannel = supabase
      .channel("global_messages_subscription")
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          const newM = payload.new;
          const currentActiveId = activeConvRef.current; // Access via ref

          // If the message belongs to the currently open chat, refresh messages
          if (
            currentActiveId &&
            newM.conversation_id === currentActiveId
          ) {
            queryClient.invalidateQueries({
              queryKey: ["messages", currentActiveId],
            });
            // Mark as read immediately if we are in this chat
            if (newM.sender_id !== currentUser.id) {
              markAsRead(currentActiveId);
            }
          }

          // Always refresh conversation list for unread counts/ordering
          queryClient.invalidateQueries({
            queryKey: ["conversations", currentUser.id],
          });

          if (newM.sender_id !== currentUser.id) {
            queryClient.invalidateQueries({
              queryKey: ["unread_messages_count", currentUser.id],
            });
          }

          // Reset typing status for this conversation
          setTypingStatus((prev) => ({
            ...prev,
            [newM.conversation_id]: false,
          }));
        },
      )
      .on(
        "postgres_changes" as any,
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload: any) => {
          const newM = payload.new;
          const currentActiveId = activeConvRef.current;

          if (
            currentActiveId &&
            newM.conversation_id === currentActiveId
          ) {
            queryClient.invalidateQueries({
              queryKey: ["messages", currentActiveId],
            });
          }
          queryClient.invalidateQueries({
            queryKey: ["conversations", currentUser.id],
          });
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
          const currentActiveId = activeConvRef.current;
          // Accessing table data from payload might be tricky for reactions as they link to messages
          // For safety, just invalidate if we have an active chat
          if (currentActiveId) {
            queryClient.invalidateQueries({
              queryKey: ["reactions", currentActiveId],
            });
            // Also invalidate messages to refresh reaction UI if embedded
            queryClient.invalidateQueries({
              queryKey: ["messages", currentActiveId],
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel).catch(() => { });
    };
  }, [currentUser?.id, queryClient, markAsRead]); // Removed activeConversationId dependency

  // Effect 2: Handle Typing Indicators (Global/Shared)
  useEffect(() => {
    if (!currentUser?.id) return;

    const typingChannel = supabase
      .channel("chat_typing_shared")
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const { conversationId, isTyping, userId } = payload;
        if (userId !== currentUser.id) {
          setTypingStatus((prev) => ({ ...prev, [conversationId]: isTyping }));

          if (typingTimeoutsRef.current[conversationId]) {
            window.clearTimeout(typingTimeoutsRef.current[conversationId]);
          }

          if (isTyping) {
            typingTimeoutsRef.current[conversationId] = window.setTimeout(
              () => {
                setTypingStatus((prev) => ({
                  ...prev,
                  [conversationId]: false,
                }));
              },
              5000,
            );
          }
        }
      })
      .subscribe();

    channelRef.current = typingChannel;

    const currentTimeouts = typingTimeoutsRef.current;

    return () => {
      supabase.removeChannel(typingChannel).catch(() => { });
      Object.values(currentTimeouts).forEach(window.clearTimeout);
    };
  }, [currentUser?.id]); // Only depends on user

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
