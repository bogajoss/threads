import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { searchUsers, getOrCreateConversation } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { usePresence } from "@/context/PresenceContext";
import { useMessages } from "@/hooks/useMessages";
import Fuse from "fuse.js";

export const useMessagesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { onlineUsers } = usePresence();
  const queryClient = useQueryClient();
  const [msgSearchQuery, setMsgSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);

  const {
    conversations,
    isConvLoading,
    refetchConversations,
    refetchMessages,
    sendMessage,
    editMessage,
    sendTypingStatus,
    typingStatus,
    markAsRead,
    formatMessages,
    onDeleteMessage,
    onToggleReaction,
    conversationReactions,
    messages,
    isMsgLoading,
    fetchNextMessages,
    hasMoreMessages,
    isFetchingMoreMessages,
  } = useMessages(currentUser, id);

  const selectedConversation = useMemo(() => {
    if (!id || conversations.length === 0) return null;
    return conversations.find((c: any) => c.id === id) || null;
  }, [id, conversations]);

  useEffect(() => {
    if (id) {
      markAsRead(id);
    }
  }, [id, markAsRead]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (msgSearchQuery.length > 1) {
        const results = await searchUsers(msgSearchQuery);
        const existingUserIds = conversations.map((c: any) => c.user?.id);
        setUserSearchResults(
          results.filter(
            (u: any) =>
              u.id !== currentUser?.id && !existingUserIds.includes(u.id),
          ),
        );
      } else {
        setUserSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [msgSearchQuery, conversations, currentUser?.id]);

  const handleStartConversation = async (user: any) => {
    if (!currentUser) return;
    try {
      const convId = await getOrCreateConversation(currentUser.id, user.id);
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser.id],
      });
      setMsgSearchQuery("");
      navigate(`/m/${convId}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const handleSelectConversation = (conv: any) => {
    navigate(`/m/${conv.id}`);
  };

  const localMessages = useMemo(
    () => formatMessages(messages, conversationReactions),
    [messages, conversationReactions, formatMessages],
  );

  const filteredConversations = useMemo(() => {
    if (!msgSearchQuery.trim()) return conversations;

    const fuse = new Fuse(conversations, {
      keys: ["user.name", "user.handle", "lastMessage"],
      threshold: 0.3, // Lower is stricter, 0.3 is good for fuzzy matching
      ignoreLocation: true,
    });

    return fuse.search(msgSearchQuery).map((result) => result.item);
  }, [msgSearchQuery, conversations]);

  const currentIsTyping =
    selectedConversation && typingStatus[selectedConversation.id];
  const otherUserIsOnline =
    selectedConversation &&
    selectedConversation.user?.id &&
    onlineUsers.has(selectedConversation.user.id);

  return {
    id,
    currentUser,
    onlineUsers,
    msgSearchQuery,
    setMsgSearchQuery,
    userSearchResults,
    conversations,
    filteredConversations,
    selectedConversation,
    localMessages,
    isConvLoading,
    isMsgLoading,
    currentIsTyping,
    otherUserIsOnline,
    handleStartConversation,
    handleSelectConversation,
    refetchConversations,
    refetchMessages,
    sendMessage,
    editMessage,
    onDeleteMessage,
    sendTypingStatus,
    typingStatus,
    onToggleReaction,
    navigate,
    fetchNextMessages,
    hasMoreMessages,
    isFetchingMoreMessages,
  };
};
