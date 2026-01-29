import React from "react"
// @ts-ignore
import ChatList from "@/components/features/chat/ChatList"
// @ts-ignore
import ChatWindow from "@/components/features/chat/ChatWindow"
import { Mail, Loader2, Zap } from "lucide-react"
// @ts-ignore
import { useMessagesPage } from "@/hooks"

const Messages: React.FC = () => {
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
    } = useMessagesPage()

    if (!currentUser) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 border-zinc-100 bg-white p-8 text-center dark:border-zinc-800 dark:bg-black md:rounded-xl md:border">
                <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                    <Zap size={40} className="text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">
                    Sign in to message others
                </h3>
                <p className="max-w-xs text-zinc-500">
                    Start decentralized conversations with anyone on the network.
                </p>
            </div>
        )
    }

    if (isConvLoading) {
        return (
            <div className="flex h-screen items-center justify-center border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black md:rounded-xl md:border">
                <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
        )
    }

    return (
        <div
            className={`flex ${id ? "h-[100dvh]" : "h-[calc(100dvh-4rem)]"} overflow-hidden border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black md:h-[calc(100vh-2rem)] md:rounded-xl md:border`}
        >
            <div
                className={`w-full flex-col border-r border-zinc-100 dark:border-zinc-800 md:flex md:w-80 ${selectedConversation ? "hidden" : "flex"}`}
            >
                <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
                    <h2 className="text-xl font-bold dark:text-white">Messages</h2>
                </div>
                <ChatList
                    conversations={filteredConversations}
                    userResults={userSearchResults}
                    onSelect={handleSelectConversation}
                    onStartNew={handleStartConversation}
                    selectedId={id ?? null}
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
                    onTyping={(isTyping: boolean) =>
                        sendTypingStatus(selectedConversation.id, isTyping)
                    }
                    isLoading={isMsgLoading}
                    isTyping={!!currentIsTyping}
                    isOnline={!!otherUserIsOnline}
                />
            ) : (
                <div className="hidden flex-1 flex-col items-center justify-center gap-4 text-zinc-500 md:flex">
                    <div className="rounded-full bg-zinc-50 p-6 dark:bg-zinc-900">
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
    )
}

export default Messages
