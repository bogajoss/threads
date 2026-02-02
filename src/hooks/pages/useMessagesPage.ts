import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
// @ts-ignore
import { searchUsers, getOrCreateConversation } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { usePresence } from "@/context/PresenceContext"
import { useMessages } from "@/hooks/useMessages"

export const useMessagesPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { onlineUsers } = usePresence()
    const queryClient = useQueryClient()
    const [msgSearchQuery, setMsgSearchQuery] = useState("")
    const [userSearchResults, setUserSearchResults] = useState<any[]>([])

    const {
        conversations,
        isConvLoading,
        refetchConversations,
        refetchMessages,
        sendMessage,
        sendTypingStatus,
        typingStatus,
        markAsRead,
        formatMessages,
        onDeleteMessage,
        conversationReactions,
        messages, // Flat list of messages from infinite query
        isMsgLoading,
        fetchNextMessages,
        hasMoreMessages,
        isFetchingMoreMessages,
    } = useMessages(currentUser, id) // Pass 'id' as activeConversationId

    // Derive selected conversation from URL ID
    const selectedConversation = useMemo(() => {
        if (!id || conversations.length === 0) return null
        return conversations.find((c: any) => c.id === id) || null
    }, [id, conversations])

    // Mark messages as read when a conversation is viewed
    useEffect(() => {
        if (id) {
            markAsRead(id)
        }
    }, [id, markAsRead])

    // Search for new users when query changes
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (msgSearchQuery.length > 1) {
                const results = await searchUsers(msgSearchQuery)
                // Filter out users we already have a conversation with
                const existingUserIds = conversations.map((c: any) => c.user?.id)
                setUserSearchResults(
                    results.filter(
                        (u: any) =>
                            u.id !== currentUser?.id && !existingUserIds.includes(u.id)
                    )
                )
            } else {
                setUserSearchResults([])
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [msgSearchQuery, conversations, currentUser?.id])

    const handleStartConversation = async (user: any) => {
        if (!currentUser) return
        try {
            const convId = await getOrCreateConversation(currentUser.id, user.id)
            queryClient.invalidateQueries({
                queryKey: ["conversations", currentUser.id],
            })
            setMsgSearchQuery("")
            navigate(`/messages/${convId}`)
        } catch (error) {
            console.error("Failed to start conversation:", error)
        }
    }

    const handleSelectConversation = (conv: any) => {
        navigate(`/messages/${conv.id}`)
    }

    const localMessages = useMemo(() =>
        formatMessages(messages, conversationReactions),
        [messages, conversationReactions, formatMessages]);

    const filteredConversations = conversations.filter(
        (c: any) =>
            c.user?.name?.toLowerCase().includes(msgSearchQuery.toLowerCase()) ||
            c.user?.handle?.toLowerCase().includes(msgSearchQuery.toLowerCase()) ||
            c.lastMessage?.toLowerCase().includes(msgSearchQuery.toLowerCase())
    )

    const currentIsTyping =
        selectedConversation && typingStatus[selectedConversation.id]
    const otherUserIsOnline =
        selectedConversation && selectedConversation.user?.id && onlineUsers.has(selectedConversation.user.id)

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
        onDeleteMessage,
        sendTypingStatus,
        navigate,
        // Expose infinite scroll props for ChatWindow
        fetchNextMessages,
        hasMoreMessages,
        isFetchingMoreMessages,
    }
}