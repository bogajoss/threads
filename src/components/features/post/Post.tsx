import React, { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
    MessageCircle,
    Repeat2,
    Heart,
    MoreHorizontal,
    Loader2,
    Flag,
    UserMinus,
    X,
    Plus,
    Film,
    Pencil,
    Share,
    Trash,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    VerifiedIcon,
    ShareIcon,
    ChatIcon,
    ChevronTagIcon,
} from "@/components/ui"
import Linkify from "linkify-react"
import { linkifyOptions } from "@/lib/linkify"
// @ts-ignore
import {
    PollDisplay,
    QuotedPost,
    ActionButton,
    MediaGrid,
    CommentInput,
    LinkPreview,
    ShareModal,
} from "@/components/features/post"
import { usePostInteraction } from "@/hooks"
// @ts-ignore
import { usePosts } from "@/context/PostContext"
import { fetchCommentsByPostId, addComment, uploadFile, deleteComment, updateComment } from "@/lib/api"
import { isBangla, extractUrl, cn } from "@/lib/utils"
// @ts-ignore
import { Textarea } from "@/components/ui/textarea"
import type { User, Media, CommunityShort } from "@/types"

interface PostProps {
    id: string
    user: User
    timeAgo: string
    content: string
    contentClass?: string
    media?: Media[] | null
    quotedPost?: any
    stats: {
        likes: number
        comments: number
        reposts: number
        shares?: number
        mirrors?: number
    }
    onClick?: () => void
    repostedBy?: any
    onUserClick?: (handle: string) => void
    currentUser: User | null
    showToast?: (message: string, type?: "success" | "error" | "info") => void
    poll?: any
    isDetail?: boolean
    initialComments?: any[]
    onDelete?: (id: string) => void
    onUpdate?: (id: string, content: string, media: Media[]) => void
    isComment?: boolean
    onReply?: (handle: string, commentId?: string) => void
    community?: CommunityShort | null
    parent_id?: string | null
    post_id?: string
}

const Post: React.FC<PostProps> = ({
    id,
    user,
    timeAgo,
    content,
    contentClass,
    media,
    quotedPost,
    stats,
    onClick,
    repostedBy,
    onUserClick,
    currentUser,
    showToast,
    poll,
    isDetail,
    initialComments,
    onDelete,
    onUpdate,
    isComment,
    onReply,
    community,
    parent_id,
    post_id,
}) => {
    const navigate = useNavigate()
    const {
        liked,
        reposted,
        localStats,
        setLocalStats,
        handleLike,
        handleRepost,
    } = usePostInteraction(id, stats, currentUser, showToast || (() => { }))

    const { deletePost, updatePost } = usePosts()
    const [comments, setComments] = useState<any[]>(initialComments || [])
    const [newComment, setNewComment] = useState("")
    const [loadingComments, setLoadingComments] = useState(false)
    const [submittingComment, setSubmittingComment] = useState(false)
    const [isFetchingMoreComments, setIsFetchingMoreComments] = useState(false)
    const [hasMoreComments, setHasMoreComments] = useState(true)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(content)
    const [editedMedia, setEditedMedia] = useState<Media[]>(media || [])
    const [newFiles, setNewFiles] = useState<File[]>([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [replyTo, setReplyTo] = useState<{ handle: string, id: string } | null>(null)
    const [showReplies, setShowReplies] = useState(false)
    const [replies, setReplies] = useState<any[]>([])
    const [loadingReplies, setLoadingReplies] = useState(false)

    const editFileInputRef = useRef<HTMLInputElement>(null)
    const commentsRef = useRef(comments)

    useEffect(() => {
        commentsRef.current = comments
    }, [comments])

    const loadReplies = useCallback(async () => {
        if (!id || !post_id || localStats.comments === 0) return
        setLoadingReplies(true)
        try {
            const data = await fetchCommentsByPostId(post_id, null, 10, id)
            setReplies(data)
            setShowReplies(true)
        } catch (err) {
            console.error("Failed to load replies:", err)
        } finally {
            setLoadingReplies(false)
        }
    }, [id, post_id, localStats.comments])

    const handleUpdate = async () => {
        const hasMediaChanged =
            JSON.stringify(editedMedia) !== JSON.stringify(media || []) ||
            newFiles.length > 0

        if (
            !editedContent.trim() ||
            (editedContent === content && !hasMediaChanged)
        ) {
            setIsEditing(false)
            return
        }

        setIsUpdating(true)
        try {
            // 1. Upload new files if any
            const uploadedNewMedia = []
            for (const file of newFiles) {
                const res = await uploadFile(file)
                uploadedNewMedia.push(res)
            }

            // 2. Combine remaining old media + new uploaded media
            const finalMedia = [...editedMedia, ...uploadedNewMedia]

            if (isComment) {
                await updateComment(id, { content: editedContent, media: finalMedia })
            } else {
                await updatePost(id, { content: editedContent, media: finalMedia })
            }

            setNewFiles([])
            setIsEditing(false)
            if (showToast) showToast(`${isComment ? "Comment" : "Post"} updated`)
            if (onUpdate) onUpdate(id, editedContent, finalMedia)
            
            // For comments, we might want to trigger a local refresh or wait for cache invalidation
            // Since comments are managed by local state in Post.tsx (initialComments), 
            // we should probably update the local state too if we want immediate feedback
            // or just rely on the parent's re-render if using React Query.
            // However, in Post.tsx, we have a local comments state.
        } catch (err) {
            console.error(`Failed to update ${isComment ? "comment" : "post"}:`, err)
            if (showToast) showToast(`Failed to update ${isComment ? "comment" : "post"}`)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async (e: React.MouseEvent) => {
        if (e) e.stopPropagation()
        try {
            if (isComment) {
                await deleteComment(id)
            } else {
                await deletePost(id)
            }
            if (showToast) showToast(`${isComment ? "Comment" : "Post"} deleted successfully`)
            if (onDelete) onDelete(id)
        } catch (err) {
            console.error(`Failed to delete ${isComment ? "comment" : "post"}:`, err)
            if (showToast) showToast(`Failed to delete ${isComment ? "comment" : "post"}`)
        } finally {
            setIsDeleteDialogOpen(false)
        }
    }

    const loadComments = useCallback(
        async (isLoadMore = false) => {
            if (!id) return
            if (isLoadMore) setIsFetchingMoreComments(true)
            else setLoadingComments(true)

            try {
                const currentComments = commentsRef.current
                const lastTimestamp =
                    isLoadMore && currentComments.length > 0
                        ? currentComments[currentComments.length - 1].created_at
                        : null

                const data = await fetchCommentsByPostId(id, lastTimestamp!, 10)

                if (data.length < 10) setHasMoreComments(false)
                else setHasMoreComments(true)

                if (isLoadMore) {
                    setComments((prev) => [...prev, ...data])
                } else {
                    setComments(data)
                }
            } catch (err) {
                console.error("Failed to load comments:", err)
            } finally {
                setLoadingComments(false)
                setIsFetchingMoreComments(false)
            }
        },
        [id]
    )

    useEffect(() => {
        if (isDetail && id) {
            loadComments()
        }
    }, [isDetail, id, loadComments])

    const handleSubmitComment = async (e: React.MouseEvent) => {
        e.preventDefault()
        if ((!newComment.trim() && selectedFiles.length === 0) || !currentUser)
            return

        setSubmittingComment(true)
        setIsUploading(true)
        try {
            const uploadedMedia = []
            for (const file of selectedFiles) {
                const res = await uploadFile(file)
                uploadedMedia.push(res)
            }

            await addComment(id, currentUser.id, newComment, uploadedMedia, replyTo?.id)
            setNewComment("")
            setSelectedFiles([])
            setReplyTo(null)
            setLocalStats((prev) => ({
                ...prev,
                comments: (prev.comments || 0) + 1,
            }))
            if (showToast) showToast("Reply posted!")
            loadComments()
        } catch (err) {
            console.error("Failed to post comment:", err)
            if (showToast) showToast("Failed to post reply.")
        } finally {
            setSubmittingComment(false)
            setIsUploading(false)
        }
    }

    const PostActionsMenu = ({ trigger }: { trigger: React.ReactNode }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
                <DropdownMenuGroup>
                    {!isComment && (
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 py-2.5"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
                                if (showToast) showToast("Link copied");
                            }}
                        >
                            <Share size={16} />
                            <span>Copy link</span>
                        </DropdownMenuItem>
                    )}
                    {!isComment && (
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 py-2.5"
                            onClick={(e) => {
                                e.stopPropagation()
                                showToast && showToast("Post reported")
                            }}
                        >
                            <Flag size={16} />
                            <span>Report post</span>
                        </DropdownMenuItem>
                    )}
                    {!isCurrentUser && (
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 py-2.5"
                            onClick={(e) => {
                                e.stopPropagation()
                                showToast && showToast("User blocked")
                            }}
                        >
                            <UserMinus size={16} />
                            <span>Block @{user.handle}</span>
                        </DropdownMenuItem>
                    )}
                    {isCurrentUser && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true)
                            }}
                            className="cursor-pointer gap-2 py-2.5"
                        >
                            <Pencil size={16} />
                            Edit Post
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                {isCurrentUser && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                variant="destructive"
                                className="cursor-pointer gap-2 py-2.5"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsDeleteDialogOpen(true)
                                }}
                            >
                                <Trash size={16} />
                                <span>Delete post</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const isCurrentUser = currentUser?.handle === user.handle

    const renderMedia = (m: any) => {
        if (!m) return null

        const currentMedia = (isEditing ? editedMedia : m) as Media[]
        if (
            !currentMedia ||
            (Array.isArray(currentMedia) && currentMedia.length === 0)
        )
            return null

        if (isEditing) {
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
                                        e.stopPropagation()
                                        setEditedMedia((prev) => prev.filter((_, i) => i !== idx))
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
                                        e.stopPropagation()
                                        setNewFiles((prev) => prev.filter((_, i) => i !== idx))
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
                                    e.stopPropagation()
                                    editFileInputRef.current?.click()
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
                                const files = Array.from(e.target.files)
                                setNewFiles((prev) => [...prev, ...files])
                            }
                        }}
                        multiple
                        className="hidden"
                        accept="image/*,video/*"
                    />
                </div>
            )
        }

        if (React.isValidElement(currentMedia)) return currentMedia
        return <MediaGrid items={currentMedia} />
    }

    const renderContent = (c: any, className?: string) => {
        const isTxtBangla = typeof c === "string" && isBangla(c)

        if (isEditing) {
            return (
                <div
                    className="mt-2 flex flex-col gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Textarea
                        value={editedContent}
                        onChange={(e: any) => setEditedContent(e.target.value)}
                        className={`min-h-[100px] w-full rounded-xl border-zinc-200 bg-zinc-50 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900 ${isTxtBangla ? "font-bangla text-lg" : "font-english"}`}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setIsEditing(false)
                                setEditedContent(content)
                                setEditedMedia(media || [])
                                setNewFiles([])
                            }}
                            className="px-4 py-1.5 text-sm font-bold text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={
                                isUpdating || !editedContent.trim() || editedContent === content
                            }
                            className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-bold text-white transition-all hover:bg-violet-700 disabled:opacity-50 active:scale-95"
                        >
                            {isUpdating ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            )
        }

        if (typeof c === "string") {
            const shouldTruncate = !isDetail && c.length > 280
            const textToProcess =
                shouldTruncate && !isExpanded ? c.substring(0, 280) : c

            return (
                <div
                    className={`whitespace-pre-line ${className || ""} ${isTxtBangla ? "font-bangla text-[1.15em] leading-relaxed" : "font-english text-[1.05em]"}`}
                >
                    <Linkify
                        options={{
                            ...linkifyOptions,
                            render: ({ attributes, content }) => {
                                const { href, ...props } = attributes
                                const origin = window.location.origin

                                // 1. Handle our custom internal hashtag link
                                if (href.includes("internal.tag/")) {
                                    const tag = decodeURIComponent(href.split("internal.tag/")[1]);
                                    return (
                                        <span
                                            key={content}
                                            {...props}
                                            className={cn(
                                                "cursor-pointer font-bold text-rose-600 hover:underline dark:text-rose-400 font-bangla",
                                                props.className
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/tags/${tag}`)
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    )
                                }

                                // 2. Handle internal app links
                                let internalPath = null
                                if (href.startsWith("/")) {
                                    internalPath = href
                                } else if (href.startsWith(origin)) {
                                    internalPath = href.replace(origin, "")
                                }

                                if (internalPath) {
                                    return (
                                        <span
                                            key={content}
                                            {...props}
                                            className={cn(
                                                "cursor-pointer font-medium text-violet-600 hover:underline dark:text-violet-400",
                                                props.className
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(internalPath!)
                                            }}
                                        >
                                            {content}
                                        </span>
                                    )
                                }

                                // 3. Handle all other external links
                                return (
                                    <a
                                        key={content}
                                        href={href}
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "text-violet-600 hover:underline dark:text-violet-400",
                                            props.className
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {content}
                                    </a>
                                )
                            },
                        }}
                    >
                        {/* 
                            Pre-processing text to wrap Bangla hashtags in a URL-like format 
                            that Linkify can process as a single unit without breaking Unicode clustering.
                        */}
                        {typeof textToProcess === "string"
                            ? textToProcess.replace(/#([\u0980-\u09FF\w]+)/g, "https://internal.tag/$1")
                            : textToProcess}
                    </Linkify>
                    {shouldTruncate && !isExpanded && "..."}
                    {shouldTruncate && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsExpanded(!isExpanded)
                            }}
                            className="ml-1 cursor-pointer font-bold text-rose-600 hover:underline dark:text-rose-400"
                        >
                            {isExpanded ? "Show less" : "See more"}
                        </button>
                    )}
                </div>
            )
        }
        return c
    }

    const handleReplyClick = (handle: string, commentId?: string) => {
        if (commentId) {
            // If this is already a comment (reply), its parent_id is the main thread.
            // If it has no parent_id, it IS the main thread.
            const targetParentId = isComment ? (parent_id || id) : commentId;
            setReplyTo({ handle, id: targetParentId })
        } else {
            setReplyTo(null)
        }
        setNewComment((prev) => {
            const mention = `@${handle} `
            if (prev.includes(mention)) return prev
            return mention + prev // Prepend mention for clarity
        })
        document.getElementById("comment-input")?.focus()
    }

    if (isDetail) {
        return (
            <div className="flex flex-col">
                <article className="p-5 dark:bg-black">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-x-3">
                            <button
                                className="shrink-0"
                                onClick={() => onUserClick && onUserClick(user.handle)}
                            >
                                <Avatar className="size-12 border border-zinc-200 dark:border-zinc-700">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.handle}
                                        className="object-cover"
                                    />
                                    <AvatarFallback>
                                        {user.handle[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                            <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex flex-wrap items-center gap-x-1.5 leading-none">
                                    <div className="flex min-w-0 max-w-full items-center gap-1.5">
                                        <button
                                            className="flex shrink-0 items-center gap-1 text-base font-bold text-zinc-900 hover:underline sm:text-lg dark:text-white"
                                            onClick={() => onUserClick && onUserClick(user.handle)}
                                        >
                                            <span className="max-w-[200px] truncate sm:max-w-none">
                                                {user.handle}
                                            </span>
                                            {user.verified && (
                                                <VerifiedIcon size={16} className="text-blue-500" />
                                            )}
                                        </button>

                                        {community && (
                                            <div className="flex min-w-0 items-center gap-1 text-zinc-500">
                                                <ChevronTagIcon
                                                    size={14}
                                                    className="shrink-0 text-zinc-400"
                                                />
                                                <button
                                                    className="flex items-center gap-1 text-[14px] font-bold text-zinc-900 hover:underline sm:text-[15px] dark:text-zinc-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        navigate(`/c/${community.handle}`)
                                                    }}
                                                >
                                                    <Avatar className="size-4 shrink-0 border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                                                        <AvatarImage
                                                            src={community.avatar}
                                                            alt={community.name}
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback className="text-[8px] font-bold text-zinc-500">
                                                            {community.name?.[0]?.toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="max-w-[200px] truncate sm:max-w-none">
                                                        {community.name}
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-zinc-500 sm:text-sm dark:text-zinc-400">
                                    @{user.handle}
                                </span>
                            </div>
                        </div>
                        <div className="-mt-1 flex items-center gap-2">
                            <span className="whitespace-nowrap text-[13px] text-zinc-500 sm:text-sm dark:text-zinc-400">
                                {timeAgo || "Recent"}
                            </span>
                            <PostActionsMenu
                                trigger={
                                    <button
                                        aria-label="More options"
                                        className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                    <div
                        className={`mt-4 whitespace-pre-line break-words text-lg leading-relaxed text-zinc-900 sm:text-xl sm:leading-8 dark:text-zinc-100`}
                    >
                        {renderContent(content, contentClass)}
                    </div>
                    {extractUrl(content) && <LinkPreview url={extractUrl(content)!} />}
                    {renderMedia(media)}
                    {poll && <PollDisplay poll={poll} />}
                    {quotedPost && (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-700">
                            <QuotedPost {...quotedPost} />
                        </div>
                    )}

                    <div className="mt-4 flex items-center gap-x-6 border-b border-zinc-100 pb-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                        <div className="flex items-center gap-x-1">
                            <span className="font-bold text-black dark:text-white">
                                {localStats.likes || 0}
                            </span>{" "}
                            <span className="opacity-70">Likes</span>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <span className="font-bold text-black dark:text-white">
                                {localStats.comments || 0}
                            </span>{" "}
                            <span className="opacity-70">Comments</span>
                        </div>
                    </div>

                    <div className="mt-4 flex w-full items-center justify-around py-1">
                        <ActionButton
                            icon={Heart}
                            label="Like"
                            type="like"
                            onClick={handleLike}
                            active={liked}
                        />
                        {!isComment && (
                            <ActionButton
                                icon={Repeat2}
                                label="Repost"
                                type="repost"
                                onClick={handleRepost}
                                active={reposted}
                            />
                        )}
                        <ActionButton
                            icon={ChatIcon}
                            label="Comment"
                            type="comment"
                            onClick={() => document.getElementById("comment-input")?.focus()}
                        />
                        {!isComment && (
                            <ActionButton
                                icon={ShareIcon}
                                label="Share"
                                type="share"
                                onClick={() => setIsShareModalOpen(true)}
                            />
                        )}
                    </div>
                </article>

                {replyTo && (
                    <div className="flex items-center justify-between bg-zinc-50 px-5 py-2 dark:bg-zinc-900/50">
                        <span className="text-sm text-zinc-500">
                            Replying to <span className="font-bold text-violet-600">@{replyTo.handle}</span>
                        </span>
                        <button 
                            onClick={() => setReplyTo(null)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <CommentInput
                    currentUser={currentUser}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleSubmitComment={handleSubmitComment}
                    loading={submittingComment}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    isUploading={isUploading}
                />

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {loadingComments ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin text-violet-500" />
                        </div>
                    ) : (
                        <>
                            {hasMoreComments && comments.length > 0 && (
                                <button
                                    onClick={() => loadComments(true)}
                                    disabled={isFetchingMoreComments}
                                    className="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-violet-600 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                >
                                    {isFetchingMoreComments && (
                                        <Loader2 size={14} className="animate-spin" />
                                    )}
                                    View more replies
                                </button>
                            )}
                            {comments.map((c) => (
                                <Post
                                    key={c.id}
                                    {...c}
                                    isComment={true}
                                    post_id={id}
                                    onReply={handleReplyClick}
                                    onUserClick={onUserClick}
                                    currentUser={currentUser}
                                    showToast={showToast}
                                    onDelete={(deletedId) =>
                                        setComments((prev) =>
                                            prev.filter((pc) => pc.id !== deletedId)
                                        )
                                    }
                                    onUpdate={(updatedId, content, media) =>
                                        setComments((prev) =>
                                            prev.map((pc) =>
                                                pc.id === updatedId
                                                    ? { ...pc, content, media }
                                                    : pc
                                            )
                                        )
                                    }
                                    // Fix missing props
                                    stats={{
                                        likes: c.stats?.likes || 0,
                                        comments: c.stats?.comments || 0,
                                        reposts: c.stats?.reposts || 0,
                                    }}
                                    timeAgo={c.timeAgo || c.created_at}
                                />
                            ))}
                        </>
                    )}
                </div>

                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                post and all its comments.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-rose-500 hover:bg-rose-600"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    }

    return (
        <article
            onClick={onClick}
            className={`px-4 transition-all ${isComment
                ? "py-2 bg-transparent hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20"
                : "py-4 border-b border-zinc-100 bg-white hover:bg-zinc-50/30 dark:border-zinc-800 dark:bg-black dark:hover:bg-white/[0.02]"
                } ${onClick ? "cursor-pointer" : ""}`}
        >
            {repostedBy && (
                <div className="mb-2 ml-1 flex items-center space-x-1.5 text-[13px] font-semibold text-zinc-600">
                    <Repeat2 size={14} className="text-zinc-500" />
                    <span
                        className="flex cursor-pointer items-center text-zinc-700 hover:underline dark:text-zinc-300"
                        onClick={(e) => {
                            e.stopPropagation()
                            onUserClick && onUserClick(repostedBy.handle)
                        }}
                    >
                        {repostedBy.handle} Reposted
                    </span>
                </div>
            )}

            <div className="flex items-start gap-x-3">
                <div className="flex shrink-0 flex-col items-center self-stretch py-0.5">
                    <div
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation()
                            onUserClick && onUserClick(user.handle)
                        }}
                    >
                        <Avatar className={`${isComment ? "size-8" : "size-10"} border-0 shadow-sm`}>
                            <AvatarImage
                                src={user.avatar}
                                alt={user.handle}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-xs">{user.handle[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                    {/* Vertical line connector (Threads style) */}
                    {((!isComment && localStats.comments > 0) || (isComment && !parent_id && localStats.comments > 0)) && (
                        <div className="mt-2 w-0.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                    )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-x-1.5 leading-none">
                            <div className="flex min-w-0 max-w-full items-center gap-1.5">
                                <button
                                    className={`flex shrink-0 items-center gap-1 ${isComment ? "text-[14px]" : "text-[15px]"} font-bold text-zinc-900 hover:underline dark:text-white`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onUserClick && onUserClick(user.handle)
                                    }}
                                >
                                    <span className="max-w-[150px] truncate sm:max-w-none">
                                        {user.handle}
                                    </span>
                                    {user.verified && (
                                        <VerifiedIcon size={isComment ? 12 : 14} className="text-blue-500" />
                                    )}
                                </button>

                                {community && (
                                    <div className="flex min-w-0 items-center gap-1 text-zinc-500">
                                        <ChevronTagIcon
                                            size={12}
                                            className="shrink-0 text-zinc-400"
                                        />
                                        <button
                                            className="flex items-center gap-1 text-[13px] font-bold text-zinc-900 hover:underline dark:text-zinc-100"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/c/${community.handle}`)
                                            }}
                                        >
                                            <Avatar className="size-3.5 shrink-0 border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                                                <AvatarImage
                                                    src={community.avatar}
                                                    alt={community.name}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="text-[6px] font-bold text-zinc-500">
                                                    {community.name?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="max-w-[150px] truncate sm:max-w-none">
                                                {community.name}
                                            </span>
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="-mt-1 flex items-center gap-2">
                            <span className="text-[12px] text-zinc-500 dark:text-zinc-400">
                                {timeAgo || "Recent"}
                            </span>
                            <PostActionsMenu
                                trigger={
                                    <button
                                        aria-label="More options"
                                        className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 group-hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:group-hover:bg-zinc-800/50"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={`mt-0.5 whitespace-pre-line break-words text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100`}
                    >
                        {renderContent(content, contentClass)}
                    </div>

                    {/* Attachments */}
                    {extractUrl(content) && <LinkPreview url={extractUrl(content)!} />}
                    {renderMedia(media)}
                    {poll && <PollDisplay poll={poll} />}

                    {quotedPost && (
                        <div
                            className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/post/${quotedPost.id}`)
                            }}
                        >
                            <QuotedPost {...quotedPost} />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className={`flex items-center gap-x-1 ${isComment ? "mt-1.5" : "mt-3"}`}>
                        <ActionButton
                            icon={Heart}
                            size={isComment ? 16 : 18}
                            type="like"
                            onClick={handleLike}
                            active={liked}
                        />
                        <ActionButton
                            icon={MessageCircle}
                            size={isComment ? 16 : 18}
                            type="comment"
                            onClick={(e) => {
                                e?.stopPropagation()
                                onReply ? onReply(user.handle, id) : onClick && onClick()
                            }}
                        />
                        <ActionButton
                            icon={Repeat2}
                            size={isComment ? 16 : 18}
                            type="repost"
                            onClick={handleRepost}
                            active={reposted}
                        />
                        {!isComment && (
                            <ActionButton
                                icon={ShareIcon}
                                type="share"
                                onClick={(e) => {
                                    e?.stopPropagation();
                                    setIsShareModalOpen(true);
                                }}
                            />
                        )}
                    </div>

                    {/* Stats Line (Threads style) */}
                    {(localStats.comments > 0 || localStats.likes > 0) && (
                        <div className={`mt-1 flex items-center gap-x-1.5 px-0.5 ${isComment ? "text-[12px]" : "text-[14px]"} font-medium text-zinc-500 dark:text-zinc-400`}>
                            {localStats.comments > 0 && (
                                <button 
                                    className="hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (showReplies) setShowReplies(false)
                                        else loadReplies()
                                    }}
                                >
                                    {localStats.comments} {localStats.comments === 1 ? "reply" : "replies"}
                                </button>
                            )}
                            {localStats.comments > 0 && localStats.likes > 0 && (
                                <span className="opacity-50">·</span>
                            )}
                            {localStats.likes > 0 && (
                                <button className="hover:underline">
                                    {localStats.likes} {localStats.likes === 1 ? "like" : "likes"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Nested Replies */}
                    {showReplies && (
                        <div className="relative mt-2 space-y-0">
                            {/* Vertical connector line for the whole group */}
                            <div className="absolute left-[19px] top-0 bottom-4 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
                            
                            {loadingReplies ? (
                                <div className="flex py-4 pl-12">
                                    <Loader2 size={18} className="animate-spin text-violet-500" />
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {replies.map((reply) => (
                                        <div key={reply.id} className="relative">
                                            {/* Horizontal small elbow connector */}
                                            <div className="absolute left-[19px] top-5 h-0.5 w-4 bg-zinc-100 dark:bg-zinc-800" />
                                            <div className="pl-6">
                                                <Post
                                                    {...reply}
                                                    isComment={true}
                                                    post_id={post_id}
                                                    onReply={onReply}
                                                    onUserClick={onUserClick}
                                                    currentUser={currentUser}
                                                    showToast={showToast}
                                                    onDelete={(deletedId) =>
                                                        setReplies((prev) =>
                                                            prev.filter((pr) => pr.id !== deletedId)
                                                        )
                                                    }
                                                    onUpdate={(updatedId, content, media) =>
                                                        setReplies((prev) =>
                                                            prev.map((pr) =>
                                                                pr.id === updatedId
                                                                    ? { ...pr, content, media }
                                                                    : pr
                                                            )
                                                        )
                                                    }
                                                    stats={{
                                                        likes: reply.stats?.likes || 0,
                                                        comments: reply.stats?.comments || 0,
                                                        reposts: reply.stats?.reposts || 0,
                                                    }}
                                                    timeAgo={reply.timeAgo || reply.created_at}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={`${window.location.origin}/post/${id}`}
                title="Share Post"
            />

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            post and all its comments.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-rose-500 hover:bg-rose-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </article>
    )
}

function arePropsEqual(prevProps: PostProps, nextProps: PostProps) {
    return (
        prevProps.id === nextProps.id &&
        prevProps.content === nextProps.content &&
        prevProps.timeAgo === nextProps.timeAgo &&
        prevProps.user.id === nextProps.user.id && // User ID check
        prevProps.user.avatar === nextProps.user.avatar && // User avatar check
        prevProps.stats.likes === nextProps.stats.likes &&
        prevProps.stats.comments === nextProps.stats.comments &&
        prevProps.stats.reposts === nextProps.stats.reposts &&
        prevProps.currentUser?.id === nextProps.currentUser?.id &&
        JSON.stringify(prevProps.media) === JSON.stringify(nextProps.media) &&
        JSON.stringify(prevProps.repostedBy) === JSON.stringify(nextProps.repostedBy)
    );
}

export default React.memo(Post, arePropsEqual)
