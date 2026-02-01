import React, { useState, useRef, useEffect, useMemo } from "react"
import {
    ArrowLeft,
    MoreVertical,
    Send,
    Smile,
    Loader2,
    X,
    Check,
    CheckCheck,
    User as UserIcon,
    BellOff,
    Eraser,
    Image,
    Mic
} from "lucide-react"
import {
    Button,
    Avatar,
    AvatarImage,
    AvatarFallback,
    TypingIndicator,
} from "@/components/ui"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// @ts-ignore
import { useTimeAgo } from "@/hooks"
import { useLightbox } from "@/context/LightboxContext"
import { uploadFile } from "@/lib/api"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
    ContextMenuLabel,
} from "@/components/ui/context-menu"
import { Copy, Trash, Reply } from "lucide-react"
// @ts-ignore
import EmojiPicker from "@/components/ui/emoji-picker"
import Linkify from "linkify-react"
import { linkifyOptions } from "@/lib/linkify"
import { useNavigate } from "react-router-dom"
import type { User } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

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
    currentUser: User | null
    onTyping: (isTyping: boolean) => void
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
    currentUser,
    onTyping,
    isLoading,
    isTyping,
    isOnline,
}) => {
    const navigate = useNavigate()
    const { openLightbox } = useLightbox()
    const [text, setText] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [attachments, setAttachments] = useState<any[]>([])
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)
    const [replyingTo, setReplyingTo] = useState<any | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const lastSeenTime = useTimeAgo(conversation.user?.lastSeen)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setText(val)

        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;

        if (onTyping) {
            onTyping(true)
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false)
            }, 2000)
        }
    }

    const handleEmojiSelect = (emojiData: any) => {
        setText((prev) => prev + emojiData.emoji)
    }

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!text.trim() && attachments.length === 0) return

        if (onTyping) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            onTyping(false)
        }

        onSendMessage(
            conversation.id,
            text,
            attachments.length > 0 ? "image" : "text",
            attachments,
            replyingTo?.id
        )
        setText("")
        setAttachments([])
        setReplyingTo(null)
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        setIsUploading(true)
        try {
            const uploaded = await Promise.all(files.map((file) => uploadFile(file)))
            setAttachments((prev) => [...prev, ...uploaded])
        } catch (error) {
            console.error("Upload failed:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const removeAttachment = (url: string) => {
        setAttachments((prev) => prev.filter((a) => a.url !== url))
    }

    const handleImageClick = (msg: any) => {
        if (!msg.media || msg.media.length === 0) return
        const imageUrls = msg.media.map((m: any) => m.url)
        openLightbox(imageUrls, 0)
    }

    // Find the ID of the last message sent by 'me' to show the read receipt
    const lastMyMessageId = useMemo(() => {
        const myMessages = messages.filter((m) => m.sender === "me")
        return myMessages.length > 0 ? myMessages[myMessages.length - 1].id : null
    }, [messages])

    const findMessage = (id: string) => messages.find((m) => m.id === id)

    // Helper to check if previous message was from same sender
    const isSameSender = (index: number, msg: any) => {
        if (index === 0) return false
        return messages[index - 1].sender === msg.sender
    }

    // Helper to check if next message is from same sender (to group bubbles)
    const isNextSameSender = (index: number, msg: any) => {
        if (index === messages.length - 1) return false
        return messages[index + 1].sender === msg.sender
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-zinc-50/50 dark:bg-black/50 md:border-l md:border-zinc-100 dark:md:border-zinc-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Header */}
            <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-black/80 supports-[backdrop-filter]:bg-white/60">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        className="mr-1 -ml-2 rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
                        aria-label="Back"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="relative cursor-pointer" onClick={() => navigate(`/u/${conversation.user.handle}`)}>
                        <Avatar className="size-9 border-2 border-white shadow-sm dark:border-zinc-800">
                            <AvatarImage
                                src={conversation.user.avatar}
                                alt={conversation.user.name}
                                className="object-cover"
                            />
                            <AvatarFallback>
                                {conversation.user.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500 ring-1 ring-white/50 dark:border-black dark:ring-black/50"></span>
                        )}
                    </div>
                    <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/u/${conversation.user.handle}`)}>
                        <span className="text-sm font-bold leading-none dark:text-white">
                            {conversation.user.name}
                        </span>
                        {isOnline ? (
                            <span className="text-[10px] font-medium text-emerald-500">
                                Active now
                            </span>
                        ) : (
                            <span className="text-[10px] font-medium text-zinc-500">
                                {conversation.user.lastSeen
                                    ? `Last seen ${lastSeenTime}`
                                    : "Offline"}
                            </span>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="rounded-full p-2 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                            aria-label="More options"
                        >
                            <MoreVertical size={20} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl border-zinc-100 dark:border-zinc-800 shadow-xl bg-white/90 dark:bg-black/90 backdrop-blur-xl">
                        <DropdownMenuGroup>
                            <button
                                onClick={() => navigate(`/u/${conversation.user.handle}`)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <UserIcon size={16} />
                                <span>View Profile</span>
                            </button>
                            <DropdownMenuItem className="cursor-pointer gap-2">
                                <BellOff size={16} />
                                Mute Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer gap-2">
                                <Eraser size={16} />
                                Clear Chat
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2 text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-900/10">
                                <Trash size={16} />
                                Delete Conversation
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Messages Area */}
            <div className="flex-1 min-h-0 space-y-2 overflow-y-auto p-4 z-10" ref={scrollRef}>
                <div className="py-12 text-center">
                    <div className="relative mx-auto w-fit">
                        <Avatar className="mx-auto mb-4 size-24 border-4 border-white shadow-xl dark:border-zinc-900">
                            <AvatarImage
                                src={conversation.user.avatar}
                                alt={conversation.user.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-3xl font-bold">
                                {conversation.user.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {isOnline && (
                            <span className="absolute bottom-1 right-1 size-6 animate-in zoom-in rounded-full border-4 border-white bg-emerald-500 duration-300 dark:border-black"></span>
                        )}
                    </div>
                    <h4 className="text-xl font-bold dark:text-white">
                        {conversation.user.name}
                    </h4>
                    <p className="text-sm text-zinc-500">@{conversation.user.handle}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <span>Synced with blockchain</span>
                    </div>
                </div>

                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin text-violet-500" size={32} />
                    </div>
                ) : (
                    <div className="flex flex-col justify-end min-h-0">
                        {/* We iterate but need to reverse visual order if we want "bottom-up" stack behavior naturally, 
                             but here sticking to standard order with flex-col is fine if we scroll to bottom. 
                             Framer motion 'layout' helps when items are added. */}
                        <AnimatePresence initial={false} mode="popLayout">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender === "me"
                                const sameSenderPrev = isSameSender(index, msg)
                                const sameSenderNext = isNextSameSender(index, msg)

                                return (
                                    <motion.div
                                        layout
                                        key={msg.id}
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25,
                                            mass: 0.8
                                        }}
                                        className={`flex w-full origin-bottom ${isMe ? "justify-end" : "justify-start"} ${sameSenderNext ? "mb-[2px]" : "mb-4"}`}
                                    >
                                        <ContextMenu>
                                            <ContextMenuTrigger asChild>
                                                <div
                                                    id={`msg-${msg.id}`}
                                                    className={`group flex max-w-[75%] items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                                                >
                                                    {!isMe && !sameSenderNext && (
                                                        <Avatar className="size-8 shrink-0 border border-zinc-100 dark:border-zinc-800 transition-transform duration-300 hover:scale-110">
                                                            <AvatarImage src={conversation.user.avatar} className="object-cover" />
                                                            <AvatarFallback>{conversation.user.name?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    {!isMe && sameSenderNext && (
                                                        <div className="w-8 shrink-0" />
                                                    )}

                                                    <motion.div
                                                        layout
                                                        className={`relative p-3.5 text-[15px] shadow-sm
                                                            ${isMe
                                                                ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white"
                                                                : "bg-white text-zinc-900 shadow-zinc-200/50 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-none"
                                                            }
                                                            ${!sameSenderNext && !sameSenderPrev ? "rounded-[20px]" : ""}
                                                            ${isMe && !sameSenderNext && sameSenderPrev ? "rounded-[20px] rounded-tr-md" : ""}
                                                            ${isMe && sameSenderNext && !sameSenderPrev ? "rounded-[20px] rounded-br-md" : ""}
                                                            ${isMe && sameSenderNext && sameSenderPrev ? "rounded-[20px] rounded-r-md" : ""}
                                                            
                                                            ${!isMe && !sameSenderNext && sameSenderPrev ? "rounded-[20px] rounded-tl-md" : ""}
                                                            ${!isMe && sameSenderNext && !sameSenderPrev ? "rounded-[20px] rounded-bl-md" : ""}
                                                            ${!isMe && sameSenderNext && sameSenderPrev ? "rounded-[20px] rounded-l-md" : ""}
                                                        `}
                                                    >
                                                        {msg.replyToId && (
                                                            <div
                                                                className={`mb-2 cursor-pointer truncate rounded-xl p-2.5 text-xs backdrop-blur-sm transition-all hover:opacity-80 active:scale-95 ${isMe
                                                                    ? "bg-black/20 text-white/90"
                                                                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-300"
                                                                    }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    const el = document.getElementById(
                                                                        `msg-${msg.replyToId}`
                                                                    )
                                                                    if (el) {
                                                                        el.scrollIntoView({
                                                                            behavior: "smooth",
                                                                            block: "center",
                                                                        })
                                                                        // Subtle flash effect to indicate target
                                                                        if (el.animate) {
                                                                            el.animate([
                                                                                { transform: "scale(1)" },
                                                                                { transform: "scale(1.05)" },
                                                                                { transform: "scale(1)" }
                                                                            ], {
                                                                                duration: 300,
                                                                                easing: "ease-out"
                                                                            });
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {(() => {
                                                                    const parent = findMessage(msg.replyToId)

                                                                    // Handle missing parent message (e.g. not loaded yet)
                                                                    if (!parent) return (
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <div className="flex items-center gap-1.5 opacity-70">
                                                                                <Reply size={12} />
                                                                                <span className="font-bold">Original Message</span>
                                                                            </div>
                                                                            <span className="italic opacity-60">Message unavailable</span>
                                                                        </div>
                                                                    )

                                                                    // Handle resolved parent message
                                                                    return (
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <div className="flex items-center gap-1.5 opacity-70">
                                                                                <Reply size={12} />
                                                                                <span className="font-bold">
                                                                                    {parent.sender === "me" ? "You" : conversation.user.name}
                                                                                </span>
                                                                            </div>
                                                                            <span className="truncate block">
                                                                                {parent.text || (parent.media?.length ? "📷 Photo" : "Attachment")}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                })()}
                                                            </div>
                                                        )}

                                                        {msg.media?.length > 0 && (
                                                            <div
                                                                className="mb-2 grid cursor-pointer grid-cols-1 gap-1 overflow-hidden rounded-2xl"
                                                                onClick={() => handleImageClick(msg)}
                                                            >
                                                                {msg.media.map((m: any, i: number) => (
                                                                    <img
                                                                        key={i}
                                                                        src={m.url}
                                                                        alt=""
                                                                        className="max-h-80 w-full rounded-lg object-cover transition-all hover:scale-[1.02]"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {msg.text && (
                                                            <div className="m-0 break-words whitespace-pre-line leading-relaxed tracking-wide">
                                                                <Linkify
                                                                    options={{
                                                                        ...linkifyOptions,
                                                                        render: ({ attributes, content: text }) => {
                                                                            const { href, ...props } = attributes
                                                                            const origin = window.location.origin

                                                                            // Check if link is internal
                                                                            let internalPath = null
                                                                            if (href.startsWith("/")) {
                                                                                internalPath = href
                                                                            } else if (href.startsWith(origin)) {
                                                                                internalPath = href.replace(origin, "")
                                                                            }

                                                                            if (internalPath) {
                                                                                return (
                                                                                    <span
                                                                                        key={text}
                                                                                        {...props}
                                                                                        className={`cursor-pointer break-all font-semibold underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80 ${isMe
                                                                                            ? "text-white"
                                                                                            : "text-violet-600 dark:text-violet-400"
                                                                                            }`}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            navigate(internalPath!)
                                                                                        }}
                                                                                    >
                                                                                        {text}
                                                                                    </span>
                                                                                )
                                                                            }

                                                                            return (
                                                                                <a
                                                                                    key={text}
                                                                                    href={href}
                                                                                    {...props}
                                                                                    className={`break-all underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80 ${isMe
                                                                                        ? "text-white"
                                                                                        : "text-violet-600 dark:text-violet-400"
                                                                                        }`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                >
                                                                                    {text}
                                                                                </a>
                                                                            )
                                                                        },
                                                                    }}
                                                                >
                                                                    {msg.text}
                                                                </Linkify>
                                                            </div>
                                                        )}

                                                        {/* Read receipt / Time */}
                                                        <div
                                                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMe ? "text-white/70" : "text-zinc-400"}`}
                                                        >
                                                            {msg.time}
                                                            {isMe && msg.id === lastMyMessageId && (
                                                                <span className="ml-0.5">
                                                                    {msg.isRead ? (
                                                                        <CheckCheck size={14} className="text-white" />
                                                                    ) : (
                                                                        <Check size={14} className="text-white/70" />
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent className="w-64 rounded-2xl border-zinc-100 bg-white/90 backdrop-blur-xl shadow-2xl dark:border-zinc-800 dark:bg-black/90">
                                                <ContextMenuItem
                                                    className="cursor-pointer gap-3 px-3 py-2.5 focus:bg-zinc-50 dark:focus:bg-zinc-900"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(msg.text)
                                                    }}
                                                >
                                                    <Copy size={16} className="text-zinc-500" />
                                                    <span className="font-medium">Copy Text</span>
                                                </ContextMenuItem>
                                                <ContextMenuItem
                                                    className="cursor-pointer gap-3 px-3 py-2.5 focus:bg-zinc-50 dark:focus:bg-zinc-900"
                                                    onClick={() => setReplyingTo(msg)}
                                                >
                                                    <Reply size={16} className="text-zinc-500" />
                                                    <span className="font-medium">Reply</span>
                                                </ContextMenuItem>
                                                <ContextMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                                                <ContextMenuItem
                                                    className="cursor-pointer gap-3 px-3 py-2.5 text-rose-500 focus:bg-rose-50 focus:text-rose-500 dark:focus:bg-rose-900/20"
                                                    onClick={() => onDeleteMessage && onDeleteMessage(msg.id)}
                                                >
                                                    <Trash size={16} />
                                                    <span className="font-medium">Delete message</span>
                                                </ContextMenuItem>
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="flex justify-start pb-4 pl-1"
                    >
                        <div className="flex items-end gap-2">
                            <Avatar className="size-8 shrink-0 border border-zinc-100 dark:border-zinc-800">
                                <AvatarImage src={conversation.user.avatar} className="object-cover" />
                                <AvatarFallback>{conversation.user.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="rounded-[20px] rounded-bl-none border border-zinc-100 bg-white px-4 py-3 shadow-md shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
                                <TypingIndicator />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="shrink-0 z-30 border-t border-zinc-200/50 bg-white/80 p-3 pb-safe backdrop-blur-xl dark:border-zinc-800/50 dark:bg-black/80 md:p-4">
                <AnimatePresence>
                    {replyingTo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: "auto", opacity: 1, marginBottom: 12 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50/50 p-2 backdrop-blur-sm dark:border-violet-900/30 dark:bg-violet-900/10 mb-2"
                        >
                            <div className="min-w-0 flex-1 border-l-4 border-violet-500 pl-3">
                                <span className="mb-0.5 block text-xs font-bold text-violet-600 dark:text-violet-400">
                                    Replying to{" "}
                                    {replyingTo.sender === "me"
                                        ? "yourself"
                                        : conversation.user.name}
                                </span>
                                <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                                    {replyingTo.text || "Media Attachment"}
                                </p>
                            </div>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-violet-100 dark:hover:bg-violet-900/30"
                                aria-label="Cancel reply"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {attachments.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {attachments.map((att) => (
                            <div
                                key={att.url}
                                className="relative size-20 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800"
                            >
                                <img src={att.url} className="size-full object-cover" alt="" />
                                <button
                                    type="button"
                                    onClick={() => removeAttachment(att.url)}
                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white backdrop-blur-md transition-colors hover:bg-black"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {isUploading && (
                            <div className="flex size-20 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                                <Loader2 className="animate-spin text-violet-500" size={24} />
                            </div>
                        )}
                    </div>
                )}

                <form
                    onSubmit={handleSend}
                    className="flex items-end gap-2 rounded-[26px] border border-zinc-200 bg-zinc-50/50 p-1.5 shadow-sm transition-all focus-within:border-violet-500/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus-within:bg-black"
                >
                    <div className="flex items-center gap-0.5 pb-0.5 pl-1">
                        <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="rounded-full p-2.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-violet-600 active:scale-95 dark:hover:bg-zinc-800"
                                >
                                    <Smile size={24} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-fit border-none bg-transparent p-0 shadow-none"
                                side="top"
                                align="start"
                                sideOffset={10}
                            >
                                <EmojiPicker
                                    onEmojiSelect={(emoji: any) => {
                                        handleEmojiSelect(emoji)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-full p-2.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-violet-600 active:scale-95 dark:hover:bg-zinc-800"
                            disabled={isUploading}
                        >
                            <Image size={24} />
                        </button>
                    </div>

                    <textarea
                        className="max-h-32 min-h-[44px] w-full flex-1 resize-none bg-transparent px-2 py-3 text-[16px] outline-none placeholder:text-zinc-400 dark:text-white"
                        placeholder="Message..."
                        value={text}
                        onChange={(e: any) => handleTextChange(e)}
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSend(e)
                            }
                        }}
                    />

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                        accept="image/*"
                    />

                    <div className="pb-1 pr-1">
                        <Button
                            type="submit"
                            className={`size-11 rounded-full !p-0 transition-all active:scale-95 ${text.trim() || attachments.length > 0 ? "bg-violet-600 hover:bg-violet-700 hover:scale-105 shadow-md shadow-violet-500/20" : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800"}`}
                            disabled={(!text.trim() && attachments.length === 0) || isUploading}
                        >
                            {text.trim() || attachments.length > 0 ? (
                                <Send size={20} className="translate-x-0.5 translate-y-0.5" />
                            ) : (
                                <Mic size={22} />
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChatWindow
