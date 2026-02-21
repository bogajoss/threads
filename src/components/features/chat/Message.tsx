import React from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Reply, FileText, Download } from "lucide-react";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { motion, useMotionValue, useTransform } from "framer-motion";
import VideoPlayer from "@/components/features/post/VideoPlayer";
import VoiceMessage from "./VoiceMessage";
import RichText from "@/components/ui/rich-text";

interface MessageProps {
  message: any;
  isMe: boolean;
  isLastInGroup: boolean;
  showAvatar: boolean;
  onReply: (msg: any) => void;
  onEdit?: (msg: any) => void;
  onDelete?: (msg: any) => void;
  onReaction?: (msg: any, emoji: string) => void;
}

const Message = ({
  message,
  isMe,
  isLastInGroup,
  showAvatar,
  onReply,
  onEdit,
  onDelete,
}: MessageProps) => {
  const x = useMotionValue(0);
  const swipeThreshold = -50;
  const replyIconOpacity = useTransform(x, [0, swipeThreshold], [0, 1]);
  const replyIconScale = useTransform(x, [0, swipeThreshold], [0.5, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < swipeThreshold) {
      onReply(message);
      if (window.navigator.vibrate) window.navigator.vibrate(10);
    }
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(new Date(message.updatedAt));

  return (
    <motion.div
      className={cn(
        "group relative flex w-full items-end gap-2 mb-1",
        isMe ? "justify-end" : "justify-start",
        isLastInGroup ? "mb-4" : "mb-1"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Swipe Reply Indicator */}
      <motion.div
        style={{ opacity: replyIconOpacity, scale: replyIconScale, right: 10 }}
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-400 z-0 pointer-events-none"
      >
        <Reply size={16} />
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: swipeThreshold, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn(
          "flex max-w-[75%] items-end gap-2 relative z-10",
          isMe ? "flex-row-reverse" : "flex-row"
        )}
      >
        {!isMe && (
          <div className="w-8 flex-shrink-0">
            {showAvatar ? (
              <img
                src={message.senderAvatar || "/placeholder-avatar.png"}
                alt={message.senderName}
                className="size-8 rounded-full object-cover bg-zinc-200 dark:bg-zinc-800"
              />
            ) : (
              <div className="w-8" />
            )}
          </div>
        )}

        <div className={cn("flex flex-col min-w-0", isMe ? "items-end" : "items-start")}>
          {/* Reply Preview */}
          {message.replyTo && (
            <div
              className={cn(
                "mb-1 flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 max-w-full truncate opacity-80 hover:opacity-100 cursor-pointer transition-opacity",
                isMe ? "self-end" : "self-start"
              )}
            >
              <div className="w-0.5 h-full bg-zinc-300 dark:bg-zinc-600 rounded-full" />
              <span className="font-semibold">{message.replyTo.senderName}:</span>
              <span className="truncate max-w-[150px]">{message.replyTo.text}</span>
            </div>
          )}

          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={cn(
                  "relative px-4 py-2 text-[15px] leading-relaxed break-words",
                  isMe
                    ? "rounded-2xl rounded-tr-sm bg-violet-600 text-white dark:bg-violet-600"
                    : "rounded-2xl rounded-tl-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
                  message.isOptimistic && "opacity-70"
                )}
              >
                {/* Media Attachments */}
                {message.media && message.media.length > 0 && (
                  <div className={cn("mb-2 -mx-2 -mt-2 overflow-hidden rounded-xl", message.text ? "mb-2" : "-mb-2")}>
                    {message.media.map((item: any, idx: number) => (
                      <div key={idx} className="relative">
                        {(item.type === 'video' || (typeof item.url === 'string' && item.url.endsWith('.mp4'))) ? (
                          <VideoPlayer src={item.url} />
                        ) : (item.type === 'audio' || item.type === 'voice' || (typeof item.url === 'string' && (item.url.endsWith('.webm') || item.url.endsWith('.mp3')))) ? (
                          <div className="px-2 py-1">
                            <VoiceMessage url={item.url} isMe={isMe} duration={item.duration} />
                          </div>
                        ) : (item.type === 'image' || (typeof item.url === 'string' && (item.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)))) ? (
                          <img src={item.url} className="w-full h-auto object-cover max-h-[300px]" alt="Attachment" />
                        ) : (
                          // Generic File
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border hover:bg-black/5 transition-colors",
                              isMe ? "border-white/20 bg-white/10" : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                            )}
                          >
                            <div className={cn(
                              "p-2 rounded-full",
                              isMe ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800"
                            )}>
                              <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name || "Attachment"}</p>
                              <p className="text-xs opacity-70">{item.size ? `${(item.size / 1024).toFixed(0)} KB` : "File"}</p>
                            </div>
                            <Download size={16} className="opacity-70" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Special case for top-level message type='voice' if media is strings or structure differs */}
                {message.type === 'voice' && (!message.media || message.media.length === 0) && (
                  <div className="py-1">
                    <p className="text-xs opacity-70 italic">Voice message unavailable</p>
                  </div>
                )}


                <RichText
                  content={message.text}
                  className={cn(isMe ? "text-white" : "text-zinc-900 dark:text-zinc-100")}
                />

                {/* Timestamp & Status */}
                <div className={cn(
                  "mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70",
                  isMe ? "text-white/80" : "text-zinc-500 dark:text-zinc-400"
                )}>
                  <span>{formattedTime}</span>
                  {isMe && (
                    <span>
                      {message.isRead ? <CheckCheck size={12} /> : <Check size={12} />}
                    </span>
                  )}
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem onClick={() => onReply(message)}>Reply</ContextMenuItem>
              {message.text && <ContextMenuItem onClick={() => navigator.clipboard.writeText(message.text)}>Copy</ContextMenuItem>}
              {isMe && (
                <>
                  <ContextMenuSeparator />
                  {onEdit && message.type === 'text' && <ContextMenuItem onClick={() => onEdit(message)}>Edit</ContextMenuItem>}
                  {onDelete && <ContextMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(message)}>Delete</ContextMenuItem>}
                </>
              )}
            </ContextMenuContent>
          </ContextMenu>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={cn(
              "mt-1 flex flex-wrap gap-1",
              isMe ? "justify-end" : "justify-start"
            )}>
              {message.reactions.map((reaction: any, idx: number) => (
                <span key={idx} className="px-1.5 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(Message);
