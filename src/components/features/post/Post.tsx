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
    ShareIcon,
    ChatIcon,
} from "@/components/ui"
// @ts-ignore
import {
    PollDisplay,
    QuotedPost,
    ActionButton,
    CommentInput,
    LinkPreview,
    ShareModal,
    PostHeader,
    PostContent,
    PostMedia,
} from "@/components/features/post"
import { usePostInteraction } from "@/hooks"
// @ts-ignore
import { usePosts } from "@/context/PostContext"
import { fetchCommentsByPostId, addComment, uploadFile, deleteComment, updateComment, incrementPostViews } from "@/lib/api"
import { extractUrl } from "@/lib/utils"
import { useInView } from "react-intersection-observer"
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
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [replyTo, setReplyTo] = useState<{ handle: string, id: string } | null>(null)
    const [showReplies, setShowReplies] = useState(false)
    const [replies, setReplies] = useState<any[]>([])
    const [loadingReplies, setLoadingReplies] = useState(false)

    // View Tracking
    const { ref: viewRef, inView } = useInView({
        threshold: 0.5, // 50% visibility
        triggerOnce: true, // Only count once per mount
    })

    useEffect(() => {
        if (inView && !isComment) {
            const timer = setTimeout(() => {
                incrementPostViews(id).catch(console.error)
            }, 1500) // Count as view after 1.5 seconds
            return () => clearTimeout(timer)
        }
    }, [inView, id, isComment])

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
            <div className="flex flex-col" ref={viewRef}>
                <article className="p-5 dark:bg-black">
                    <PostHeader
                        user={user}
                        timeAgo={timeAgo}
                        community={community}
                        onUserClick={onUserClick}
                        isDetail={true}
                        showAvatar={true}
                        actionsMenu={
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
                        }
                    />

                    <PostContent
                        content={content}
                        isDetail={true}
                        isEditing={isEditing}
                        editedContent={editedContent}
                        setEditedContent={setEditedContent}
                        onCancelEdit={() => {
                            setIsEditing(false)
                            setEditedContent(content)
                            setEditedMedia(media || [])
                            setNewFiles([])
                        }}
                        onSaveEdit={handleUpdate}
                        isUpdating={isUpdating}
                        contentClass={contentClass}
                    />

                    {extractUrl(content) && <LinkPreview url={extractUrl(content)!} />}
                    
                    <PostMedia
                        media={media}
                        isEditing={isEditing}
                        editedMedia={editedMedia}
                        setEditedMedia={setEditedMedia}
                        newFiles={newFiles}
                        setNewFiles={setNewFiles}
                    />

                    {poll && <PollDisplay poll={poll} />}
                    {quotedPost && (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-700">
                            <QuotedPost {...quotedPost} />
                        </div>
                    )}

                    <div className="mt-4 flex items-center gap-x-6 border-b border-zinc-100 pb-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                        <div className="flex items-center gap-x-1">
                            <span className="font-bold text-black dark:text-white">
                                {localStats.views || 0}
                            </span>{" "}
                            <span className="opacity-70">Views</span>
                        </div>
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
            ref={viewRef}
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
                <div className="flex shrink-0 flex-col items-center self-stretch pt-0.5">
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
                    <PostHeader
                        user={user}
                        timeAgo={timeAgo}
                        community={community}
                        onUserClick={onUserClick}
                        isComment={isComment}
                        actionsMenu={
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
                        }
                    />

                    <PostContent
                        content={content}
                        isEditing={isEditing}
                        editedContent={editedContent}
                        setEditedContent={setEditedContent}
                        onCancelEdit={() => {
                            setIsEditing(false)
                            setEditedContent(content)
                            setEditedMedia(media || [])
                            setNewFiles([])
                        }}
                        onSaveEdit={handleUpdate}
                        isUpdating={isUpdating}
                        contentClass={contentClass}
                    />

                    {/* Attachments */}
                    {extractUrl(content) && <LinkPreview url={extractUrl(content)!} />}
                    <PostMedia
                        media={media}
                        isEditing={isEditing}
                        editedMedia={editedMedia}
                        setEditedMedia={setEditedMedia}
                        newFiles={newFiles}
                        setNewFiles={setNewFiles}
                    />
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
                    {(localStats.comments > 0 || localStats.likes > 0 || (localStats.views || 0) > 0) && (
                        <div className={`mt-1 flex items-center gap-x-1.5 px-0.5 ${isComment ? "text-[12px]" : "text-[14px]"} font-medium text-zinc-500 dark:text-zinc-400`}>
                            {(localStats.views || 0) > 0 && !isComment && (
                                <>
                                    <span className="hover:underline">
                                        {localStats.views} {localStats.views === 1 ? "view" : "views"}
                                    </span>
                                    {(localStats.comments > 0 || localStats.likes > 0) && (
                                        <span className="opacity-50">·</span>
                                    )}
                                </>
                            )}
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
