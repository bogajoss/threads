import React, { useState, useRef, useEffect, useMemo } from "react"
import {
    Loader2,
    Check,
    CheckCheck,
    Reply,
    Trash,
    Copy
} from "lucide-react"
import {
    Button,
    Avatar,
    AvatarImage,
    AvatarFallback,
    TypingIndicator,
} from "@/components/ui"
import { useLightbox } from "@/context/LightboxContext"
// @ts-ignore
import { ChatHeader, ChatInput } from "@/components/features/chat"
const VoiceMessage = React.lazy(() => import("@/components/features/chat/VoiceMessage"))
import PullToRefresh from "@/components/ui/PullToRefresh"
import { uploadFile } from "@/lib/api"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"
import Linkify from "linkify-react"
import { linkifyOptions } from "@/lib/linkify"
import { GroupSettingsModal, DMSettingsModal } from "@/components/features/modals"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatWindowProps {
    conversation: any
    messages: any[]
    onBack: () => void
    onSendMessage: (
        convId: string,
        text: string,
        type: string,
        attachments: any[],
        replyToId?: string
    ) => void
    onDeleteMessage?: (msgId: string) => void
    onTyping: (isTyping: boolean) => void
    onRefresh?: () => Promise<any>
    isLoading: boolean
    isTyping: boolean
    isOnline: boolean
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    conversation,
    messages,
    onBack,
    onSendMessage,
    onDeleteMessage,
    onTyping,
    onRefresh,
    isLoading,
    isTyping,
    isOnline,
}) => {
    const { openLightbox } = useLightbox()
    const [replyingTo, setReplyingTo] = useState<any | null>(null)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const displayName = conversation.isGroup ? conversation.name : conversation.user?.name
    const displayAvatar = conversation.isGroup ? conversation.avatar : conversation.user?.avatar

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping, replyingTo])

    const handleSendMessage = async (text: string, attachments: File[], audioBlob?: Blob, duration?: number) => {
        if (audioBlob && duration) {
            try {
                const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: audioBlob.type })
                const result = await uploadFile(file)
                
                onSendMessage(
                    conversation.id,
                    "Voice message",
                    "voice",
                    [{ url: result.url, duration }],
                    replyingTo?.id
                )
            } catch (error) {
                console.error("Failed to send voice message:", error)
            }
            return
        }

        let uploadedAttachments: any[] = []
        if (attachments.length > 0) {
            try {
                uploadedAttachments = await Promise.all(attachments.map((file) => uploadFile(file)))
            } catch (error) {
                console.error("Upload failed:", error)
                return
            }
        }

        onSendMessage(
            conversation.id,
            text,
            uploadedAttachments.length > 0 ? "image" : "text",
            uploadedAttachments,
            replyingTo?.id
        )
        setReplyingTo(null)
    }

    const handleImageClick = (msg: any) => {
        if (!msg.media || msg.media.length === 0) return
        const imageUrls = msg.media.map((m: any) => m.url)
        openLightbox(imageUrls, 0)
    }

    const lastMyMessageId = useMemo(() => {
        const myMessages = messages.filter((m) => m.sender === "me")
        return myMessages.length > 0 ? myMessages[myMessages.length - 1].id : null
    }, [messages])

    const findMessage = (id: string) => messages.find((m) => m.id === id)

    const isSameSender = (index: number, msg: any) => {
        if (index === 0) return false
        return messages[index - 1].sender === msg.sender
    }

    const isNextSameSender = (index: number, msg: any) => {
        if (index === messages.length - 1) return false
        return messages[index + 1].sender === msg.sender
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-white/50 dark:bg-black/50 md:border-l md:border-zinc-200/50 dark:md:border-zinc-800/50">
            <ChatHeader 
                conversation={conversation}
                isOnline={isOnline}
                onBack={onBack}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Messages Area */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <PullToRefresh
                    onRefresh={onRefresh || (async () => {})}
                    disabled={!onRefresh}
                    className="h-full"
                >
                    <div className="h-full overflow-y-auto px-3 md:px-4 py-4" ref={scrollRef}>
                        <div className="flex flex-col min-h-full justify-end">

                            {/* Intro Section */}
                    {messages.length < 5 && (
                        <div className="py-12 flex flex-col items-center justify-center opacity-80 mb-auto">
                            <Avatar className="size-24 border-4 border-zinc-100 dark:border-zinc-800 mb-4 bg-zinc-50 dark:bg-zinc-900">
                                <AvatarImage src={displayAvatar} className="object-cover" />
                                <AvatarFallback className="text-4xl">{displayName?.[0]}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold dark:text-white">{displayName}</h2>
                            <p className="text-zinc-500 text-sm mb-4">
                                {conversation.isGroup ? "Group chat on Sysm" : "You're friends on Sysm"}
                            </p>
                            {!conversation.isGroup && (
                                <Button variant="outline" className="rounded-full h-8 text-xs">
                                    View Profile
                                </Button>
                            )}
                        </div>
                    )}

                    {isLoading && messages.length === 0 ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin text-violet-500" size={32} />
                        </div>
                    ) : (
                        <div className="space-y-[2px]">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender === "me"
                                const sameSenderPrev = isSameSender(index, msg)
                                const sameSenderNext = isNextSameSender(index, msg)

                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={cn(
                                            "flex w-full",
                                            isMe ? "justify-end" : "justify-start",
                                            !sameSenderNext && "mb-4"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex max-w-[75%] md:max-w-[65%] items-end gap-2 group",
                                            isMe ? "flex-row-reverse" : "flex-row"
                                        )}>
                                            {/* Avatar for other user */}
                                            {!isMe && (
                                                <div className="w-7 shrink-0">
                                                    {!sameSenderNext ? (
                                                        <Avatar className="size-7 border border-zinc-100 shadow-sm dark:border-zinc-800">
                                                            <AvatarImage src={msg.senderAvatar || displayAvatar} />
                                                            <AvatarFallback>{(msg.senderName || displayName)?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                    ) : null}
                                                </div>
                                            )}

                                            <ContextMenu>
                                                <ContextMenuTrigger>
                                                    <div className={cn(
                                                        "relative px-4 py-2.5 shadow-sm text-[15px] leading-[1.4]",
                                                        isMe
                                                            ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                                                            : "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white border border-zinc-200/50 dark:border-zinc-700/50",
                                                        // Corner Rounding Logic
                                                        !sameSenderNext && !sameSenderPrev && "rounded-[22px]",
                                                        isMe && !sameSenderNext && sameSenderPrev && "rounded-[22px] rounded-tr-md",
                                                        isMe && sameSenderNext && !sameSenderPrev && "rounded-[22px] rounded-br-md",
                                                        isMe && sameSenderNext && sameSenderPrev && "rounded-[22px] rounded-r-md",
                                                        !isMe && !sameSenderNext && sameSenderPrev && "rounded-[22px] rounded-tl-md",
                                                        !isMe && sameSenderNext && !sameSenderPrev && "rounded-[22px] rounded-bl-md",
                                                        !isMe && sameSenderNext && sameSenderPrev && "rounded-[22px] rounded-l-md"
                                                    )}>
                                                        {msg.replyToId && (
                                                            <div className={cn(
                                                                "mb-1.5 -mx-1 px-3 py-1.5 rounded-xl text-xs border-l-2 cursor-pointer",
                                                                isMe ? "bg-black/10 border-white/40 text-white/90" : "bg-zinc-100 border-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:border-zinc-500 dark:text-zinc-300"
                                                            )}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    const el = document.getElementById(`msg-${msg.replyToId}`)
                                                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-1.5 mb-0.5 opacity-75">
                                                                    <Reply size={10} />
                                                                    <span className="font-bold">Reply</span>
                                                                </div>
                                                                <div className="truncate opacity-90">
                                                                    {findMessage(msg.replyToId)?.text || "Attachment"}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {msg.media?.length > 0 && msg.type !== "voice" && (
                                                            <div className="grid gap-1 mb-1 overflow-hidden rounded-lg">
                                                                {msg.media.map((m: any, i: number) => (
                                                                    <img
                                                                        key={i}
                                                                        src={m.url}
                                                                        className="max-h-64 object-cover w-full rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                                                        onClick={() => handleImageClick(msg)}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {msg.type === "voice" ? (
                                                            <React.Suspense fallback={
                                                                <div className="flex h-[36px] w-[220px] items-center gap-3 py-1.5 opacity-50">
                                                                    <div className="size-11 shrink-0 rounded-full bg-zinc-200 animate-pulse dark:bg-zinc-700" />
                                                                    <div className="flex-1 h-2 bg-zinc-200 animate-pulse dark:bg-zinc-700 rounded" />
                                                                </div>
                                                            }>
                                                                <VoiceMessage
                                                                    url={msg.media?.[0]?.url || msg.text}
                                                                    duration={msg.media?.[0]?.duration}
                                                                    isMe={isMe}
                                                                />
                                                            </React.Suspense>
                                                        ) : (
                                                            <div className="whitespace-pre-wrap break-words">
                                                                <Linkify options={{ ...linkifyOptions, className: isMe ? "text-white underline" : "text-violet-600 dark:text-violet-400 underline" }}>
                                                                    {msg.text}
                                                                </Linkify>
                                                            </div>
                                                        )}

                                                        {/* Time & Read Status */}
                                                        {(!sameSenderNext || true) && (
                                                            <div className={cn(
                                                                "flex justify-end items-center gap-1 mt-0.5 select-none",
                                                                isMe ? "text-white/70" : "text-zinc-400"
                                                            )}>
                                                                <span className="text-[9px] font-medium">{msg.time}</span>
                                                                {isMe && msg.id === lastMyMessageId && (
                                                                    msg.isRead
                                                                        ? <CheckCheck size={12} className="text-white" />
                                                                        : <Check size={12} className="text-white/60" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent className="w-48">
                                                    <ContextMenuItem onClick={() => { navigator.clipboard.writeText(msg.text) }}>
                                                        <Copy size={14} className="mr-2" /> Copy
                                                    </ContextMenuItem>
                                                    <ContextMenuItem onClick={() => setReplyingTo(msg)}>
                                                        <Reply size={14} className="mr-2" /> Reply
                                                    </ContextMenuItem>
                                                    <ContextMenuSeparator />
                                                    <ContextMenuItem className="text-red-500" onClick={() => onDeleteMessage && onDeleteMessage(msg.id)}>
                                                        <Trash size={14} className="mr-2" /> Delete
                                                    </ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}

                    {isTyping && (
                        <div className="flex items-center gap-2 mt-2 ml-9">
                            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 rounded-[22px] rounded-tl-md">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                </div>
            </div>
                </PullToRefresh>
            </div>

            <ChatInput 
                onSendMessage={handleSendMessage}
                onTyping={onTyping}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
            />

            {conversation.isGroup ? (
                <GroupSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    conversation={conversation}
                    onUpdate={(_data) => {
                        setIsSettingsOpen(false);
                    }}
                />
            ) : (
                <DMSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    user={conversation.user}
                    conversationId={conversation.id}
                />
            )}
        </div>
    )
}

export default ChatWindow
