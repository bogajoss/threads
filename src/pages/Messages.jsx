import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatList from "@/components/features/chat/ChatList";
import ChatWindow from "@/components/features/chat/ChatWindow";
import { Mail, Loader2, Zap } from "lucide-react";
import {
  fetchMessages,
  searchUsers,
  getOrCreateConversation,
} from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { usePresence } from "@/context/PresenceContext";
import { useMessages } from "@/hooks/useMessages";

const Messages = () => {
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

  const localMessages = formatMessages(fetchedMessages);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-8 text-center bg-white dark:bg-black md:rounded-xl md:border border-zinc-100 dark:border-zinc-800">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full">
          <Zap size={40} className="text-zinc-400" />
        </div>
        <h3 className="text-xl font-bold dark:text-white">
          Sign in to message others
        </h3>
        <p className="text-zinc-500 max-w-xs">
          Start decentralized conversations with anyone on the network.
        </p>
      </div>
    );
  }

  if (isConvLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-black md:rounded-xl md:border border-zinc-100 dark:border-zinc-800">
        <Loader2 className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

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

  return (
    <div className="flex h-screen bg-white dark:bg-black overflow-hidden md:rounded-xl md:border border-zinc-100 dark:border-zinc-800">
      <div
        className={`w-full md:w-80 flex flex-col border-r border-zinc-100 dark:border-zinc-800 ${selectedConversation ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold dark:text-white">Messages</h2>
        </div>
        <ChatList
          conversations={filteredConversations}
          userResults={userSearchResults}
          onSelect={handleSelectConversation}
          onStartNew={handleStartConversation}
          selectedId={id}
          searchQuery={msgSearchQuery}
          onSearchChange={setMsgSearchQuery}
          onlineUsers={onlineUsers}
        />
      </div>
      {selectedConversation ? (
        <ChatWindow
          conversation={selectedConversation}
          messages={localMessages}
          onBack={() => navigate("/messages")}
          onSendMessage={sendMessage}
          onTyping={(isTyping) =>
            sendTypingStatus(selectedConversation.id, isTyping)
          }
          isLoading={isMsgLoading}
          isTyping={currentIsTyping}
          isOnline={otherUserIsOnline}
        />
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-zinc-500 flex-col gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-full">
            <Mail size={48} className="text-zinc-300" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Select a message
            </h3>
            <p>Choose from your existing conversations or start a new one.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
