import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash,
  Repeat2,
  MoreHorizontal,
  Share,
  Flag,
  UserMinus,
  Pencil,
  X,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PollDisplay,
  QuotedPost,
  CommentInput,
  LinkPreview,
  ShareModal,
  PostHeader,
  PostContent,
  PostMedia,
  PostActions,
  PostStats,
} from "@/components/features/post";
import { usePostInteraction, useComments } from "@/hooks";
import { useToast } from "@/context/ToastContext";
import { usePosts } from "@/context/PostContext";
import {
  uploadFile,
  deleteComment,
  updateComment,
  incrementPostViews,
  votePoll,
} from "@/lib/api";
import { extractUrl } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import type { User, Media, CommunityShort } from "@/types";

interface PostProps {
  id: string;
  user: User;
  timeAgo: string;
  content: string;
  contentClass?: string;
  media?: Media[] | null;
  quotedPost?: any;
  stats: {
    likes: number;
    comments: number;
    reposts: number;
    shares?: number;
    mirrors?: number;
  };
  onClick?: () => void;
  repostedBy?: any;
  onUserClick?: (handle: string) => void;
  currentUser: User | null;
  poll?: any;
  isDetail?: boolean;
  initialComments?: any[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, content: string, media: Media[]) => void;
  isComment?: boolean;
  onReply?: (handle: string, commentId?: string) => void;
  community?: CommunityShort | null;
  parent_id?: string | null;
  post_id?: string;
  commenterAvatars?: string[];
}

const ReplyAvatars = ({ avatars }: { avatars: string[] }) => {
  if (!avatars || avatars.length === 0) return null;

  const displayAvatars = avatars.slice(0, 3);

  return (
    <div className="relative mt-2 h-7 w-7">
      {displayAvatars.map((avatar, i) => {
        let positionClass = "";
        let sizeClass = "";

        if (displayAvatars.length === 1) {
          positionClass = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
          sizeClass = "size-5";
        } else if (displayAvatars.length === 2) {
          sizeClass = "size-4";
          positionClass = i === 0 ? "top-0 right-0" : "bottom-0 left-0";
        } else {
          sizeClass = i === 0 ? "size-3.5" : "size-3";
          if (i === 0) positionClass = "top-0 right-0";
          else if (i === 1) positionClass = "bottom-0 right-0";
          else positionClass = "top-1/2 left-0 -translate-y-1/2";
        }

        return (
          <div
            key={i}
            className={`absolute rounded-full border border-white bg-zinc-100 dark:border-black dark:bg-zinc-800 overflow-hidden shadow-sm ${positionClass} ${sizeClass}`}
            style={{ zIndex: 10 - i }}
          >
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          </div>
        );
      })}
    </div>
  );
};

interface PostActionsMenuProps {
  id: string;
  user: { handle: string };
  isCurrentUser: boolean;
  isComment?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  addToast: (msg: string, type?: any) => void;
  trigger: React.ReactNode;
}

const PostActionsMenu = ({
  id,
  user,
  isCurrentUser,
  isComment,
  onEdit,
  onDelete,
  addToast,
  trigger,
}: PostActionsMenuProps) => (
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
              navigator.clipboard.writeText(
                `${window.location.origin}/p/${id}`,
              );
              addToast("Link copied");
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
              e.stopPropagation();
              addToast("Post reported");
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
              e.stopPropagation();
              addToast("User blocked");
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
              onEdit();
            }}
            className="cursor-pointer gap-2 py-2.5"
          >
            <Pencil size={16} />
            Edit {isComment ? "Comment" : "Post"}
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
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash size={16} />
              <span>Delete {isComment ? "comment" : "post"}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

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
  commenterAvatars = [],
}) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    liked,
    reposted,
    localStats,
    setLocalStats,
    handleLike,
    handleRepost,
  } = usePostInteraction(id, stats, currentUser);

  const { deletePost, updatePost } = usePosts();

  const {
    comments,
    fetchNextPage: loadMoreComments,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: isFetchingMoreComments,
    // isLoading: loadingComments,
    addComment: submitComment,
    isSubmitting: submittingComment,
  } = useComments(id, initialComments);

  const [newComment, setNewComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedMedia, setEditedMedia] = useState<Media[]>(media || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{ handle: string; id: string } | null>(
    null,
  );
  const [showReplies, setShowReplies] = useState(false);

  const {
    comments: replies,
    // isLoading: loadingReplies,
    refetch: refetchReplies,
  } = useComments(post_id || id, [], showReplies ? id : undefined);

  const { ref: viewRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !isComment) {
      const timer = setTimeout(() => {
        incrementPostViews(id).catch(console.error);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [inView, id, isComment]);

  const loadReplies = useCallback(async () => {
    if (!id || (!post_id && !id) || localStats.comments === 0) return;
    setShowReplies(true);
    refetchReplies();
  }, [id, post_id, localStats.comments, refetchReplies]);

  const handleUpdate = async () => {
    const hasMediaChanged =
      JSON.stringify(editedMedia) !== JSON.stringify(media || []) ||
      newFiles.length > 0;

    if (
      !editedContent.trim() ||
      (editedContent === content && !hasMediaChanged)
    ) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const uploadedNewMedia = [];
      for (const file of newFiles) {
        const res = await uploadFile(file);
        uploadedNewMedia.push(res);
      }

      const finalMedia = [...editedMedia, ...uploadedNewMedia];

      if (isComment) {
        await updateComment(id, { content: editedContent, media: finalMedia });
      } else {
        await updatePost(id, { content: editedContent, media: finalMedia });
      }

      setNewFiles([]);
      setIsEditing(false);
      addToast(`${isComment ? "Comment" : "Post"} updated`);
      if (onUpdate) onUpdate(id, editedContent, finalMedia);
    } catch (err) {
      console.error(`Failed to update ${isComment ? "comment" : "post"}:`, err);
      addToast(`Failed to update ${isComment ? "comment" : "post"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (isComment) {
        await deleteComment(id);
      } else {
        await deletePost(id);
      }
      addToast(`${isComment ? "Comment" : "Post"} deleted successfully`);
      if (onDelete) onDelete(id);
    } catch (err) {
      console.error(`Failed to delete ${isComment ? "comment" : "post"}:`, err);
      addToast(`Failed to delete ${isComment ? "comment" : "post"}`);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmitComment = async (e: React.MouseEvent) => {
    e.preventDefault();
    if ((!newComment.trim() && selectedFiles.length === 0) || !currentUser)
      return;

    setIsUploading(true);
    try {
      const uploadedMedia = [];
      for (const file of selectedFiles) {
        const res = await uploadFile(file);
        uploadedMedia.push(res);
      }

      await submitComment({
        userId: currentUser.id,
        content: newComment,
        media: uploadedMedia,
        replyToId: replyTo?.id,
      });

      setNewComment("");
      setSelectedFiles([]);
      setReplyTo(null);
      setLocalStats((prev) => ({
        ...prev,
        comments: (prev.comments || 0) + 1,
      }));
      addToast("Reply posted!");
    } catch (err) {
      console.error("Failed to post comment:", err);
      addToast("Failed to post reply.");
    } finally {
      setIsUploading(false);
    }
  };

  const isCurrentUser = currentUser?.handle === user.handle;

  const handleReplyClick = (handle: string, commentId?: string) => {
    if (commentId) {
      const targetParentId = isComment ? parent_id || id : commentId;
      setReplyTo({ handle, id: targetParentId });
    } else {
      setReplyTo(null);
    }
    setNewComment((prev) => {
      const mention = `@${handle} `;
      if (prev.includes(mention)) return prev;
      return mention + prev;
    });
    document.getElementById("comment-input")?.focus();
  };

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
                id={id}
                user={user}
                isCurrentUser={isCurrentUser}
                isComment={isComment}
                onEdit={() => setIsEditing(true)}
                onDelete={() => setIsDeleteDialogOpen(true)}
                addToast={addToast}
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
              setIsEditing(false);
              setEditedContent(content);
              setEditedMedia(media || []);
              setNewFiles([]);
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

          {poll && (
            <PollDisplay
              poll={poll}
              onVote={(optionId) => votePoll(id, optionId, currentUser!.id)}
            />
          )}
          {quotedPost && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-700">
              <QuotedPost {...quotedPost} />
            </div>
          )}

          <PostStats
            views={localStats.views || 0}
            likes={localStats.likes || 0}
            comments={localStats.comments || 0}
            isDetail={true}
          />

          <PostActions
            liked={liked}
            reposted={reposted}
            handleLike={handleLike}
            handleRepost={handleRepost}
            handleCommentClick={() =>
              document.getElementById("comment-input")?.focus()
            }
            handleShareClick={() => setIsShareModalOpen(true)}
            isDetail={true}
            isComment={isComment}
          />
        </article>

        {replyTo && (
          <div className="flex items-center justify-between bg-zinc-50 px-5 py-2 dark:bg-zinc-900/50">
            <span className="text-sm text-zinc-500">
              Replying to{" "}
              <span className="font-bold text-violet-600">
                @{replyTo.handle}
              </span>
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
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            <>
              {hasMoreComments && comments.length > 0 && (
                <button
                  onClick={() => loadMoreComments()}
                  disabled={isFetchingMoreComments}
                  className="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-violet-600 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  {isFetchingMoreComments && (
                    <span className="animate-spin">⌛</span>
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
                  stats={{
                    likes: c.stats?.likes || 0,
                    comments: c.stats?.comments || 0,
                    reposts: c.stats?.reposts || 0,
                  }}
                  timeAgo={c.timeAgo || c.created_at}
                />
              ))}
            </>
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
      </div>
    );
  }

  return (
    <article
      ref={viewRef}
      onClick={onClick}
      className={`px-4 transition-all ${isComment
        ? "py-2 bg-transparent hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20"
        : "py-4 bg-white hover:bg-zinc-50/30 dark:bg-black dark:hover:bg-white/[0.02]"
        } ${onClick ? "cursor-pointer" : ""}`}
    >
      {repostedBy && (
        <div className="mb-2 ml-1 flex items-center space-x-1.5 text-[13px] font-semibold text-zinc-600">
          <Repeat2 size={14} className="text-zinc-500" />
          <span
            className="flex cursor-pointer items-center text-zinc-700 hover:underline dark:text-zinc-300"
            onClick={(e) => {
              e.stopPropagation();
              if (onUserClick) onUserClick(repostedBy.handle);
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
              e.stopPropagation();
              if (onUserClick) onUserClick(user.handle);
            }}
          >
            <Avatar
              className={`${isComment ? "size-8" : "size-10"} border-0 shadow-sm`}
            >
              <AvatarImage
                src={user.avatar}
                alt={user.handle}
                className="object-cover"
              />
              <AvatarFallback className="text-xs">
                {user.handle[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          {((!isComment && localStats.comments > 0) ||
            (isComment && !parent_id && localStats.comments > 0)) && (
              <>
                <div className="mt-2 w-0.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                {!isComment && (
                  <ReplyAvatars
                    avatars={
                      commenterAvatars.length > 0
                        ? commenterAvatars
                        : (comments || []).slice(0, 3).map((c) => c.user.avatar)
                    }
                  />
                )}
              </>
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
                id={id}
                user={user}
                isCurrentUser={isCurrentUser}
                isComment={isComment}
                onEdit={() => setIsEditing(true)}
                onDelete={() => setIsDeleteDialogOpen(true)}
                addToast={addToast}
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
              setIsEditing(false);
              setEditedContent(content);
              setEditedMedia(media || []);
              setNewFiles([]);
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
            <div
              className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/p/${quotedPost.id}`);
              }}
            >
              <QuotedPost {...quotedPost} />
            </div>
          )}

          <PostActions
            liked={liked}
            reposted={reposted}
            handleLike={handleLike}
            handleRepost={handleRepost}
            handleCommentClick={(e) => {
              e?.stopPropagation();
              if (onReply) {
                onReply(user.handle, id);
              } else if (onClick) {
                onClick();
              }
            }}
            handleShareClick={(e) => {
              e?.stopPropagation();
              setIsShareModalOpen(true);
            }}
            isComment={isComment}
          />

          <PostStats
            views={localStats.views || 0}
            likes={localStats.likes || 0}
            comments={localStats.comments || 0}
            isComment={isComment}
            onRepliesClick={() => {
              if (showReplies) setShowReplies(false);
              else loadReplies();
            }}
          />

          {showReplies && (
            <div className="relative mt-2 space-y-0">
              <div className="absolute left-[19px] top-0 bottom-4 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex flex-col">
                {replies.map((reply) => (
                  <div key={reply.id} className="relative">
                    <div className="absolute left-[19px] top-5 h-0.5 w-4 bg-zinc-100 dark:bg-zinc-800" />
                    <div className="pl-6">
                      <Post
                        {...reply}
                        isComment={true}
                        post_id={post_id || id}
                        onReply={onReply}
                        onUserClick={onUserClick}
                        currentUser={currentUser}
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
            </div>
          )}

          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            url={`${window.location.origin}/p/${id}`}
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
        </div>
      </div>
    </article>
  );
};

function arePropsEqual(prevProps: PostProps, nextProps: PostProps) {
  const mediaEqual =
    (!prevProps.media && !nextProps.media) ||
    (prevProps.media?.length === nextProps.media?.length &&
      prevProps.media?.every((m, i) => m.url === nextProps.media?.[i].url));

  const repostedByEqual =
    prevProps.repostedBy?.handle === nextProps.repostedBy?.handle;

  return (
    prevProps.id === nextProps.id &&
    prevProps.content === nextProps.content &&
    prevProps.timeAgo === nextProps.timeAgo &&
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.avatar === nextProps.user.avatar &&
    prevProps.stats.likes === nextProps.stats.likes &&
    prevProps.stats.comments === nextProps.stats.comments &&
    prevProps.stats.reposts === nextProps.stats.reposts &&
    prevProps.currentUser?.id === nextProps.currentUser?.id &&
    !!mediaEqual &&
    !!repostedByEqual
  );
}

export default React.memo(Post, arePropsEqual);