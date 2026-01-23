import React, { useState, useEffect, useCallback } from "react";
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
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import PollDisplay from "@/components/features/post/PollDisplay";
import QuotedPost from "@/components/features/post/QuotedPost";
import ActionButton from "@/components/features/post/ActionButton";
import MediaGrid from "@/components/features/post/MediaGrid";
import CommentInput from "@/components/features/post/CommentInput";
import { usePostInteraction } from "@/hooks/usePostInteraction";
import { fetchCommentsByPostId, addComment } from "@/services/api";
import { usePosts } from "@/context/PostContext";

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
}) => {
  const {
    liked,
    reposted,
    localStats,
    setLocalStats,
    handleLike,
    handleRepost,
  } = usePostInteraction(id, stats, currentUser, showToast);
  const { deletePost } = usePosts();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const loadComments = useCallback(async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const data = await fetchCommentsByPostId(id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  }, [id]);

  useEffect(() => {
    if (isDetail && id) {
      loadComments();
    }
  }, [isDetail, id, loadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setSubmittingComment(true);
    try {
      await addComment(id, currentUser.id, newComment);
      setNewComment("");
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
    if (React.isValidElement(m)) return m;
    return <MediaGrid items={m} />;
  };

  const renderContent = (c, className) => {
    if (typeof c === "string") {
      return <p className={`whitespace-pre-line ${className || ""}`}>{c}</p>;
    }
    return c;
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
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-x-1">
                  <button
                    className="font-bold hover:underline text-zinc-900 dark:text-white flex items-center gap-1 text-base"
                    onClick={() => onUserClick && onUserClick(user.handle)}
                  >
                    {user.handle}
                    {user.verified && <VerifiedBadge />}
                  </button>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
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
            className={`break-words text-zinc-900 dark:text-zinc-100 mt-4 text-xl leading-8 whitespace-pre-line`}
          >
            {renderContent(content, contentClass)}
          </div>
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
              onClick={handleLike}
              active={liked}
              activeColorClass="text-rose-500"
            />
            <ActionButton
              icon={Repeat2}
              onClick={handleRepost}
              active={reposted}
              activeColorClass="text-emerald-500"
            />
            <ActionButton
              icon={MessageCircle}
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
        />

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {loadingComments ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin text-violet-500" />
            </div>
          ) : (
            comments.map((c) => (
              <Post
                key={c.id}
                {...c}
                onUserClick={onUserClick}
                currentUser={currentUser}
                showToast={showToast}
                onDelete={(deletedId) =>
                  setComments((prev) => prev.filter((pc) => pc.id !== deletedId))
                }
              />
            ))
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
      className={`px-5 pt-4 pb-3 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${onClick ? "cursor-pointer" : ""}`}
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
            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-x-1">
                <button
                  className="font-bold hover:underline text-zinc-900 dark:text-white flex items-center gap-1 truncate text-[15px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUserClick && onUserClick(user.handle);
                  }}
                >
                  <span className="truncate">{user.handle}</span>
                  {user.verified && <VerifiedBadge />}
                </button>
                <span className="text-zinc-400 text-sm ml-1 whitespace-nowrap">
                  • {timeAgo || "Recent"}
                </span>
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

          <div className="break-words text-zinc-900 dark:text-zinc-100 mt-1 whitespace-pre-line text-[15px] leading-relaxed">
            {renderContent(content, contentClass)}
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
            <div className="flex items-center gap-x-6">
              <ActionButton
                icon={Heart}
                count={localStats.likes}
                active={liked}
                onClick={handleLike}
                activeColorClass="text-rose-500"
              />
              <ActionButton
                icon={Repeat2}
                count={localStats.mirrors}
                active={reposted}
                onClick={handleRepost}
                activeColorClass="text-emerald-500"
              />
              <ActionButton
                icon={MessageCircle}
                count={localStats.comments}
                onClick={onClick}
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
