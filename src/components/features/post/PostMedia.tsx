import React, { useRef } from "react";
import { X, Film, Plus } from "lucide-react";
import { MediaGrid } from "@/components/features/post";
import type { Media } from "@/types";

interface PostMediaProps {
  media?: Media[] | null;
  isEditing?: boolean;
  editedMedia?: Media[];
  setEditedMedia?: React.Dispatch<React.SetStateAction<Media[]>>;
  newFiles?: File[];
  setNewFiles?: React.Dispatch<React.SetStateAction<File[]>>;
}

const PostMedia: React.FC<PostMediaProps> = ({
  media,
  isEditing,
  editedMedia = [],
  setEditedMedia,
  newFiles = [],
  setNewFiles,
}) => {
  const editFileInputRef = useRef<HTMLInputElement>(null);

  if (isEditing && setEditedMedia && setNewFiles) {
    return (
      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {/* Existing Media */}
          {editedMedia.map((item, idx) => (
            <div
              key={`old-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              {item.type === "video" ? (
                <div className="flex size-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                  <Film size={24} className="text-zinc-400" />
                </div>
              ) : (
                <img
                  src={item.url || (item as any).src}
                  className="size-full object-cover"
                  alt=""
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditedMedia((prev) => prev.filter((_, i) => i !== idx));
                }}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {/* Newly Selected Files */}
          {newFiles.map((file, idx) => (
            <div
              key={`new-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-violet-500 bg-violet-50/10"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  className="size-full object-cover"
                  alt=""
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Film size={24} className="animate-pulse text-violet-500" />
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewFiles((prev) => prev.filter((_, i) => i !== idx));
                }}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-1 left-1 rounded bg-violet-600 px-1 text-[8px] font-bold text-white">
                NEW
              </div>
            </div>
          ))}

          {/* Add More Button */}
          {editedMedia.length + newFiles.length < 4 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                editFileInputRef.current?.click();
              }}
              className="relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zinc-200 text-zinc-400 transition-all hover:border-violet-500 hover:bg-violet-50/5 hover:text-violet-500 dark:border-zinc-800"
            >
              <Plus size={20} />
              <span className="text-[10px] font-bold">Add Media</span>
            </button>
          )}
        </div>

        <input
          type="file"
          ref={editFileInputRef}
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              setNewFiles((prev) => [...prev, ...files]);
            }
          }}
          multiple
          className="hidden"
          accept="image/*,video/*"
        />
      </div>
    );
  }

  if (!media || media.length === 0) return null;
  return <MediaGrid items={media} />;
};

export default PostMedia;
