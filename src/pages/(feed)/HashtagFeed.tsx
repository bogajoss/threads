import { ArrowLeft, Hash, Loader2 } from "lucide-react";
import Post from "@/components/features/post/Post";
import { Button } from "@/components/ui";
import { useHashtagFeed } from "@/hooks/pages/useHashtagFeed";

const HashtagFeed = () => {
  const {
    tag,
    posts,
    loading,
    fetchingMore,
    hasMore,
    loadMore,
    navigate,
    currentUser,
  } = useHashtagFeed();

  return (
    <div className="min-h-screen overflow-hidden rounded-none border-zinc-100 bg-white pb-20 dark:border-zinc-800 dark:bg-black md:rounded-xl">
      <div className="relative">
        <div className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-1 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex flex-col">
              <h5 className="text-lg font-bold leading-none dark:text-white">
                #{tag}
              </h5>
              <span className="mt-0.5 text-xs text-zinc-500">Hashtag</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-32 overflow-hidden bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 sm:h-40">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          </div>

          <div className="px-4 pb-6">
            <div className="relative z-10 -mt-10 mb-4 flex items-end justify-between">
              <div className="flex size-20 items-center justify-center rounded-2xl border-4 border-white bg-zinc-100 shadow-xl dark:border-black dark:bg-zinc-800 sm:size-24">
                <Hash size={40} className="text-zinc-400" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black leading-tight tracking-tight dark:text-white sm:text-3xl">
                #{tag}
              </h1>
              <p className="text-sm text-zinc-500 sm:text-base">
                Posts tagged with #{tag}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
          ) : posts.length > 0 ? (
            <>
              {posts.map((post: any) => (
                <Post
                  key={post.feed_id || post.id}
                  currentUser={currentUser}
                  {...post}
                  onClick={() => navigate(`/p/${post.id}`)}
                  onUserClick={(h: string) => navigate(`/u/${h}`)}
                />
              ))}
              {hasMore && (
                <div className="flex justify-center p-6">
                  <Button
                    variant="secondary"
                    className="w-full max-w-xs"
                    onClick={() => loadMore()}
                    disabled={fetchingMore}
                  >
                    {fetchingMore && (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    )}
                    Load more
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 p-20 text-center text-zinc-500">
              <div className="mb-2 rounded-full bg-zinc-50 p-6 dark:bg-zinc-900">
                <Hash size={40} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                No posts found
              </h3>
              <p className="text-sm max-w-[250px]">
                Be the first to post with #{tag}!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HashtagFeed;