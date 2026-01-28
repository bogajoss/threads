import React from "react";
import StoryCircle from "@/components/features/story/StoryCircle";
import { Post } from "@/components/features/post";
import { SkeletonPost, SignupCard, ScrollArea, ScrollBar } from "@/components/ui";
import { useHome } from "@/hooks";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Home = ({ onStoryClick, onAddStory }) => {
  const {
    currentUser,
    homePosts,
    groupedStories,
    isPostsLoading,
    isStoriesLoading,
    hasMore,
    isFetchingNextPage,
    addToast,
    ref,
    handlePostClick,
    handleUserClick,
  } = useHome();

  if (isPostsLoading || isStoriesLoading) {
    return (
      <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
        <SEOHead title="Home" />
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
      <SEOHead title="Home Feed" description="See what's happening in your world right now." />
      <ScrollArea className="w-full border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="flex w-max gap-4 py-4 px-4">
          {currentUser && (
            <StoryCircle
              user={currentUser}
              isAddStory={true}
              onClick={onAddStory}
            />
          )}
          {groupedStories.map((group) => {
            const seenStories = JSON.parse(localStorage.getItem("seenStories") || "[]");
            const isSeen = seenStories.includes(group.user.id);

            return (
              <StoryCircle
                key={group.user.id}
                user={group.user}
                isSeen={isSeen}
                onClick={() => onStoryClick(group)}
              />
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      {!currentUser && (
        <div className="px-4 py-2 md:hidden">
          <SignupCard className="p-6" />
        </div>
      )}

      <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen pb-20 shadow-sm">
        {homePosts.length > 0 ? (
          homePosts.map((post) => (
            <Post
              key={post.feed_id || post.id}
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