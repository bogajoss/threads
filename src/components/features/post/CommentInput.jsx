import React, { useRef } from "react";
import { Image as ImageIcon, Paperclip, Loader2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CommentInput = ({
  currentUser,
  newComment,
  setNewComment,
  handleSubmitComment,
  loading,
  selectedFiles = [],
  setSelectedFiles,
  isUploading,
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (setSelectedFiles) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    if (setSelectedFiles) {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  if (!currentUser) {
    return (
      <div className="p-6 text-center border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
        <p className="text-zinc-500 text-sm">
          Please login to join the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
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
          <textarea
            id="comment-input"
            className="w-full bg-transparent outline-none text-base min-h-[60px] resize-none dark:text-white placeholder:text-zinc-500"
            placeholder="Post your reply..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative size-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      className="size-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                      <Paperclip size={20} className="text-zinc-500" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex text-violet-600 gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-violet-600 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full p-2 transition-colors"
                title="Attach media"
              >
                <ImageIcon size={20} />
              </button>
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
              className="!w-auto px-5 py-1.5 text-sm font-bold min-w-[70px]"
              onClick={handleSubmitComment}
              disabled={(!newComment.trim() && selectedFiles.length === 0) || loading || isUploading}
            >
              {loading || isUploading ? (
                <Loader2
                  size={16}
                  className="animate-spin text-white mx-auto"
                />
              ) : (
                "Reply"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
