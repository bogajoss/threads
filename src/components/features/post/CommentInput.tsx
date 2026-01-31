import React, { useRef } from "react"
import { Image as ImageIcon, Paperclip, Loader2, X } from "lucide-react"
import Button from "@/components/ui/Button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/types"

interface CommentInputProps {
    currentUser: User | null
    newComment: string
    setNewComment: (val: string) => void
    handleSubmitComment: (e: React.MouseEvent) => void
    loading: boolean
    selectedFiles?: File[]
    setSelectedFiles?: React.Dispatch<React.SetStateAction<File[]>>
    isUploading?: boolean
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
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            if (setSelectedFiles) {
                setSelectedFiles((prev) => [...prev, ...files])
            }
        }
    }

    const removeFile = (index: number) => {
        if (setSelectedFiles) {
            setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
        }
    }

    if (!currentUser) {
        return (
            <div className="border-y border-zinc-100 bg-zinc-50/30 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/10">
                <p className="text-sm text-zinc-500">
                    Please login to join the conversation.
                </p>
            </div>
        )
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
                    <textarea
                        id="comment-input"
                        className="min-h-[60px] w-full resize-none bg-transparent text-base outline-none placeholder:text-zinc-500 dark:text-white"
                        placeholder="Post your reply..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />

                    {selectedFiles.length > 0 && (
                        <div className="mt-2 mb-2 flex flex-wrap gap-2">
                            {selectedFiles.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="relative size-20 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
                                >
                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
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
                                className="rounded-full p-2 text-violet-600 transition-colors hover:bg-violet-50 dark:hover:bg-zinc-800"
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
                            className="min-w-[70px] !w-auto px-5 py-1.5 text-sm font-bold"
                            onClick={handleSubmitComment}
                            disabled={
                                (!newComment.trim() && selectedFiles.length === 0) ||
                                loading ||
                                isUploading
                            }
                        >
                            {loading || isUploading ? (
                                <Loader2
                                    size={16}
                                    className="mx-auto animate-spin text-white"
                                />
                            ) : (
                                "Reply"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(CommentInput)
