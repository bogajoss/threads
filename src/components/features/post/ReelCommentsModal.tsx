import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, SkeletonComment, Button } from "@/components/ui";
import { MessageCircle, X } from "lucide-react";
import { fetchCommentsByPostId, addComment, uploadFile } from "@/lib/api";
import { Post, CommentInput } from "@/components/features/post";
import type { User } from "@/types";

interface ReelCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
  currentUser: User | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ReelCommentsModal: React.FC<ReelCommentsModalProps> = ({
  isOpen,
  onClose,
  reelId,
  currentUser,
  showToast,
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [replyTo, setReplyTo] = useState<{ handle: string; id: string } | null>(
    null,
  );

  const commentsRef = useRef(comments);
  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  const loadComments = useCallback(
    async (isLoadMore = false) => {
      if (!reelId || reelId.startsWith("temp-")) return;
      if (isLoadMore) setIsFetchingMore(true);
      else setLoading(true);

      try {
        const currentComments = commentsRef.current;
        const lastTimestamp =
          isLoadMore && currentComments.length > 0
            ? currentComments[currentComments.length - 1].created_at
            : null;

        const data = await fetchCommentsByPostId(reelId, lastTimestamp!, 10);

        if (data.length < 10) setHasMore(false);
        else setHasMore(true);

        if (isLoadMore) {
          setComments((prev) => [...prev, ...data]);
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
    },
    [reelId, showToast],
  );

  useEffect(() => {
    if (isOpen && reelId) {
      loadComments();
    } else {
      setComments([]);
      setHasMore(true);
    }
  }, [isOpen, reelId, loadComments]);

  const handleSubmitComment = async (e?: React.MouseEvent, audioData?: { blob: Blob; duration: number }) => {
    e?.preventDefault();
    if ((!newComment.trim() && selectedFiles.length === 0 && !audioData) || !currentUser)
      return;

    setSubmitting(true);
    setIsUploading(true);
    try {
      let uploadedMedia = [];
      let commentType = "text";
      let voiceDuration = null;

      if (audioData) {
        const audioFile = new File([audioData.blob], "voice-comment.webm", { type: "audio/webm" });
        const res = await uploadFile(audioFile);
        uploadedMedia = [res];
        commentType = "voice";
        voiceDuration = audioData.duration;
      } else {
        for (const file of selectedFiles) {
          const res = await uploadFile(file);
          uploadedMedia.push(res);
        }
      }

      await addComment(
        reelId,
        currentUser.id,
        newComment,
        uploadedMedia,
        replyTo?.id,
        commentType,
        voiceDuration,
      );
      setNewComment("");
      setSelectedFiles([]);
      setReplyTo(null);
      if (showToast) showToast(commentType === "voice" ? "Voice reply posted!" : "Reply posted!");
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
      className="max-sm:h-[95dvh] h-[85vh] overflow-hidden !p-0 sm:max-w-xl"
    >
      <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-zinc-900">
        <div className="mx-auto my-3 h-1.5 w-12 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 sm:hidden" />

        <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {loading ? (
            <div className="flex flex-col">
              {[1, 2, 3].map((i) => (
                <SkeletonComment key={i} />
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="flex flex-col">
              {comments.map((c) => (
                <Post
                  key={c.id}
                  {...c}
                  isComment={true}
                  post_id={reelId}
                  currentUser={currentUser}
                  showToast={showToast}
                  onReply={(handle, id) => {
                    if (id) setReplyTo({ handle, id });
                    else setReplyTo(null);
                    setNewComment((prev) =>
                      prev.includes(`@${handle}`) ? prev : prev + `@${handle} `,
                    );
                  }}
                  onDelete={(deletedId: string) =>
                    setComments((prev) =>
                      prev.filter((pc) => pc.id !== deletedId),
                    )
                  }
                  onUpdate={(updatedId, content, media) =>
                    setComments((prev) =>
                      prev.map((pc) =>
                        pc.id === updatedId ? { ...pc, content, media } : pc,
                      ),
                    )
                  }
                />
              ))}
              {hasMore && (
                <div className="flex justify-center border-t border-zinc-100 py-4 dark:border-zinc-800">
                  <Button
                    variant="ghost"
                    onClick={() => loadComments(true)}
                    loading={isFetchingMore}
                    className="text-violet-600 font-bold"
                  >
                    View more replies
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center text-zinc-500">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                <MessageCircle size={32} className="text-zinc-400" />
              </div>
              <p className="text-lg font-bold dark:text-zinc-300">
                No comments yet
              </p>
              <p className="text-sm dark:text-zinc-500">
                Be the first to share what you think!
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-zinc-100 bg-white pb-safe dark:border-zinc-800 dark:bg-zinc-900">
          {replyTo && (
            <div className="flex items-center justify-between border-b border-zinc-50 bg-zinc-50/50 px-4 py-2 dark:border-zinc-800/50 dark:bg-zinc-900/50">
              <span className="text-xs text-zinc-500">
                Replying to{" "}
                <span className="font-bold text-violet-600">
                  @{replyTo.handle}
                </span>
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={14} />
              </button>
            </div>
          )}
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
