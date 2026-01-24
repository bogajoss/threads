import React, { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import StoryCircle from "@/components/features/story/StoryCircle";
import Post from "@/components/features/post/Post";
import SkeletonPost from "@/components/ui/SkeletonPost";
import SignupCard from "@/components/ui/SignupCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
import { fetchStories } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Home = ({ onStoryClick, onAddStory }) => {
  const { currentUser } = useAuth();
  const {
    posts,
    loading: isPostsLoading,
    hasMore,
    isFetchingNextPage,
    fetchNextPage,
  } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasMore && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasMore, isFetchingNextPage, fetchNextPage]);

  // 2. Fetch Stories
  const { data: stories = [], isLoading: isStoriesLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: fetchStories,
  });

  // Group stories by user
  const groupedStories = useMemo(() => {
    const groups = {};
    stories.forEach((s) => {
      if (!s.user) return;
      const userId = s.user.id;
      if (!groups[userId]) {
        groups[userId] = {
          user: s.user,
          stories: [],
        };
      }
      groups[userId].stories.push(s);
    });
    return Object.values(groups);
  }, [stories]);

  // Filter out replies, show only top-level posts on the home feed
  const homePosts = useMemo(() => {
    return posts.filter((p) => !p.parent_id);
  }, [posts]);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleUserClick = (handle) => {
    navigate(`/u/${handle}`);
  };

  if (isPostsLoading || isStoriesLoading) {
    return (
      <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
        <ScrollArea className="w-full whitespace-nowrap border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex w-max gap-3 py-4 px-4">
            <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
            <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
            <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
        {[1, 2, 3].map((i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <ScrollArea className="w-full border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="flex w-max gap-4 py-4 px-4">
          {currentUser && (
            <StoryCircle
              user={currentUser}
              isAddStory={true}
              onClick={onAddStory}
            />
          )}
          {groupedStories.map((group) => (
            <StoryCircle
              key={group.user.id}
              user={group.user}
              onClick={() => onStoryClick(group)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      {!currentUser && (
        <div className="px-4 py-2 md:hidden">
          <SignupCard className="p-6" />
        </div>
      )}

      <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen shadow-sm">
        {homePosts.length > 0 ? (
          homePosts.map((post) => (
            <Post
              key={post.id}
              {...post}
              currentUser={currentUser}
              showToast={addToast}
              onClick={() => handlePostClick(post.id)}
              onUserClick={handleUserClick}
            />
          ))
        ) : (
          <div className="p-20 text-center text-zinc-500">
            <p className="text-lg font-medium">No posts yet.</p>
            <p className="text-sm">Be the first to share something amazing!</p>
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        {homePosts.length > 0 && (
          <div ref={ref} className="py-8 flex justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="animate-spin text-violet-500" size={24} />
            ) : hasMore ? (
              <div className="h-4" /> // Placeholder to trigger view
            ) : (
              <p className="text-sm text-zinc-500 font-medium">
                You've reached the end of the feed.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
