import React from "react";
import ChatList from "@/components/features/chat/ChatList";
import ChatWindow from "@/components/features/chat/ChatWindow";
import { Mail, Loader2, Zap } from "lucide-react";
import { useMessagesPage } from "@/hooks";

const Messages = () => {
  const {
    id,
    currentUser,
    onlineUsers,
    msgSearchQuery,
    setMsgSearchQuery,
    userSearchResults,
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
  } = useMessagesPage();

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

  return (
    <div className={`flex ${id ? "h-[100dvh]" : "h-[calc(100dvh-4rem)]"} md:h-[calc(100vh-2rem)] bg-white dark:bg-black overflow-hidden md:rounded-xl md:border border-zinc-100 dark:border-zinc-800`}>
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
          onToggleReaction={onToggleReaction}
          currentUser={currentUser}
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