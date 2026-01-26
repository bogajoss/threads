import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Repeat2,
  Heart,
  MoreHorizontal,
  Loader2,
  Link as LinkIcon,
  Flag,
  Trash2,
  UserMinus,
  Pencil,
  X,
  Film,
  Plus,
  Users,
  Coins,
  Palette
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  Textarea,
  VerifiedBadge,
} from "@/components/ui";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import {
  PollDisplay,
  QuotedPost,
  ActionButton,
  MediaGrid,
  CommentInput,
  LinkPreview
} from "@/components/features/post";
import { usePostInteraction } from "@/hooks";
import { usePosts } from "@/context/PostContext";
import { fetchCommentsByPostId, addComment, uploadFile } from "@/lib/api";
import { isBangla, extractUrl } from "@/lib/utils";

const Post = ({
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
  isComment,
  onReply,
  community,
}) => {
  const navigate = useNavigate();
  const { liked, reposted, localStats, setLocalStats, handleLike, handleRepost } =
    usePostInteraction(id, stats, currentUser, showToast);
  const { deletePost, updatePost } = usePosts();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isFetchingMoreComments, setIsFetchingMoreComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedMedia, setEditedMedia] = useState(media || []);
  const [newFiles, setNewFiles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const editFileInputRef = useRef(null);
  const commentsRef = useRef(comments);

  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  const handleUpdate = async () => {
    const hasMediaChanged =
      JSON.stringify(editedMedia) !== JSON.stringify(media || []) ||
      newFiles.length > 0;

    if (!editedContent.trim() || (editedContent === content && !hasMediaChanged)) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      // 1. Upload new files if any
      const uploadedNewMedia = [];
      for (const file of newFiles) {
        const res = await uploadFile(file);
        uploadedNewMedia.push(res);
      }

      // 2. Combine remaining old media + new uploaded media
      const finalMedia = [...editedMedia, ...uploadedNewMedia];

      await updatePost(id, { content: editedContent, media: finalMedia });

      setNewFiles([]);
      setIsEditing(false);
      if (showToast) showToast("Post updated");
    } catch (err) {
      console.error("Failed to update post:", err);
      if (showToast) showToast("Failed to update post");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (e) => {
    if (e) e.stopPropagation();
    try {
      await deletePost(id);
      if (showToast) showToast("Post deleted successfully");
      if (onDelete) onDelete(id);
    } catch (err) {
      console.error("Failed to delete post:", err);
      if (showToast) showToast("Failed to delete post");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const loadComments = useCallback(async (isLoadMore = false) => {
    if (!id) return;
    if (isLoadMore) setIsFetchingMoreComments(true);
    else setLoadingComments(true);

    try {
      const currentComments = commentsRef.current;
      const lastTimestamp = isLoadMore && currentComments.length > 0
        ? currentComments[currentComments.length - 1].created_at
        : null;

      const data = await fetchCommentsByPostId(id, lastTimestamp, 10);

      if (data.length < 10) setHasMoreComments(false);
      else setHasMoreComments(true);

      if (isLoadMore) {
        setComments(prev => [...prev, ...data]);
      } else {
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
      setIsFetchingMoreComments(false);
    }
  }, [id]);

  useEffect(() => {
    if (isDetail && id) {
      loadComments();
    }
  }, [isDetail, id, loadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if ((!newComment.trim() && selectedFiles.length === 0) || !currentUser) return;

    setSubmittingComment(true);
    setIsUploading(true);
    try {
      const uploadedMedia = [];
      for (const file of selectedFiles) {
        const res = await uploadFile(file);
        uploadedMedia.push(res);
      }

      await addComment(id, currentUser.id, newComment, uploadedMedia);
      setNewComment("");
      setSelectedFiles([]);
      setLocalStats((prev) => ({
        ...prev,
        comments: (prev.comments || 0) + 1,
      }));
      if (showToast) showToast("Reply posted!");
      loadComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
      if (showToast) showToast("Failed to post reply.");
    } finally {
      setSubmittingComment(false);
      setIsUploading(false);
    }
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(url);
    if (showToast) showToast("Link copied to clipboard!");
  };

  const PostActionsMenu = ({ trigger }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
      >
        <DropdownMenuItem
          className="gap-2 cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-800 py-2.5"
          onClick={handleCopyLink}
        >
          <LinkIcon size={16} />
          <span>Copy link to post</span>
        </DropdownMenuItem>
        {!isComment && (
          <DropdownMenuItem
            className="gap-2 cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-800 py-2.5"
            onClick={(e) => {
              e.stopPropagation();
              showToast && showToast("Post reported");
            }}
          >
            <Flag size={16} />
            <span>Report post</span>
          </DropdownMenuItem>
        )}
        {!isCurrentUser && (
          <DropdownMenuItem
            className="gap-2 cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-800 py-2.5 text-rose-500 focus:text-rose-500"
            onClick={(e) => {
              e.stopPropagation();
              showToast && showToast("User blocked");
            }}
          >
            <UserMinus size={16} />
            <span>Block @{user.handle}</span>
          </DropdownMenuItem>
        )}
        {isCurrentUser && (
          <>
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
            <DropdownMenuItem
              className="gap-2 cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900 py-2.5"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Pencil size={16} />
              <span>Edit post</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer focus:bg-rose-50 dark:focus:bg-rose-900/20 py-2.5 text-rose-500 focus:text-rose-500"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 size={16} />
              <span>Delete post</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const isCurrentUser = currentUser?.handle === user.handle;

  const renderMedia = (m) => {
    if (!m) return null;

    const currentMedia = isEditing ? editedMedia : m;
    if (!currentMedia || (Array.isArray(currentMedia) && currentMedia.length === 0))
      return null;

    if (isEditing) {
      return (
        <div className="mt-3 space-y-3">
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
            {/* Existing Media */}
            {editedMedia.map((item, idx) => (
              <div
                key={`old-${idx}`}
                className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group"
              >
                {item.type === "video" ? (
                  <div className="size-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <Film size={24} className="text-zinc-400" />
                  </div>
                ) : (
                  <img
                    src={item.url || item.src}
                    className="size-full object-cover"
                    alt=""
                  />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditedMedia((prev) => prev.filter((_, i) => i !== idx));
                  }}
                  className="absolute top-1.5 right-1.5 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* Newly Selected Files */}
            {newFiles.map((file, idx) => (
              <div
                key={`new-${idx}`}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-violet-500 bg-violet-50/10 group"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    className="size-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <Film size={24} className="text-violet-500 animate-pulse" />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
                  }}
                  className="absolute top-1.5 right-1.5 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-1 left-1 bg-violet-600 text-white text-[8px] font-bold px-1 rounded">NEW</div>
              </div>
            ))}

            {/* Add More Button */}
            {(editedMedia.length + newFiles.length) < 4 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  editFileInputRef.current?.click();
                }}
                className="relative aspect-square rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-violet-500 hover:border-violet-500 hover:bg-violet-50/5 transition-all"
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
              const files = Array.from(e.target.files);
              setNewFiles(prev => [...prev, ...files]);
            }}
            multiple
            className="hidden"
            accept="image/*,video/*"
          />
        </div>
      );
    }

    if (React.isValidElement(currentMedia)) return currentMedia;
    return <MediaGrid items={currentMedia} />;
  };

  const renderContent = (c, className) => {
    const isTxtBangla = typeof c === "string" && isBangla(c);

    if (isEditing) {
      return (
        <div className="flex flex-col gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className={`min-h-[100px] w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-violet-500 ${isTxtBangla ? "font-bangla text-lg" : "font-english"}`}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(content);
                setEditedMedia(media || []);
                setNewFiles([]);
              }}
              className="px-4 py-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating || !editedContent.trim() || editedContent === content}
              className="px-4 py-1.5 text-sm font-bold bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:opacity-50 transition-all active:scale-95"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      );
    }

    if (typeof c === "string") {
      const shouldTruncate = !isDetail && c.length > 280;
      const textToProcess = shouldTruncate && !isExpanded ? c.substring(0, 280) : c;

      return (
        <div
          className={`whitespace-pre-line ${className || ""} ${isTxtBangla ? "font-bangla text-[1.15em] leading-relaxed" : "font-english text-[1.05em]"}`}
        >
          <Linkify
            options={{
              ...linkifyOptions,
              render: ({ attributes, content }) => {
                const { href, ...props } = attributes;
                // Determine if it's an external link
                const isExternal =
                  !href.startsWith("/") &&
                  (href.startsWith("http") || href.startsWith("www"));

                if (href.startsWith("/u/") || href.startsWith("/explore")) {
                  return (
                    <span
                      key={content}
                      {...props}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(href);
                      }}
                    >
                      {content}
                    </span>
                  );
                }
                return (
                  <a
                    key={content}
                    href={href}
                    {...props}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    {content}
                  </a>
                );
              },
            }}
          >
            {textToProcess}
          </Linkify>
          {shouldTruncate && !isExpanded && "..."}
          {shouldTruncate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="ml-1 text-rose-500 dark:text-rose-400 font-bold hover:underline cursor-pointer"
            >
              {isExpanded ? "Show less" : "See more"}
            </button>
          )}
        </div>
      );
    }
    return c;
  };

  const handleReplyClick = (handle) => {
    setNewComment((prev) => {
      const mention = `@${handle} `;
      if (prev.includes(mention)) return prev;
      return prev + mention;
    });
    document.getElementById("comment-input")?.focus();
  };

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
              <div className="flex flex-col min-w-0">
                <div className="flex flex-wrap items-center gap-x-1.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-base sm:text-lg">
                    <button
                      className="font-bold hover:underline text-zinc-900 dark:text-white flex items-center gap-1 shrink-0"
                      onClick={() => onUserClick && onUserClick(user.handle)}
                    >
                      {user.handle}
                      {user.verified && <VerifiedBadge />}
                    </button>

                    {community && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-400 font-medium text-sm sm:text-base">&gt;</span>
                        <button
                          className="flex items-center gap-1 font-bold text-zinc-900 dark:text-zinc-100 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/c/${community.handle}`);
                          }}
                        >
                          <Avatar className="size-5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                            <AvatarImage src={community.avatar} alt={community.name} className="object-cover" />
                            <AvatarFallback className="text-[9px] font-bold text-zinc-500">
                              {community.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {community.name}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  @{user.handle}
                </span>
              </div>
            </div>
            <PostActionsMenu
              trigger={
                <button className="text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              }
            />
          </div>
          <div
            className={`break-words text-zinc-900 dark:text-zinc-100 mt-4 text-lg sm:text-xl leading-relaxed sm:leading-8 whitespace-pre-line`}
          >
            {renderContent(content, contentClass)}
          </div>
          {extractUrl(content) && <LinkPreview url={extractUrl(content)} />}
          {renderMedia(media)}
          {poll && <PollDisplay poll={poll} />}
          {quotedPost && (
            <div className="mt-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm">
              <QuotedPost {...quotedPost} />
            </div>
          )}
          <div className="my-4 flex items-center text-zinc-500 dark:text-zinc-400 text-sm border-b border-zinc-100 dark:border-zinc-800 pb-4">
            {timeAgo || "Recent"}
          </div>

          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex items-center gap-x-6 text-zinc-500 dark:text-zinc-400 text-sm">
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
              onClick={handleLike}
              active={liked}
              activeColorClass="text-rose-500"
            />
            {!isComment && (
              <ActionButton
                icon={Repeat2}
                label="Repost"
                onClick={handleRepost}
                active={reposted}
                activeColorClass="text-emerald-500"
              />
            )}
            <ActionButton
              icon={MessageCircle}
              label="Comment"
              onClick={() => document.getElementById("comment-input")?.focus()}
            />
          </div>
        </article>

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
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin text-violet-500" />
            </div>
          ) : (
            <>
              {hasMoreComments && comments.length > 0 && (
                <button
                  onClick={() => loadComments(true)}
                  disabled={isFetchingMoreComments}
                  className="w-full py-3 text-sm font-bold text-violet-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
                >
                  {isFetchingMoreComments && <Loader2 size={14} className="animate-spin" />}
                  View more replies
                </button>
              )}
              {comments.map((c) => (
                <Post
                  key={c.id}
                  {...c}
                  isComment={true}
                  onReply={handleReplyClick}
                  onUserClick={onUserClick}
                  currentUser={currentUser}
                  showToast={showToast}
                  onDelete={(deletedId) =>
                    setComments((prev) => prev.filter((pc) => pc.id !== deletedId))
                  }
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
    );
  }

  return (
    <article
      onClick={onClick}
      className={`p-4 mb-4 bg-white dark:bg-black rounded-xl hover:shadow-md transition-all ${onClick ? "cursor-pointer" : ""}`}
    >
      {repostedBy && (
        <div className="mb-2 flex items-center space-x-1.5 text-[13px] text-zinc-500 font-semibold ml-1">
          <Repeat2 size={14} className="text-zinc-400" />
          <span
            className="hover:underline cursor-pointer flex items-center text-zinc-600 dark:text-zinc-400"
            onClick={(e) => {
              e.stopPropagation();
              onUserClick && onUserClick(repostedBy.handle);
            }}
          >
            <span className="truncate max-w-[150px]">
              {typeof repostedBy === "object" ? repostedBy.name : repostedBy}
            </span>
          </span>
          <span className="text-zinc-400">reposted</span>
        </div>
      )}
      <div className="flex items-start gap-x-3">
        <button
          className="shrink-0 group"
          onClick={(e) => {
            e.stopPropagation();
            onUserClick && onUserClick(user.handle);
          }}
        >
          <Avatar className="size-11 border border-zinc-200 dark:border-zinc-700 group-hover:brightness-95 transition-all">
            <AvatarImage
              src={user.avatar}
              alt={user.handle}
              className="object-cover"
            />
            <AvatarFallback>{user.handle[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1.5 leading-none">
                <div className="flex items-center gap-1.5 min-w-0 max-w-full">
                  <button
                    className="font-bold text-[15px] hover:underline text-zinc-900 dark:text-white flex items-center gap-1 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUserClick && onUserClick(user.handle);
                    }}
                  >
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{user.handle}</span>
                    {user.verified && <VerifiedBadge />}
                  </button>

                  {community && (
                    <div className="flex items-center gap-1 min-w-0 text-zinc-500">
                      <span className="text-zinc-400 font-medium shrink-0 text-xs sm:text-sm">&gt;</span>
                      <button
                        className="flex items-center gap-1 font-bold text-zinc-900 dark:text-zinc-100 hover:underline truncate max-w-[100px] sm:max-w-[180px] text-[14px] sm:text-[15px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/c/${community.handle}`);
                        }}
                      >
                        <Avatar className="size-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                          <AvatarImage src={community.avatar} alt={community.name} className="object-cover" />
                          <AvatarFallback className="text-[8px] font-bold text-zinc-500">
                            {community.name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {community.name}
                      </button>
                    </div>
                  )}
                  <span className="text-zinc-400 text-xs sm:text-sm whitespace-nowrap pt-0.5 ml-1">
                    {timeAgo || "Recent"}
                  </span>
                </div>
              </div>
            </div>
            <PostActionsMenu
              trigger={
                <button className="text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 rounded-full p-2 -mr-2 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              }
            />
          </div>

          <div className="break-words text-zinc-900 dark:text-zinc-100 mt-1 whitespace-pre-line text-sm sm:text-[15px] leading-relaxed">
            {renderContent(content, contentClass)}
            {extractUrl(content) && <LinkPreview url={extractUrl(content)} />}
            {renderMedia(media)}
            {poll && (
              <PollDisplay
                poll={poll}
                onVote={() => showToast && showToast("Voted!")}
              />
            )}
            {quotedPost && (
              <div
                className="mt-3 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <QuotedPost {...quotedPost} />
              </div>
            )}
          </div>

          <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-3 pr-4">
            <div className="flex items-center gap-x-4 sm:gap-x-8">
              <ActionButton
                icon={Heart}
                label="Like"
                count={localStats.likes}
                active={liked}
                onClick={handleLike}
                activeColorClass="text-rose-500"
              />
              {!isComment && (
                <ActionButton
                  icon={Repeat2}
                  label="Repost"
                  count={localStats.mirrors}
                  active={reposted}
                  onClick={handleRepost}
                  activeColorClass="text-emerald-500"
                />
              )}
              <ActionButton
                icon={MessageCircle}
                label="Comment"
                count={localStats.comments}
                onClick={(e) => {
                  if (isComment && onReply) {
                    e.stopPropagation();
                    onReply(user.handle);
                  } else if (onClick) {
                    onClick(e);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
  );
};

export default Post;
