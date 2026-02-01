import React, { useState, useRef, useEffect, useMemo } from "react"
import {
    ArrowLeft,
    Send,
    Smile,
    Loader2,
    X,
    Check,
    CheckCheck,
    Info,
    Image as ImageIcon,
    Mic,
    Paperclip,
    Trash2,
    Square
} from "lucide-react"
import {
    Button,
    Avatar,
    AvatarImage,
    AvatarFallback,
    TypingIndicator,
} from "@/components/ui"
// @ts-ignore
import { useTimeAgo, useAudioRecorder } from "@/hooks"
import { useLightbox } from "@/context/LightboxContext"
import { VoiceMessage } from "@/components/features/chat"
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
} from "@/components/ui/context-menu"
import { Copy, Trash, Reply } from "lucide-react"
// @ts-ignore
import EmojiPicker from "@/components/ui/emoji-picker"
import Linkify from "linkify-react"
import { linkifyOptions } from "@/lib/linkify"
import { useNavigate } from "react-router-dom"
import { GroupSettingsModal, DMSettingsModal } from "@/components/features/modals"
import { motion, AnimatePresence } from "framer-motion"
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
    isLoading,
    isTyping,
    isOnline,
}) => {
    const navigate = useNavigate()
    const { openLightbox } = useLightbox()
    const [text, setText] = useState("")
    const [_isUploading, setIsUploading] = useState(false)
    const [attachments, setAttachments] = useState<any[]>([])
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)
    const [replyingTo, setReplyingTo] = useState<any | null>(null)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const lastSeenTime = useTimeAgo(conversation.user?.lastSeen)
    const {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        cancelRecording,
        audioBlob,
        clearAudio,
    } = useAudioRecorder()

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleVoiceSend = async (blob: Blob, duration: number) => {
        setIsUploading(true)
        try {
            const file = new File([blob], `voice-message-${Date.now()}.webm`, { type: blob.type })
            const result = await uploadFile(file)
            
            onSendMessage(
                conversation.id,
                "Voice message",
                "voice",
                [{ url: result.url, duration }],
                replyingTo?.id
            )
            clearAudio()
        } catch (error) {
            console.error("Failed to send voice message:", error)
        } finally {
            setIsUploading(false)
        }
    }

    // Handle sending after recording stops
    useEffect(() => {
        if (audioBlob && !isRecording) {
            handleVoiceSend(audioBlob, recordingTime)
        }
    }, [audioBlob, isRecording])

    const displayName = conversation.isGroup ? conversation.name : conversation.user?.name
    const displayAvatar = conversation.isGroup ? conversation.avatar : conversation.user?.avatar

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping, attachments, replyingTo])

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setText(val)

        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

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

        // Reset height
        const textarea = document.querySelector('textarea[name="chat-input"]') as HTMLTextAreaElement;
        if (textarea) textarea.style.height = 'auto';
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

    const handlePaste = async (e: React.ClipboardEvent) => {
        const clipboardFiles = e.clipboardData.files
        if (clipboardFiles && clipboardFiles.length > 0) {
            const imageFiles = Array.from(clipboardFiles).filter(file => file.type.startsWith("image/"))
            
            if (imageFiles.length > 0) {
                e.preventDefault()
                setIsUploading(true)
                try {
                    const uploaded = await Promise.all(imageFiles.map((file) => uploadFile(file)))
                    setAttachments((prev) => [...prev, ...uploaded])
                } catch (error) {
                    console.error("Paste upload failed:", error)
                } finally {
                    setIsUploading(false)
                }
            }
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
            {/* Header */}
            <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-zinc-100 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/75">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="mr-1 -ml-2 rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="relative cursor-pointer" onClick={() => !conversation.isGroup && conversation.user && navigate(`/u/${conversation.user.handle}`)}>
                        <Avatar className="size-10 border-2 border-white shadow-sm dark:border-zinc-800">
                            <AvatarImage
                                src={displayAvatar}
                                alt={displayName || ""}
                                className="object-cover"
                            />
                            <AvatarFallback>{displayName?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {isOnline && !conversation.isGroup && (
                            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-black"></span>
                        )}
                    </div>
                    <div className="flex flex-col cursor-pointer" onClick={() => !conversation.isGroup && conversation.user && navigate(`/u/${conversation.user.handle}`)}>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                            {displayName}
                        </h3>
                        <span className="text-[11px] font-medium text-zinc-500">
                            {conversation.isGroup ? (
                                "Group Chat"
                            ) : isOnline ? (
                                <span className="text-emerald-500">Active now</span>
                            ) : (
                                conversation.user?.lastSeen ? `Last seen ${lastSeenTime}` : "Offline"
                            )}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="rounded-full p-2.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <Info size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4" ref={scrollRef}>
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
                                {conversation.isGroup ? "Group chat on AntiGravity" : "You're friends on AntiGravity"}
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
                                                            <VoiceMessage
                                                                url={msg.media?.[0]?.url || msg.text}
                                                                duration={msg.media?.[0]?.duration}
                                                                isMe={isMe}
                                                            />
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

            {/* Input Area */}
            <div className="shrink-0 p-3 md:p-4 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800">
                <AnimatePresence>
                    {replyingTo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex items-center justify-between mb-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"
                        >
                            <div className="text-sm">
                                <span className="text-xs font-bold text-violet-500 block mb-0.5">
                                    Replying to {replyingTo.sender === "me" ? "yourself" : (replyingTo.senderName || displayName)}
                                </span>
                                <p className="line-clamp-1 text-zinc-500">{replyingTo.text}</p>
                            </div>
                            <button onClick={() => setReplyingTo(null)}><X size={16} className="text-zinc-400" /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {attachments.length > 0 && (
                    <div className="flex gap-2 mb-2 px-1">
                        {attachments.map(att => (
                            <div key={att.url} className="relative size-16 rounded-lg overflow-hidden border border-zinc-200">
                                <img src={att.url} className="size-full object-cover" />
                                <button onClick={() => removeAttachment(att.url)} className="absolute top-0 right-0 bg-black/50 text-white p-0.5"><X size={12} /></button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <form
                        className={cn(
                            "flex-1 flex items-center gap-2 rounded-[28px] px-2 py-2 transition-all duration-300 overflow-hidden border",
                            isRecording 
                                ? "bg-zinc-900 border-zinc-800 shadow-2xl scale-[1.02] ring-4 ring-red-500/10" 
                                : "bg-zinc-100 dark:bg-zinc-900 border-transparent focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-violet-200 dark:focus-within:border-violet-900"
                        )}
                        onSubmit={handleSend}
                    >
                        {isRecording ? (
                            <div className="flex-1 flex items-center gap-4 px-3 py-1">
                                <div className="flex items-center gap-2.5 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                                    <motion.div 
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="size-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                                    />
                                    <span className="text-sm font-bold tabular-nums text-red-500">
                                        {formatTime(recordingTime)}
                                    </span>
                                </div>
                                <div className="flex-1 h-6 flex items-center justify-center gap-1 opacity-80">
                                    {[...Array(16)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ 
                                                height: [4, 12, 6, 16, 4],
                                                opacity: [0.3, 1, 0.3] 
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.6,
                                                delay: i * 0.04,
                                            }}
                                            className="w-1 bg-white rounded-full"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={cancelRecording}
                                    className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-0.5 ml-1">
                                    <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                                        <PopoverTrigger asChild>
                                            <button type="button" className="p-2 text-zinc-400 hover:text-yellow-500 transition-colors">
                                                <Smile size={22} />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 border-none bg-transparent shadow-none" side="top" align="start">
                                            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                        </PopoverContent>
                                    </Popover>

                                    <button 
                                        type="button"
                                        className="p-2 text-zinc-400 hover:text-violet-600 transition-colors rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <ImageIcon size={22} />
                                    </button>
                                    
                                    <button type="button" className="hidden sm:block p-2 text-zinc-400 hover:text-violet-600 transition-colors rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800">
                                        <Paperclip size={20} />
                                    </button>
                                </div>

                                <textarea
                                    name="chat-input"
                                    value={text}
                                    onChange={handleTextChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    onPaste={handlePaste}
                                    placeholder="Message..."
                                    className="flex-1 bg-transparent border-none outline-none text-[15px] resize-none max-h-32 py-2.5 min-h-[40px] text-zinc-900 dark:text-white placeholder:text-zinc-500"
                                    rows={1}
                                />
                            </>
                        )}

                        {text.trim() || attachments.length > 0 ? (
                            <button type="submit" className="p-2 mr-1 rounded-full bg-violet-600 text-white hover:bg-violet-700 hover:scale-105 transition-all shadow-sm">
                                <Send size={18} className="translate-x-0.5 translate-y-0.5" />
                            </button>
                        ) : isRecording ? (
                            <button
                                type="button"
                                onClick={stopRecording}
                                className="p-2.5 mr-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-110 active:scale-95"
                            >
                                <Square size={16} fill="currentColor" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={startRecording}
                                className="p-2 mr-1 text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                <Mic size={22} />
                            </button>
                        )}
                    </form>

                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple accept="image/*" />
                </div>
            </div>

            {conversation.isGroup ? (
                <GroupSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    conversation={conversation}
                    onUpdate={(_data) => {
                        // This updates the local component state if needed, 
                        // but React Query usually handles the refresh.
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
