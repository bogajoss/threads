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
            className={`flex ${id ? "h-[100dvh]" : "h-[calc(100dvh-4rem)]"} overflow-hidden border-zinc-100 bg-white shadow-2xl dark:border-zinc-800 dark:bg-black md:h-[calc(100vh-1.5rem)] md:rounded-2xl md:border`}
        >
            <div
                className={`flex-col border-r border-zinc-100 dark:border-zinc-800 md:flex md:w-[380px] ${selectedConversation ? "hidden" : "flex"} h-full min-h-0 shrink-0 w-full bg-white dark:bg-black`}
            >
                <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
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
            </div>
            {selectedConversation ? (
                <ChatWindow
                    conversation={selectedConversation}
                    messages={localMessages}
                    onBack={() => navigate("/messages")}
                    onSendMessage={sendMessage}
                    currentUser={currentUser}
                    onTyping={(isTyping: boolean) =>
                        sendTypingStatus(selectedConversation.id, isTyping)
                    }
                    isLoading={isMsgLoading}
                    isTyping={!!currentIsTyping}
                    isOnline={!!otherUserIsOnline}
                />
            ) : (
                <div className="hidden flex-1 flex-col items-center justify-center gap-6 text-zinc-500 md:flex bg-zinc-50/50 dark:bg-zinc-900/10">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-full bg-violet-500/10 blur-xl dark:bg-violet-500/20"></div>
                        <div className="relative rounded-[2rem] bg-white p-8 shadow-2xl dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10">
                            <Mail size={64} className="text-violet-500" />
                        </div>
                    </div>
                    <div className="text-center max-w-sm px-4">
                        <h3 className="mb-2 text-2xl font-black text-zinc-900 dark:text-white">
                            Your Messages
                        </h3>
                        <p className="text-zinc-500 leading-relaxed">
                            Send private photos and messages to a friend or group.
                            Start a new chat to get started!
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Messages
