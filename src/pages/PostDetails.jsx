import React from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Post from "@/components/features/post/Post";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchPostById } from "@/services/api";
import SkeletonPost from "@/components/ui/SkeletonPost";
import { isValidUUID } from "@/lib/utils";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!isValidUUID(id)) {
        throw new Error("Invalid post ID");
      }
      return fetchPostById(id);
    },
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
        <SkeletonPost />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="p-10 text-center">
        <p className="text-zinc-500">Post not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-violet-500 mt-4 underline font-bold"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen shadow-sm mb-20 animate-in slide-in-from-right-5 duration-300">
      <div className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h5 className="text-xl font-bold dark:text-white">Post</h5>
          </div>
        </div>

        <Post
          {...post}
          isDetail={true}
          currentUser={currentUser}
          initialComments={post.comments || []}
          showToast={addToast}
          onUserClick={(handle) => navigate(`/u/${handle}`)}
        />
      </div>
    </div>
  );
};

export default PostDetails;
