import React, { useState, useRef, useEffect, useMemo } from "react"
import {
    ArrowLeft,
    MoreVertical,
    Send,
    Smile,
    Paperclip,
    Loader2,
    X,
    Check,
    CheckCheck,
    User,
    BellOff,
    Eraser,
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
// @ts-ignore
import MessageReactionPicker from "@/components/features/chat/MessageReactionPicker"
// @ts-ignore
import MessageReactions from "@/components/features/chat/MessageReactions"
import { linkifyOptions } from "@/lib/linkify"
import { useNavigate } from "react-router-dom"
import type { User } from "@/types"

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "👍"]

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
    onToggleReaction: (msgId: string, emoji: string) => void
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
    onToggleReaction,
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

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setText(val)

        if (onTyping) {
            // Signal that we are typing
            onTyping(true)

            // Clear existing timeout
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

            // Set timeout to signal we stopped typing
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false)
            }, 2000)
        }
    }

    const handleEmojiSelect = (emojiData: any) => {
        setText((prev) => prev + emojiData.emoji)
    }

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
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

    return (
        <div className="flex h-full min-w-0 flex-1 flex-col bg-white dark:bg-black md:border-l md:border-zinc-100 dark:md:border-zinc-800">
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-zinc-100 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="rounded-full p-1 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800 md:hidden"
                        aria-label="Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                        <Avatar className="size-10 border border-zinc-200 dark:border-zinc-700">
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
                            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-black"></span>
                        )}
                    </div>
                    <div>
                        <div className="font-bold dark:text-white">
                            {conversation.user.name}
                        </div>
                        {isOnline ? (
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                                Online
                            </div>
                        ) : (
                            <div className="text-xs font-medium text-zinc-500">
                                {conversation.user.lastSeen
                                    ? `Last seen ${lastSeenTime}`
                                    : "Offline"}
                            </div>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button 
                            className="rounded-full p-2 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            aria-label="More options"
                        >
                            <MoreVertical size={20} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuItem 
                                className="cursor-pointer gap-2"
                                onClick={() => navigate(`/u/${conversation.user.handle}`)}
                            >
                                <User size={16} />
                                View Profile
                            </DropdownMenuItem>
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
                            <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2">
                                <Trash size={16} />
                                Delete Conversation
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4" ref={scrollRef}>
                <div className="py-8 text-center">
                    <div className="relative mx-auto w-fit">
                        <Avatar className="mx-auto mb-3 size-20 border-4 border-zinc-50 shadow-sm dark:border-zinc-900">
                            <AvatarImage
                                src={conversation.user.avatar}
                                alt={conversation.user.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-2xl font-bold">
                                {conversation.user.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {isOnline && (
                            <span className="absolute bottom-4 right-1 size-5 animate-in zoom-in rounded-full border-4 border-white bg-emerald-500 duration-300 dark:border-black"></span>
                        )}
                    </div>
                    <h4 className="text-lg font-bold dark:text-white">
                        {conversation.user.name}
                    </h4>
                    <p className="text-sm text-zinc-500">@{conversation.user.handle}</p>
                    <p className="mx-auto mt-4 max-w-xs text-xs text-zinc-400">
                        This is the beginning of your direct message history with{" "}
                        <span className="font-bold">@{conversation.user.handle}</span>
                    </p>
                </div>

                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin text-violet-500" size={32} />
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ContextMenu key={msg.id}>
                            <ContextMenuTrigger asChild>
                                <div
                                    id={`msg-${msg.id}`}
                                    className={`group flex items-end gap-2 ${msg.sender === "me" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div
                                        className={`relative max-w-[75%] rounded-2xl p-1 text-[15px] shadow-sm ${msg.sender === "me" ? "rounded-tr-none bg-violet-600 text-white" : "rounded-tl-none bg-zinc-100 dark:bg-zinc-800 dark:text-white"}`}
                                    >
                                        {msg.replyToId && (
                                            <div
                                                className={`mb-2 cursor-pointer truncate rounded-lg border-l-4 p-2 text-xs ${msg.sender === "me"
                                                    ? "border-violet-300 bg-violet-500/50 text-violet-100"
                                                    : "border-zinc-400 bg-zinc-200/50 text-zinc-600 dark:border-zinc-500 dark:bg-zinc-700/50 dark:text-zinc-300"
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const el = document.getElementById(
                                                        `msg-${msg.replyToId}`
                                                    )
                                                    el?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "center",
                                                    })
                                                }}
                                            >
                                                <span className="mb-0.5 block font-bold">
                                                    {findMessage(msg.replyToId)?.sender === "me"
                                                        ? "You"
                                                        : conversation.user.name}
                                                </span>
                                                {findMessage(msg.replyToId)?.text || "Media"}
                                            </div>
                                        )}
                                        {msg.media?.length > 0 && (
                                            <div
                                                className="mb-2 grid cursor-pointer grid-cols-1 gap-1 overflow-hidden rounded-lg"
                                                onClick={() => handleImageClick(msg)}
                                            >
                                                {msg.media.map((m: any, i: number) => (
                                                    <img
                                                        key={i}
                                                        src={m.url}
                                                        alt=""
                                                        className="max-h-60 w-full rounded-md object-cover transition-all hover:brightness-90"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {msg.text && (
                                            <div className="m-0 break-words whitespace-pre-line px-3 py-1 leading-tight">
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
                                                                        className={`cursor-pointer break-all font-semibold underline decoration-1 underline-offset-4 transition-opacity ${msg.sender === "me"
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
                                                                    className={`break-all underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80 ${msg.sender === "me"
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

                                        {msg.reactions?.length > 0 && (
                                            <MessageReactions
                                                reactions={msg.reactions}
                                                currentUser={currentUser}
                                                onToggle={(emoji) => onToggleReaction(msg.id, emoji)}
                                            />
                                        )}

                                        <div
                                            className={`flex items-center justify-end gap-1 px-3 pb-1 text-[10px] ${msg.sender === "me" ? "text-violet-200" : "text-zinc-400"}`}
                                        >
                                            {msg.time}
                                            {msg.sender === "me" && msg.id === lastMyMessageId && (
                                                <span className="ml-0.5">
                                                    {msg.isRead ? (
                                                        <CheckCheck size={14} className="text-white" />
                                                    ) : (
                                                        <Check size={14} className="text-violet-200" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                        <MessageReactionPicker
                                            onSelect={(emoji) => onToggleReaction(msg.id, emoji)}
                                            currentReaction={
                                                msg.reactions?.find(
                                                    (r: any) => r.user_id === currentUser?.id
                                                )?.emoji
                                            }
                                        />
                                    </div>
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-64 rounded-xl border-zinc-100 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                                <ContextMenuLabel className="px-3 py-2 text-xs font-bold text-zinc-500">
                                    QUICK REACTION
                                </ContextMenuLabel>
                                <div className="flex items-center justify-between px-2 pb-2">
                                    {QUICK_EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => onToggleReaction(msg.id, emoji)}
                                            className="rounded-full p-2 text-xl transition-all hover:bg-zinc-100 active:scale-125 dark:hover:bg-zinc-800"
                                            aria-label={`React with ${emoji}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <ContextMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
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
                    ))
                )}

                {isTyping && (
                    <div className="flex animate-in fade-in slide-in-from-bottom-2 justify-start duration-300">
                        <div className="rounded-2xl rounded-tl-none border border-zinc-200/50 bg-zinc-100 px-3 py-2 shadow-sm dark:border-zinc-700/30 dark:bg-zinc-800/50">
                            <TypingIndicator />
                        </div>
                    </div>
                )}
            </div>

            <div className="shrink-0 border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                {replyingTo && (
                    <div className="mb-3 flex animate-in slide-in-from-bottom-2 items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3 duration-200 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="min-w-0 flex-1">
                            <span className="mb-1 block text-xs font-bold text-violet-600 dark:text-violet-400">
                                Replying to{" "}
                                {replyingTo.sender === "me"
                                    ? "yourself"
                                    : conversation.user.name}
                            </span>
                            <p className="truncate text-sm text-zinc-500">
                                {replyingTo.text || "Media"}
                            </p>
                        </div>
                        <button
                            onClick={() => setReplyingTo(null)}
                            className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
                            aria-label="Cancel reply"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {attachments.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {attachments.map((att) => (
                            <div
                                key={att.url}
                                className="relative size-16 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
                            >
                                <img src={att.url} className="size-full object-cover" alt="" />
                                <button
                                    type="button"
                                    onClick={() => removeAttachment(att.url)}
                                    className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white transition-colors hover:bg-black"
                                    aria-label="Remove attachment"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {isUploading && (
                            <div className="flex size-16 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                                <Loader2 className="animate-spin text-violet-500" size={20} />
                            </div>
                        )}
                    </div>
                )}

                <form
                    onSubmit={handleSend}
                    className="flex items-center gap-2 rounded-2xl border border-transparent bg-zinc-100 p-2 transition-all focus-within:border-violet-500 dark:bg-zinc-900"
                >
                    <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="p-2 text-zinc-500 transition-colors hover:text-violet-600"
                                aria-label="Add emoji"
                            >
                                <Smile size={20} />
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

                    <input
                        type="text"
                        className="min-w-0 flex-1 border-none bg-transparent px-1 py-1 outline-none dark:text-white"
                        placeholder="Start a new message"
                        value={text}
                        onChange={handleTextChange}
                        aria-label="Message text"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                        accept="image/*"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-zinc-500 transition-colors hover:text-violet-600"
                        disabled={isUploading}
                        aria-label="Attach file"
                    >
                        <Paperclip size={20} />
                    </button>
                    <Button
                        type="submit"
                        className="size-10 rounded-xl !p-0"
                        disabled={(!text.trim() && attachments.length === 0) || isUploading}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChatWindow
