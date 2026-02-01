import React from "react"
// @ts-ignore
import ChatList from "@/components/features/chat/ChatList"
// @ts-ignore
import ChatWindow from "@/components/features/chat/ChatWindow"
import { Loader2, Zap, MessageSquareDashed } from "lucide-react"
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
        onDeleteMessage,
        sendTypingStatus,
        navigate,
    } = useMessagesPage()

    if (!currentUser) {
        return (
            <div className="flex h-[100dvh] flex-col items-center justify-center gap-6 border-zinc-100 bg-white p-8 text-center dark:border-zinc-800 dark:bg-black md:h-[calc(100vh-1.5rem)] md:rounded-2xl md:border">
                <div className="rounded-3xl bg-zinc-50 p-6 dark:bg-zinc-900">
                    <Zap size={48} className="text-zinc-300 dark:text-zinc-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight dark:text-white">
                        Sign in to message
                    </h3>
                    <p className="max-w-xs text-zinc-500 font-medium">
                        Join the conversation. Sign up or log in to start chatting.
                    </p>
                </div>
            </div>
        )
    }

    if (isConvLoading) {
        return (
            <div className="flex h-[100dvh] items-center justify-center border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black md:h-[calc(100vh-1.5rem)] md:rounded-2xl md:border">
                <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
        )
    }

    return (
        <div
            className={`flex ${id ? "h-[100dvh]" : "h-[calc(100dvh-4rem)]"} overscroll-none overflow-x-hidden overflow-y-hidden bg-white shadow-2xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-black dark:shadow-none md:h-[calc(100vh-1.5rem)] md:rounded-3xl md:border md:border-zinc-200/50`}
        >
            <div
                className={`flex-col md:flex md:w-[400px] ${selectedConversation ? "hidden" : "flex"} h-full min-h-0 flex-1 md:flex-none shrink-0 bg-white dark:bg-black border-r border-zinc-100 dark:border-zinc-800 z-10`}
            >
                <div className="flex-1 min-h-0 flex flex-col">
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
                    onDeleteMessage={onDeleteMessage}
                    onTyping={(isTyping) => sendTypingStatus(selectedConversation.id, isTyping)}
                    isLoading={isMsgLoading}
                    isTyping={!!currentIsTyping}
                    isOnline={!!otherUserIsOnline}
                />
            ) : (
                <div className="hidden flex-1 flex-col items-center justify-center gap-6 text-zinc-500 md:flex bg-zinc-50/30 dark:bg-zinc-900/10">
                    <div className="relative">
                        <div className="absolute -inset-10 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10"></div>
                        <div className="relative rounded-[2.5rem] bg-white p-10 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900/50 dark:shadow-none ring-1 ring-zinc-100 dark:ring-zinc-800">
                            <MessageSquareDashed size={80} className="text-violet-500 stroke-[1.5]" />
                        </div>
                    </div>
                    <div className="text-center max-w-sm px-4 space-y-3">
                        <h3 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
                            Your Messages
                        </h3>
                        <p className="text-zinc-500 font-medium text-lg">
                            Send private photos and messages to a friend or group.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Messages
