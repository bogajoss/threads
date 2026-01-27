import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { fetchCommentsByPostId, addComment, uploadFile } from "@/lib/api";
import { Post, CommentInput } from "@/components/features/post";

const ReelCommentsModal = ({ isOpen, onClose, reelId, currentUser, showToast }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const commentsRef = useRef(comments);
  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  const loadComments = useCallback(async (isLoadMore = false) => {
    if (!reelId) return;
    if (isLoadMore) setIsFetchingMore(true);
    else setLoading(true);

    try {
      const currentComments = commentsRef.current;
      const lastTimestamp = isLoadMore && currentComments.length > 0
        ? currentComments[currentComments.length - 1].created_at
        : null;

      const data = await fetchCommentsByPostId(reelId, lastTimestamp, 10);

      if (data.length < 10) setHasMore(false);
      else setHasMore(true);

      if (isLoadMore) {
        setComments(prev => [...prev, ...data]);
      } else {
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
      if (showToast) showToast("Failed to load comments", "error");
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [reelId, showToast]);

  useEffect(() => {
    if (isOpen && reelId) {
      loadComments();
    } else {
        setComments([]);
        setHasMore(true);
    }
  }, [isOpen, reelId, loadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if ((!newComment.trim() && selectedFiles.length === 0) || !currentUser) return;

    setSubmitting(true);
    setIsUploading(true);
    try {
      const uploadedMedia = [];
      for (const file of selectedFiles) {
        const res = await uploadFile(file);
        uploadedMedia.push(res);
      }

      await addComment(reelId, currentUser.id, newComment, uploadedMedia);
      setNewComment("");
      setSelectedFiles([]);
      if (showToast) showToast("Reply posted!");
      loadComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
      if (showToast) showToast("Failed to post reply.", "error");
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Comments"
      className="sm:max-w-lg h-[80vh] flex flex-col"
    >
      <div className="flex flex-col h-full overflow-hidden -m-5">
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
          ) : comments.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {comments.map((c) => (
                <Post
                  key={c.id}
                  {...c}
                  isComment={true}
                  currentUser={currentUser}
                  showToast={showToast}
                  onDelete={(deletedId) =>
                    setComments((prev) => prev.filter((pc) => pc.id !== deletedId))
                  }
                />
              ))}
              {hasMore && (
                <button
                  onClick={() => loadComments(true)}
                  disabled={isFetchingMore}
                  className="w-full py-4 text-sm font-bold text-violet-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
                >
                  {isFetchingMore && <Loader2 size={14} className="animate-spin" />}
                  View more replies
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
              <p className="font-bold">No comments yet</p>
              <p className="text-sm">Be the first to share what you think!</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
          <CommentInput
            currentUser={currentUser}
            newComment={newComment}
            setNewComment={setNewComment}
            handleSubmitComment={handleSubmitComment}
            loading={submitting}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            isUploading={isUploading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReelCommentsModal;
