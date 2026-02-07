import React, { useState, useRef, useEffect } from "react";
import {
  Loader2,
  Check,
  CheckCheck,
  Reply as ReplyIcon,
} from "lucide-react";
import {
  TypingIndicator,
} from "@/components/ui";
import { useLightbox } from "@/context/LightboxContext";
import {
  ChatHeader,
  ChatInput,
  MessageReactions,
} from "@/components/features/chat";
import VideoPlayer from "@/components/features/post/VideoPlayer";
const VoiceMessage = React.lazy(
  () => import("@/components/features/chat/VoiceMessage"),
);
import { uploadFile } from "@/lib/api";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import {
  GroupSettingsModal,
  DMSettingsModal,
} from "@/components/features/modals";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  conversation: any;
  messages: any[];
  currentUser: any;
  onBack: () => void;
  onSendMessage: (
    convId: string,
    text: string,
    type: string,
    attachments: any[],
    replyToId?: string,
  ) => void;
  onEditMessage?: (msgId: string, text: string) => void;
  onDeleteMessage?: (msgId: string) => void;
  onToggleReaction?: (msgId: string, emoji: string) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading: boolean;
  isTyping: boolean;
  isOnline: boolean;
}

const MessageBubble = ({ 
  msg, 
  isMe, 
  isLastInGroup, 
  setReplyingTo, 
  handleImageClick,
  handleVoiceMessage,
  onDeleteMessage,
  setEditingMessage,
  onToggleReaction,
  currentUser
}: any) => {
  const x = useMotionValue(0);
  const swipeThreshold = -60;
  const replyIconOpacity = useTransform(x, [0, swipeThreshold], [0, 1]);
  const replyIconScale = useTransform(x, [0, swipeThreshold], [0.5, 1.1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < swipeThreshold) {
      setReplyingTo(msg);
      // Play a subtle haptic-like vibration if supported
      if (window.navigator.vibrate) window.navigator.vibrate(10);
    }
  };

  return (
    <motion.div
      id={`msg-${msg.id}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full group relative overflow-visible",
        isMe ? "justify-end" : "justify-start",
        isLastInGroup && "mb-3",
      )}
    >
      {/* Swipe Reply Indicator */}
      <motion.div 
        style={{ opacity: replyIconOpacity, scale: replyIconScale, right: 10 }}
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center size-10 rounded-full bg-violet-500/10 text-violet-500 z-0 pointer-events-none"
      >
        <ReplyIcon size={20} />
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: swipeThreshold - 20, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn(
          "flex max-w-[85%] md:max-w-[70%] items-end gap-1.5 z-10 touch-pan-y",
          isMe ? "flex-row-reverse" : "flex-row",
        )}
      >
        <div
          className={cn(
            "relative flex flex-col min-w-[60px]",
            isMe ? "items-end" : "items-start",
          )}
        >
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={cn(
                  "relative px-3 py-1.5 shadow-sm text-[15px] leading-[1.4] transition-all",
                  isMe
                    ? "bg-[#8774e1] text-white border border-[#7059d0]"
                    : "bg-white text-zinc-900 dark:bg-[#212121] dark:text-white",

                  "rounded-[15px]",
                  msg.isOptimistic && "opacity-60 grayscale-[0.5]",
                )}
              >
                {msg.replyTo && (
                  <div
                    className={cn(
                      "mb-1.5 -mx-1 px-2.5 py-1.5 rounded-xl text-xs border-l-2 cursor-pointer transition-all hover:opacity-80",
                      isMe
                        ? "bg-black/10 border-white/40 text-white/90"
                        : "bg-zinc-100 border-zinc-300 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      const el = document.getElementById(`msg-${msg.replyTo.id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5 opacity-75">
                      <ReplyIcon size={12} />
                      <span className="font-bold truncate">
                        {msg.replyTo.senderName === currentUser?.name ? "You" : msg.replyTo.senderName}
                      </span>
                    </div>
                    <div className="truncate opacity-90 text-[11px]">
                      {msg.replyTo.text}
                    </div>
                  </div>
                )}

                {msg.media?.length > 0 && msg.type !== "voice" && (
                  <div
                    className={cn(
                      "relative -mx-3 overflow-hidden shadow-sm",
                      !msg.replyTo && "-mt-1.5",
                      !msg.text && "-mb-1.5",
                      msg.text && "mb-1.5",
                      "rounded-[15px]",
                    )}
                  >
                    {msg.media.map((m: any, i: number) => (
                      <div
                        key={i}
                        className="relative group/media min-w-[280px] md:min-w-[400px]"
                      >
                        {msg.type === "video" ? (
                          <div className="aspect-video w-full bg-black">
                            <VideoPlayer src={m.url} poster={m.poster} />
                          </div>
                        ) : (
                          <img
                            src={m.url}
                            className="max-h-[400px] md:max-h-[500px] w-full object-cover cursor-pointer hover:brightness-95 transition-all"
                            onClick={() => handleImageClick(msg)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {msg.type === "voice" && msg.media?.[0] && (
                  <React.Suspense
                    fallback={
                      <div className="h-12 w-48 animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
                    }
                  >
                    {handleVoiceMessage(msg.media[0].url, msg.media[0].duration, isMe)}
                  </React.Suspense>
                )}

                {msg.text && msg.type !== "voice" && (
                  <div className="whitespace-pre-wrap break-words pr-12">
                    <Linkify options={{ ...linkifyOptions, className: "underline" }}>
                      {msg.text}
                    </Linkify>
                  </div>
                )}

                {(msg.text || msg.type === "voice") && (
                  <div
                    className={cn(
                      "absolute bottom-1 right-1.5 flex items-center gap-0.5 select-none",
                      isMe ? "text-white/70" : "text-[#aaaaaa]",
                    )}
                  >
                    <span className="text-[10px]">
                      {msg.isOptimistic ? "sending..." : msg.time}
                    </span>
                    {isMe && !msg.isOptimistic && (
                      msg.isRead ? <CheckCheck size={13} className="text-white" /> : <Check size={13} className="text-white/60" />
                    )}
                  </div>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onSelect={() => setReplyingTo(msg)}>
                Reply
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => navigator.clipboard.writeText(msg.text)}>
                Copy
              </ContextMenuItem>
              {isMe && (
                <ContextMenuItem onSelect={() => setEditingMessage(msg)}>
                  Edit
                </ContextMenuItem>
              )}
              <ContextMenuSeparator />
              <ContextMenuItem
                onSelect={() => onDeleteMessage?.(msg.id)}
                className="text-red-500"
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          {msg.reactions && msg.reactions.length > 0 && (
            <div className={cn("mt-1", isMe ? "mr-1" : "ml-1")}>
              <MessageReactions
                reactions={msg.reactions}
                currentUser={currentUser}
                onToggle={(e: any) => onToggleReaction?.(msg.id, e)}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUser,
  onBack,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onToggleReaction,
  onTyping,
  isLoading,
  isTyping,
  isOnline,
}) => {
  const { openLightbox } = useLightbox();
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [editingMessage, setEditingMessage] = useState<any | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, replyingTo, editingMessage]);

  const handleSendMessage = async (
    text: string,
    attachments: File[],
    audioBlob?: Blob,
    duration?: number,
  ) => {
    if (editingMessage) {
      onEditMessage?.(editingMessage.id, text);
      setEditingMessage(null);
      return;
    }

    if (audioBlob && duration) {
      try {
        const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
          type: audioBlob.type,
        });
        const result = await uploadFile(file);

        onSendMessage(
          conversation.id,
          "Voice message",
          "voice",
          [{ url: result.url, duration }],
          replyingTo?.id,
        );
      } catch (error) {
        console.error("Failed to send voice message:", error);
      }
      return;
    }

    let uploadedAttachments: any[] = [];
    if (attachments.length > 0) {
      try {
        uploadedAttachments = await Promise.all(
          attachments.map((file) => uploadFile(file)),
        );
      } catch (error) {
        console.error("Upload failed:", error);
        return;
      }
    }

    const messageType =
      uploadedAttachments.length > 0
        ? uploadedAttachments[0].type === "video"
          ? "video"
          : "image"
        : "text";

    onSendMessage(
      conversation.id,
      text,
      messageType,
      uploadedAttachments,
      replyingTo?.id,
    );
    setReplyingTo(null);
  };

  const handleImageClick = (msg: any) => {
    if (!msg.media || msg.media.length === 0) return;
    const imageUrls = msg.media.map((m: any) => m.url);
    openLightbox(imageUrls, 0);
  };

  const isNextSameSender = (index: number, msg: any) => {
    if (index === messages.length - 1) return false;
    return messages[index + 1].sender === msg.sender;
  };

  const handleVoiceMessage = (url: string, duration: number, isMe: boolean) => (
    <VoiceMessage url={url} duration={duration} isMe={isMe} />
  );

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#8774e1]/10 dark:bg-[#0f0f0f] md:border-l md:border-zinc-200/50 dark:md:border-zinc-800/50">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'url("https://web.telegram.org/a/chat-bg-pattern-light.63857502396e95c469b6.png")',
          backgroundSize: "400px",
        }}
      />

      <ChatHeader
        conversation={conversation}
        isOnline={isOnline}
        onBack={onBack}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex-1 min-h-0 overflow-hidden relative z-10">
        <div
          className="h-full overflow-y-auto px-2 md:px-12 py-4 no-scrollbar"
          ref={scrollRef}
        >
          <div className="flex flex-col min-h-full justify-end max-w-3xl mx-auto">
            {isLoading && messages.length === 0 ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-violet-500" size={32} />
              </div>
            ) : (
              <div className="flex flex-col gap-[2px]">
                {messages.map((msg, index) => {
                  const isMe = msg.sender === "me";
                  const sameSenderNext = isNextSameSender(index, msg);
                  const isLastInGroup = !sameSenderNext;

                  return (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isMe={isMe}
                      isLastInGroup={isLastInGroup}
                      setReplyingTo={setReplyingTo}
                      handleImageClick={handleImageClick}
                      handleVoiceMessage={handleVoiceMessage}
                      onDeleteMessage={onDeleteMessage}
                      setEditingMessage={setEditingMessage}
                      onToggleReaction={onToggleReaction}
                      currentUser={currentUser}
                    />
                  );
                })}
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 mt-1 ml-1">
                <div className="bg-white dark:bg-[#212121] px-4 py-2 rounded-[15px] rounded-tl-[2px] shadow-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={onTyping}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        editingMessage={editingMessage}
        setEditingMessage={setEditingMessage}
      />

      {conversation.isGroup ? (
        <GroupSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          conversation={conversation}
          onUpdate={() => {
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
  );
};

export default ChatWindow;