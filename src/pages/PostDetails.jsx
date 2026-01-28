import React from "react";
import { ArrowLeft, FileX } from "lucide-react";
import Post from "@/components/features/post/Post";
import NotFound from "@/components/ui/NotFound";
import SkeletonPost from "@/components/ui/SkeletonPost";
import { usePostDetails } from "@/hooks";
import SEOHead from "@/components/seo/SEOHead";

const PostDetails = () => {
  const {
    post,
    isLoading,
    isError,
    currentUser,
    addToast,
    navigate,
    handleUserClick,
    handleDelete,
  } = usePostDetails();

  if (isLoading) {
    return (
      <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
        <SEOHead title="Post" />
        <SkeletonPost />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-[600px] flex items-center justify-center">
        <SEOHead title="Post Not Found" />
        <NotFound 
          title="Post not found"
          message="The post you are looking for doesn't exist. It may have been deleted by the author."
          icon={FileX}
        />
      </div>
    );
  }

  return (
    <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen pb-16 shadow-sm animate-in slide-in-from-right-5 duration-300">
      <SEOHead 
        title={`${post.user?.name} on Sysm: "${post.content?.substring(0, 50)}${post.content?.length > 50 ? '...' : ''}"`}
        description={post.content}
        image={post.media?.[0]?.url} 
      />
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
          onUserClick={handleUserClick}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PostDetails;