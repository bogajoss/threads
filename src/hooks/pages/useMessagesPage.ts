import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { searchUsers, getOrCreateConversation } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { usePresence } from "@/context/PresenceContext";
import { useMessages } from "@/hooks/useMessages";
import { fetchUserProfile } from "@/lib/api/users";
import Fuse from "fuse.js";

export const useMessagesPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const withUserId = searchParams.get("with"); // Profile → Message flow: lazy create
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { onlineUsers } = usePresence();
  const queryClient = useQueryClient();
  const [msgSearchQuery, setMsgSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);

  // "Pending" conversation — shown in chat UI but NOT yet saved to DB
  const [pendingUser, setPendingUser] = useState<any | null>(null);
  // Ref to store the pending user id while the conversation is being created lazily
  const pendingUserIdRef = useRef<string | null>(null);

  const {
    conversations,
    isConvLoading,
    refetchConversations,
    refetchMessages,
    sendMessage: _sendMessage,
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

  // When ?with= param is present, fetch the target user and prepare a virtual pending conversation
  useEffect(() => {
    if (!withUserId || !currentUser) {
      if (pendingUser) {
        setTimeout(() => setPendingUser(null), 0);
      }
      pendingUserIdRef.current = null;
      return;
    }

    // Check if a real conversation with this user already exists — if so, navigate to it directly
    const existing = conversations.find(
      (c: any) => !c.isGroup && c.user?.id === withUserId,
    );
    if (existing) {
      navigate(`/m/${existing.id}`, { replace: true });
      return;
    }

    // Fetch the target user to show in the virtual chat window
    pendingUserIdRef.current = withUserId;
    fetchUserProfile(withUserId, "id")
      .then((user) => {
        if (pendingUserIdRef.current === withUserId) {
          setPendingUser(user);
        }
      })
      .catch(() => {
        navigate("/m", { replace: true });
      });
  }, [withUserId, currentUser, conversations, navigate, pendingUser]);

  // Lazily create the real conversation on first send, then call the real sendMessage
  const sendMessage = useCallback(
    async (convIdOrPending: string, text: string, type: string, media: any[], replyToId?: string) => {
      // If we have a pending user (virtual conversation), create the real one first
      if (withUserId && pendingUser && !id) {
        try {
          const realConvId = await getOrCreateConversation(currentUser!.id, withUserId);
          // Invalidate so the list refreshes
          queryClient.invalidateQueries({ queryKey: ["conversations", currentUser!.id] });
          // Navigate to the real conversation
          navigate(`/m/${realConvId}`, { replace: true });
          // Now send via the underlying hook with the real ID
          await _sendMessage(realConvId, text, type, media, replyToId);
        } catch (err) {
          console.error("Failed to create conversation on first send:", err);
        }
        return;
      }
      // Normal path
      _sendMessage(convIdOrPending, text, type, media, replyToId);
    },
    [withUserId, pendingUser, id, currentUser, _sendMessage, navigate, queryClient],
  );

  const selectedConversation = useMemo(() => {
    // If we're in the ?with= flow, return a virtual conversation object
    if (withUserId && pendingUser && !id) {
      return {
        id: "pending",
        isGroup: false,
        user: pendingUser,
        messages: [],
        lastMessage: null,
        lastMessageAt: null,
      };
    }
    if (!id || conversations.length === 0) return null;
    return conversations.find((c: any) => c.id === id) || null;
  }, [id, conversations, withUserId, pendingUser]);

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
      threshold: 0.3,
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
