import { ArrowLeft, FileX } from "lucide-react"
// @ts-ignore
import Post from "@/components/features/post/Post"
import NotFound from "@/components/ui/NotFound"
import SkeletonPost from "@/components/ui/SkeletonPost"
import { usePostDetails } from "@/hooks/pages/usePostDetails"

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
    } = usePostDetails()

    if (isLoading) {
        return (
            <div className="min-h-screen overflow-hidden rounded-none border-y border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black md:rounded-xl md:border">
                <SkeletonPost />
            </div>
        )
    }

    if (isError || !post) {
        return (
            <div className="flex min-h-[600px] items-center justify-center overflow-hidden rounded-none bg-white dark:bg-black md:rounded-xl">
                <NotFound
                    title="Post not found"
                    message="The post you are looking for doesn't exist. It may have been deleted by the author."
                    icon={FileX}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen animate-in slide-in-from-right-5 overflow-hidden rounded-none border-y border-zinc-100 bg-white pb-16 shadow-sm duration-300 dark:border-zinc-800 dark:bg-black md:rounded-xl md:border">
            <div className="border-b border-zinc-100 dark:border-zinc-800">
                <div className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90">
                    <div className="flex items-center gap-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
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
    )
}

export default PostDetails
