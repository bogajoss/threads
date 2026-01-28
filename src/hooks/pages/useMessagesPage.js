import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMessages,
  searchUsers,
  getOrCreateConversation,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { usePresence } from "@/context/PresenceContext";
import { useMessages } from "@/hooks/useMessages";

export const useMessagesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { onlineUsers } = usePresence();
  const queryClient = useQueryClient();
  const [msgSearchQuery, setMsgSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);

  const {
    conversations,
    isConvLoading,
    sendMessage,
    sendTypingStatus,
    typingStatus,
    markAsRead,
    formatMessages,
    onToggleReaction,
    allReactions,
  } = useMessages(currentUser);

  // Derive selected conversation from URL ID
  const selectedConversation = useMemo(() => {
    if (!id || conversations.length === 0) return null;
    return conversations.find((c) => c.id === id) || null;
  }, [id, conversations]);

  // Mark messages as read when a conversation is viewed
  useEffect(() => {
    if (id) {
      markAsRead(id);
    }
  }, [id, markAsRead]);

  // Search for new users when query changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (msgSearchQuery.length > 1) {
        const results = await searchUsers(msgSearchQuery);
        // Filter out users we already have a conversation with
        const existingUserIds = conversations.map((c) => c.user?.id);
        setUserSearchResults(
          results.filter(
            (u) => u.id !== currentUser?.id && !existingUserIds.includes(u.id),
          ),
        );
      } else {
        setUserSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [msgSearchQuery, conversations, currentUser?.id]);

  const handleStartConversation = async (user) => {
    try {
      const convId = await getOrCreateConversation(currentUser.id, user.id);
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser.id],
      });
      setMsgSearchQuery("");
      navigate(`/messages/${convId}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const handleSelectConversation = (conv) => {
    navigate(`/messages/${conv.id}`);
  };

  // Fetch base messages for selected conversation
  const { data: fetchedMessages = [], isLoading: isMsgLoading } = useQuery({
    queryKey: ["messages", selectedConversation?.id],
    queryFn: () => fetchMessages(selectedConversation?.id),
    enabled: !!selectedConversation?.id,
  });

  const localMessages = formatMessages(fetchedMessages, allReactions);

  const filteredConversations = conversations.filter(
    (c) =>
      c.user?.name?.toLowerCase().includes(msgSearchQuery.toLowerCase()) ||
      c.user?.handle?.toLowerCase().includes(msgSearchQuery.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(msgSearchQuery.toLowerCase()),
  );

  const currentIsTyping =
    selectedConversation && typingStatus[selectedConversation.id];
  const otherUserIsOnline =
    selectedConversation && onlineUsers.has(selectedConversation.user?.id);

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
    sendMessage,
    sendTypingStatus,
    onToggleReaction,
    navigate,
  };
};
