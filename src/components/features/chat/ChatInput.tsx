import React, { useRef, useState } from "react";
import {
  Send,
  Smile,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Square,
  Play,
  Edit2,
  Reply,
  X,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from "@/components/ui/emoji-picker";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAutoResizeTextArea } from "@/hooks/useAutoResizeTextArea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (
    text: string,
    attachments: File[],
    audioBlob?: Blob,
    duration?: number,
  ) => void;
  onTyping: (isTyping: boolean) => void;
  replyingTo: any | null;
  setReplyingTo: (msg: any | null) => void;
  editingMessage: any | null;
  setEditingMessage: (msg: any | null) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTyping,
  replyingTo,
  setReplyingTo,
  editingMessage,
  setEditingMessage,
}) => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const textAreaRef = useAutoResizeTextArea(text);

  // Handle editing pre-fill
  React.useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text);
      setReplyingTo(null);
      if (textAreaRef.current) textAreaRef.current.focus();
    }
  }, [editingMessage]);

  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    cancelRecording,
    audioBlob,
    audioUrl,
    clearAudio,
  } = useAudioRecorder();

  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (audioBlob) {
      onSendMessage("", [], audioBlob, recordingTime);
      clearAudio();
      return;
    }

    if (!text.trim() && attachments.length === 0) return;

    if (onTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTyping(false);
    }

    onSendMessage(text, attachments);
    setText("");
    setAttachments([]);
    setReplyingTo(null);
  };

  const togglePreviewPlay = () => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPreviewPlaying(false);
    }

    if (isPreviewPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPreviewPlaying(!isPreviewPlaying);
  };

  // Clean up audio preview when cleared
  React.useEffect(() => {
    if (!audioBlob && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPreviewPlaying(false);
    }
  }, [audioBlob]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const clipboardFiles = e.clipboardData.files;
    if (clipboardFiles && clipboardFiles.length > 0) {
      const imageFiles = Array.from(clipboardFiles).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (imageFiles.length > 0) {
        e.preventDefault();
        setAttachments((prev) => [...prev, ...imageFiles]);
      }
    }
  };

  return (
    <div className="shrink-0 p-3 md:p-4 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800">
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-between mb-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"
          >
            <div className="text-sm flex items-center gap-2">
              <Reply size={14} className="text-violet-500" />
              <div>
                <span className="text-xs font-bold text-violet-500 block mb-0.5">
                  Replying to{" "}
                  {replyingTo.sender === "me"
                    ? "yourself"
                    : replyingTo.senderName}
                </span>
                <p className="line-clamp-1 text-zinc-500">{replyingTo.text}</p>
              </div>
            </div>
            <button onClick={() => setReplyingTo(null)}>
              <X size={16} className="text-zinc-400" />
            </button>
          </motion.div>
        )}

        {editingMessage && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-between mb-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"
          >
            <div className="text-sm flex items-center gap-2">
              <Edit2 size={14} className="text-violet-500" />
              <div>
                <span className="text-xs font-bold text-violet-500 block mb-0.5">
                  Edit Message
                </span>
                <p className="line-clamp-1 text-zinc-500">
                  {editingMessage.text}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingMessage(null);
                setText("");
              }}
            >
              <X size={16} className="text-zinc-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 px-1">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="relative size-16 rounded-lg overflow-hidden border border-zinc-200"
            >
              <img
                src={URL.createObjectURL(file)}
                className="size-full object-cover"
              />
              <button
                onClick={() =>
                  setAttachments((prev) => prev.filter((_, i) => i !== idx))
                }
                className="absolute top-0 right-0 bg-black/50 text-white p-0.5"
              >
                <X size={12} />
              </button>
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
              : audioBlob
                ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 shadow-sm"
                : "bg-zinc-100 dark:bg-zinc-900 border-transparent focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-violet-200 dark:focus-within:border-violet-900",
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
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-1/2 h-full bg-white/40"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={cancelRecording}
                className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ) : audioBlob ? (
            <div className="flex-1 flex items-center gap-3 px-2 py-1">
              <button
                type="button"
                onClick={togglePreviewPlay}
                className="size-9 flex shrink-0 items-center justify-center rounded-full bg-violet-500 text-white hover:bg-violet-600 transition-colors"
              >
                {isPreviewPlaying ? (
                  <Square size={14} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <div className="flex-1 flex flex-col justify-center">
                <div className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  Voice Message Preview
                </div>
                <div className="text-[11px] font-medium text-zinc-500 tabular-nums">
                  {formatTime(recordingTime)}
                </div>
              </div>

              <button
                type="button"
                onClick={clearAudio}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-0.5 ml-1">
                <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="p-2 text-zinc-400 hover:text-yellow-500 transition-colors"
                    >
                      <Smile size={22} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0 border-none bg-transparent shadow-none"
                    side="top"
                    align="start"
                  >
                    <EmojiPicker
                      onEmojiSelect={(emoji: any) =>
                        setText((prev) => prev + emoji.emoji)
                      }
                    />
                  </PopoverContent>
                </Popover>

                <button
                  type="button"
                  className="p-2 text-zinc-400 hover:text-violet-600 transition-colors rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon size={22} />
                </button>

                <button
                  type="button"
                  className="hidden sm:block p-2 text-zinc-400 hover:text-violet-600 transition-colors rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
                >
                  <Paperclip size={20} />
                </button>
              </div>

              <textarea
                ref={textAreaRef}
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
                className="flex-1 bg-transparent border-none outline-none text-base resize-none py-2.5 min-h-[40px] text-zinc-900 dark:text-white placeholder:text-zinc-500"
                rows={1}
              />
            </>
          )}

          {text.trim() || attachments.length > 0 || audioBlob ? (
            <button
              type="submit"
              className="p-2 mr-1 rounded-full bg-violet-600 text-white hover:bg-violet-700 hover:scale-105 transition-all shadow-sm"
            >
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

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ChatInput;
