import React, { useState, useRef, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { Button, Avatar, AvatarImage, AvatarFallback, TypingIndicator } from "@/components/ui";
import { useTimeAgo } from "@/hooks";
import { useLightbox } from "@/context/LightboxContext";
import { uploadFile } from "@/lib/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import { Copy, Trash, Reply } from "lucide-react";
import EmojiPicker from "@/components/ui/EmojiPicker";
import Linkify from "linkify-react";
import MessageReactionPicker from "@/components/features/chat/MessageReactionPicker";
import MessageReactions from "@/components/features/chat/MessageReactions";

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "👍"];

const ChatWindow = ({
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
  const { openLightbox } = useLightbox();
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastSeenTime = useTimeAgo(conversation.user?.lastSeen);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (onTyping) {
      // Signal that we are typing
      onTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // Set timeout to signal we stopped typing
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  const handleEmojiSelect = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() && attachments.length === 0) return;

    if (onTyping) {
      clearTimeout(typingTimeoutRef.current);
      onTyping(false);
    }

    onSendMessage(
      conversation.id,
      text,
      attachments.length > 0 ? "image" : "text",
      attachments,
      replyingTo?.id,
    );
    setText("");
    setAttachments([]);
    setReplyingTo(null);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadFile(file)));
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (url) => {
    setAttachments((prev) => prev.filter((a) => a.url !== url));
  };

  const handleImageClick = (msg) => {
    if (!msg.media || msg.media.length === 0) return;
    const imageUrls = msg.media.map((m) => m.url);
    openLightbox(imageUrls, 0);
  };

  // Find the ID of the last message sent by 'me' to show the read receipt
  const lastMyMessageId = useMemo(() => {
    const myMessages = messages.filter((m) => m.sender === "me");
    return myMessages.length > 0 ? myMessages[myMessages.length - 1].id : null;
  }, [messages]);

  const findMessage = (id) => messages.find((m) => m.id === id);

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-black md:border-l md:border-zinc-100 dark:md:border-zinc-800">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white transition-colors"
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
              <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full"></span>
            )}
          </div>
          <div>
            <div className="font-bold dark:text-white">
              {conversation.user.name}
            </div>
            {isOnline ? (
              <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Online
              </div>
            ) : (
              <div className="text-xs text-zinc-500 font-medium">
                {conversation.user.lastSeen
                  ? `Last seen ${lastSeenTime}`
                  : "Offline"}
              </div>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full dark:text-zinc-400">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        <div className="text-center py-8">
          <div className="relative w-fit mx-auto">
            <Avatar className="size-20 mx-auto mb-3 border-4 border-zinc-50 dark:border-zinc-900 shadow-sm">
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
              <span className="absolute bottom-4 right-1 size-5 bg-emerald-500 border-4 border-white dark:border-black rounded-full animate-in zoom-in duration-300"></span>
            )}
          </div>
          <h4 className="font-bold dark:text-white text-lg">
            {conversation.user.name}
          </h4>
          <p className="text-sm text-zinc-500">@{conversation.user.handle}</p>
          <p className="text-xs text-zinc-400 mt-4 max-w-xs mx-auto">
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
                  className={`flex items-end gap-2 group ${msg.sender === "me" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                                    className={`max-w-[75%] p-1 rounded-2xl text-[15px] shadow-sm relative ${msg.sender === "me" ? "bg-violet-600 text-white rounded-tr-none" : "bg-zinc-100 dark:bg-zinc-800 dark:text-white rounded-tl-none"}`}
                                  >
                                    {msg.replyToId && (
                                      <div
                                        className={`mb-2 p-2 rounded-lg border-l-4 text-xs truncate cursor-pointer ${
                                          msg.sender === "me"
                                            ? "bg-violet-500/50 border-violet-300 text-violet-100"
                                            : "bg-zinc-200/50 dark:bg-zinc-700/50 border-zinc-400 dark:border-zinc-500 text-zinc-600 dark:text-zinc-300"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const el = document.getElementById(`msg-${msg.replyToId}`);
                                          el?.scrollIntoView({ behavior: "smooth", block: "center" });
                                        }}
                                      >
                                        <span className="font-bold block mb-0.5">
                                          {findMessage(msg.replyToId)?.sender === "me"
                                            ? "You"
                                            : conversation.user.name}
                                        </span>
                                        {findMessage(msg.replyToId)?.text || "Media"}
                                      </div>
                                    )}
                                    {msg.media?.length > 0 && (
                    
                      <div
                        className="mb-2 grid gap-1 grid-cols-1 overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(msg)}
                      >
                        {msg.media.map((m, i) => (
                          <img
                            key={i}
                            src={m.url}
                            alt=""
                            className="max-h-60 w-full object-cover rounded-md hover:brightness-90 transition-all"
                          />
                        ))}
                      </div>
                    )}
                    {msg.text && (
                      <div className="m-0 leading-tight px-3 py-1 whitespace-pre-line break-words">
                        <Linkify 
                          options={{
                            attributes: {
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "underline decoration-2 underline-offset-2 hover:opacity-80 transition-opacity break-all",
                              onClick: (e) => e.stopPropagation()
                            }
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
                      className={`text-[10px] flex items-center justify-end gap-1 px-3 pb-1 ${msg.sender === "me" ? "text-violet-200" : "text-zinc-400"}`}
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
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageReactionPicker
                      onSelect={(emoji) => onToggleReaction(msg.id, emoji)}
                      currentReaction={
                        msg.reactions?.find((r) => r.user_id === currentUser?.id)
                          ?.emoji
                      }
                    />
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64 rounded-xl bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 shadow-xl">
                <ContextMenuLabel className="text-xs text-zinc-500 font-bold px-3 py-2">
                  QUICK REACTION
                </ContextMenuLabel>
                <div className="flex items-center justify-between px-2 pb-2">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => onToggleReaction(msg.id, emoji)}
                      className="text-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <ContextMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <ContextMenuItem
                  className="gap-3 px-3 py-2.5 cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900"
                  onClick={() => {
                    navigator.clipboard.writeText(msg.text);
                  }}
                >
                  <Copy size={16} className="text-zinc-500" />
                  <span className="font-medium">Copy Text</span>
                </ContextMenuItem>
                <ContextMenuItem
                  className="gap-3 px-3 py-2.5 cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900"
                  onClick={() => setReplyingTo(msg)}
                >
                  <Reply size={16} className="text-zinc-500" />
                  <span className="font-medium">Reply</span>
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <ContextMenuItem
                  className="gap-3 px-3 py-2.5 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-900/20"
                  onClick={() => onDeleteMessage(msg.id)}
                >
                  <Trash size={16} />
                  <span className="font-medium">Delete message</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-zinc-100 dark:bg-zinc-800/50 px-3 py-2 rounded-2xl rounded-tl-none border border-zinc-200/50 dark:border-zinc-700/30 shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black shrink-0">
        {replyingTo && (
          <div className="mb-3 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 block mb-1">
                Replying to{" "}
                {replyingTo.sender === "me" ? "yourself" : conversation.user.name}
              </span>
              <p className="text-sm text-zinc-500 truncate">
                {replyingTo.text || "Media"}
              </p>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((att) => (
              <div
                key={att.url}
                className="relative size-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
              >
                <img src={att.url} className="size-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => removeAttachment(att.url)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {isUploading && (
              <div className="size-16 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <Loader2 className="animate-spin text-violet-500" size={20} />
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-2xl border border-transparent focus-within:border-violet-500 transition-all"
        >
          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-2 text-zinc-500 hover:text-violet-600 transition-colors"
              >
                <Smile size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-fit p-0 border-none bg-transparent shadow-none"
              side="top"
              align="start"
              sideOffset={10}
            >
              <EmojiPicker
                onEmojiSelect={(emoji) => {
                  handleEmojiSelect(emoji);
                }}
              />
            </PopoverContent>
          </Popover>

          <input
            type="text"
            className="flex-1 min-w-0 bg-transparent border-none outline-none dark:text-white py-1 px-1"
            placeholder="Start a new message"
            value={text}
            onChange={handleTextChange}
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
            className="p-2 text-zinc-500 hover:text-violet-600 transition-colors"
            disabled={isUploading}
          >
            <Paperclip size={20} />
          </button>
          <Button
            type="submit"
            className="size-10 !p-0 rounded-xl"
            disabled={(!text.trim() && attachments.length === 0) || isUploading}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
