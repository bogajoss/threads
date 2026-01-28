import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Hash, Users } from "lucide-react";
import { Post } from "@/components/features/post";
import { Button, NotFound } from "@/components/ui";
import { searchPosts } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import SEOHead from "@/components/seo/SEOHead";

const HashtagFeed = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load initial posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        // Search for the hashtag (prepend # if searching content)
        // linkify strips # for the URL, so we add it back for the search query
        const query = `#${tag}`;
        const data = await searchPosts(query, null, 10);
        setPosts(data);
        setHasMore(data.length >= 10);
      } catch (error) {
        console.error("Failed to load hashtag posts:", error);
        addToast("Failed to load posts", "error");
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      loadPosts();
    }
  }, [tag, addToast]);

  const loadMore = async () => {
    if (fetchingMore || !hasMore) return;
    setFetchingMore(true);
    try {
      const lastPost = posts[posts.length - 1];
      const lastTimestamp = lastPost ? lastPost.sortTimestamp : null;
      const query = `#${tag}`;
      const newPosts = await searchPosts(query, lastTimestamp, 10);
      
      if (newPosts.length < 10) setHasMore(false);
      setPosts(prev => [...prev, ...newPosts]);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setFetchingMore(false);
    }
  };

  return (
    <div className="border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen pb-20">
      <SEOHead 
        title={`#${tag}`} 
        description={`Trending posts and discussions tagged with #${tag} on Sysm.`} 
      />
      <div className="relative">
        <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex flex-col">
              <h5 className="text-lg font-bold dark:text-white leading-none">
                #{tag}
              </h5>
              <span className="text-xs text-zinc-500 mt-0.5">
                Hashtag
              </span>
            </div>
          </div>
        </div>

        {/* Hashtag Header */}
        <div className="relative">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          </div>
          
          <div className="px-4 pb-6">
            <div className="flex justify-between items-end -mt-10 mb-4 relative z-10">
              <div className="size-20 sm:size-24 rounded-2xl border-4 border-white dark:border-black bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-xl">
                 <Hash size={40} className="text-zinc-400" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black dark:text-white tracking-tight leading-tight">
                #{tag}
              </h1>
              <p className="text-zinc-500 text-sm sm:text-base">
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
              {posts.map((post) => (
                <Post
                  key={post.feed_id || post.id}
                  currentUser={currentUser}
                  showToast={addToast}
                  {...post}
                  onClick={() => navigate(`/post/${post.id}`)}
                  onUserClick={(h) => navigate(`/u/${h}`)}
                />
              ))}
              {hasMore && (
                <div className="p-6 flex justify-center">
                  <Button
                    variant="secondary"
                    className="w-full max-w-xs"
                    onClick={loadMore}
                    disabled={fetchingMore}
                  >
                    {fetchingMore && <Loader2 size={18} className="animate-spin mr-2" />}
                    Load more
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-20 text-center text-zinc-500 flex flex-col items-center gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-full mb-2">
                <Hash size={40} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">No posts found</h3>
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
