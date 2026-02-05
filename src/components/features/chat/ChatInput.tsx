import React, { useRef, useState } from "react";
import {
  Send,
  Smile,
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
  }, [editingMessage, setReplyingTo, textAreaRef]);

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

  const lastTypingSentRef = useRef<number>(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    if (onTyping) {
      const now = Date.now();
      // Only send "typing: true" every 3 seconds to avoid spamming
      if (now - lastTypingSentRef.current > 3000) {
        onTyping(true);
        lastTypingSentRef.current = now;
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
        lastTypingSentRef.current = 0; // Reset so next keystroke sends true immediately
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

    // Maintain focus so keyboard stays open on mobile
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 10);
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

  return (
    <div className="shrink-0 p-2 md:p-3 relative z-20">
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="flex gap-2 overflow-x-auto mx-auto mb-2 px-2 py-2 bg-white dark:bg-[#212121] rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 max-w-3xl no-scrollbar"
          >
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="relative size-20 shrink-0 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 group"
              >
                {file.type.startsWith("video/") ? (
                  <div className="size-full bg-black flex items-center justify-center">
                    <Play size={20} className="text-white opacity-50" />
                  </div>
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    className="size-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute top-1 right-1 size-6 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {(replyingTo || editingMessage) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="flex items-center justify-between mx-auto mb-1.5 px-4 py-2 bg-white dark:bg-[#212121] rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 max-w-3xl"
          >
            <div className="text-sm flex items-center gap-3 min-w-0">
              <div className="size-8 flex items-center justify-center rounded-full bg-violet-500/10 text-violet-500">
                {editingMessage ? <Edit2 size={16} /> : <Reply size={16} />}
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-bold text-violet-500 block leading-tight">
                  {editingMessage ? "Edit Message" : `Reply to ${replyingTo.sender === "me" ? "yourself" : replyingTo.senderName}`}
                </span>
                <p className="truncate text-xs text-zinc-500 dark:text-[#aaaaaa]">
                  {editingMessage ? editingMessage.text : replyingTo.text}
                </p>
              </div>
            </div>
            <button onClick={() => { setReplyingTo(null); setEditingMessage(null); if(editingMessage) setText(""); }} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10">
              <X size={18} className="text-zinc-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <div
          className={cn(
            "flex-1 flex items-center gap-1 rounded-[24px] px-1.5 py-1.5 transition-all bg-white dark:bg-[#212121] shadow-md border-0 ring-1 ring-zinc-200 dark:ring-zinc-800 focus-within:ring-violet-500/30",
            (isRecording || audioBlob) && "bg-zinc-900 ring-red-500/50"
          )}
        >
          {isRecording ? (
            <div className="flex-1 flex items-center gap-4 px-3 py-1">
              <div className="flex items-center gap-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="size-2 rounded-full bg-red-500" />
                <span className="text-[15px] font-medium tabular-nums text-red-500">
                  {formatTime(recordingTime)}
                </span>
              </div>
              <div className="flex-1 text-center text-sm text-zinc-500">Recording...</div>
              <button type="button" onClick={cancelRecording} className="p-2 text-zinc-400 hover:text-red-500">
                <Trash2 size={20} />
              </button>
            </div>
          ) : audioBlob ? (
            <div className="flex-1 flex items-center gap-3 px-3 py-1">
              <button
                type="button"
                onClick={togglePreviewPlay}
                className="size-10 flex items-center justify-center rounded-full bg-[#8774e1] text-white"
              >
                {isPreviewPlaying ? <Square size={16} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isPreviewPlaying ? "100%" : "0%" }}
                    transition={{ duration: recordingTime, ease: "linear" }}
                    className="h-full bg-[#8774e1]"
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-zinc-500">Voice message</span>
                  <span className="text-[10px] text-zinc-500 tabular-nums">{formatTime(recordingTime)}</span>
                </div>
              </div>
              <button type="button" onClick={clearAudio} className="p-2 text-zinc-400 hover:text-red-500">
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <>
              <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className="p-2 text-zinc-400 hover:text-violet-500 dark:text-[#aaaaaa] dark:hover:text-[#8774e1] transition-colors">
                    <Smile size={24} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-none bg-transparent" side="top" align="start">
                  <EmojiPicker onEmojiSelect={(emoji: any) => setText((p) => p + emoji.emoji)} />
                </PopoverContent>
              </Popover>

              <textarea
                ref={textAreaRef}
                value={text}
                onChange={handleTextChange}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Message"
                className="flex-1 bg-transparent border-none outline-none text-[16px] resize-none py-2 px-1 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-[#aaaaaa] min-h-[40px] max-h-[200px]"
                rows={1}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-zinc-400 hover:text-violet-500 dark:text-[#aaaaaa] dark:hover:text-[#8774e1] transition-colors"
              >
                <Paperclip size={24} className="-rotate-45" />
              </button>
            </>
          )}
        </div>

        {text.trim() || attachments.length > 0 || audioBlob ? (
          <button
            onClick={handleSend}
            className="size-[50px] shrink-0 flex items-center justify-center rounded-full bg-[#8774e1] text-white shadow-md hover:scale-105 transition-transform"
          >
            <Send size={24} className="ml-0.5" />
          </button>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="size-[50px] shrink-0 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:scale-105 transition-transform"
          >
            <Square size={20} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="size-[50px] shrink-0 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-[#212121] text-zinc-500 dark:text-[#aaaaaa] shadow-md hover:scale-105 transition-transform"
          >
            <Mic size={24} />
          </button>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple accept="image/*,video/*" />
    </div>
  );
};

export default ChatInput;
