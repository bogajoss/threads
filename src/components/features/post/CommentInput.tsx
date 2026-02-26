import React, { useRef, useMemo, useEffect, useState } from "react";
import { Paperclip, X, Mic, Square, Trash2, Play } from "lucide-react";
import { MediaIcon, ShareIcon } from "@/components/ui";
import Button from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

interface CommentInputProps {
  currentUser: User | null;
  newComment: string;
  setNewComment: (val: string) => void;
  handleSubmitComment: (e?: React.MouseEvent, audioData?: { blob: Blob; duration: number }) => void;
  loading: boolean;
  selectedFiles?: File[];
  setSelectedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  isUploading?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({
  currentUser,
  newComment,
  setNewComment,
  handleSubmitComment,
  loading,
  selectedFiles = [],
  setSelectedFiles,
  isUploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    audioBlob,
    audioUrl,
    clearAudio,
  } = useAudioRecorder();

  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioBlob && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      if (isPreviewPlaying) {
        setIsPreviewPlaying(false);
      }
    }
  }, [audioBlob, isPreviewPlaying]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (setSelectedFiles) {
        setSelectedFiles((prev) => [...prev, ...files]);
      }
    }
  };

  const removeFile = (index: number) => {
    if (setSelectedFiles) {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Create stable preview URLs from files, revoke them when files change or component unmounts
  const previewUrls = useMemo(
    () => selectedFiles.map((file) => URL.createObjectURL(file)),
     
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = e.clipboardData.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (imageFiles.length > 0) {
        e.preventDefault();
        if (setSelectedFiles) {
          setSelectedFiles((prev) => [...prev, ...imageFiles]);
        }
      }
    }
  };

  const handleSend = (e: React.MouseEvent) => {
    if (audioBlob) {
      handleSubmitComment(e, { blob: audioBlob, duration: recordingTime });
      clearAudio();
    } else {
      handleSubmitComment(e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentUser) {
    return (
      <div className="border-y border-zinc-100 bg-zinc-50/30 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/10">
        <p className="text-sm text-zinc-500">
          Please login to join the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="border-y border-zinc-100 bg-zinc-50/30 p-4 dark:border-zinc-800 dark:bg-zinc-900/10">
      <div className="flex gap-3">
        <Avatar className="size-9 border border-zinc-200 dark:border-zinc-700">
          <AvatarImage
            src={currentUser.avatar}
            alt={currentUser.handle}
            className="object-cover"
          />
          <AvatarFallback>
            {currentUser.handle?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          {isRecording ? (
            <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-900/20 rounded-xl px-4 py-3 animate-pulse">
              <div className="flex items-center gap-3 text-violet-600">
                <div className="size-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono font-bold">{formatTime(recordingTime)}</span>
              </div>
              <button 
                onClick={stopRecording}
                className="text-violet-600 hover:scale-110 transition-transform"
              >
                <Square size={20} fill="currentColor" />
              </button>
            </div>
          ) : audioUrl ? (
            <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2">
               <div className="flex items-center gap-3">
                 <button
                    type="button"
                    onClick={togglePreviewPlay}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white transition-all hover:bg-violet-600"
                  >
                    {isPreviewPlaying ? (
                      <Square size={16} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Voice Message
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
              </div>
              <button 
                onClick={clearAudio}
                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <textarea
              id="comment-input"
              className="min-h-[60px] w-full resize-none bg-transparent text-base outline-none placeholder:text-zinc-500 dark:text-white"
              placeholder="Post your reply..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onPaste={handlePaste}
            />
          )}

          {selectedFiles.length > 0 && (
            <div className="mt-2 mb-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative size-20 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={previewUrls[idx]}
                      className="size-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                      <Paperclip size={20} className="text-zinc-500" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <div className="flex gap-1 text-violet-600">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording || !!audioUrl}
                className="rounded-full p-2 text-violet-600 transition-colors hover:bg-violet-50 dark:hover:bg-zinc-800 disabled:opacity-30"
                title="Attach media"
              >
                <MediaIcon size={20} />
              </button>
              
              {!audioUrl && (
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`rounded-full p-2 transition-colors ${
                    isRecording 
                      ? "bg-red-50 text-red-600 animate-pulse" 
                      : "text-violet-600 hover:bg-violet-50 dark:hover:bg-zinc-800"
                  }`}
                  title={isRecording ? "Stop recording" : "Record voice comment"}
                >
                  <Mic size={20} className={isRecording ? "fill-current" : ""} />
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
                accept="image/*,video/*,application/pdf"
              />
            </div>
            <Button
              variant={loading || isUploading ? "primary" : "animated"}
              icon={!(loading || isUploading) && <ShareIcon size={20} />}
              className="min-w-[70px] !w-auto"
              onClick={handleSend}
              loading={loading || isUploading}
              disabled={( !newComment.trim() && selectedFiles.length === 0 && !audioBlob) || isRecording}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentInput);
