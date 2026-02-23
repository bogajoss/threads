import React from "react";
import { Virtuoso } from "react-virtuoso";
import { useNavigate } from "react-router-dom";
import StoryCircle from "@/components/features/story/StoryCircle";
import { Post } from "@/components/features/post";
import ReelsRow from "@/components/features/reels/ReelsRow";
import {
  SkeletonPost,
  SignupCard,
  ScrollArea,
  ScrollBar,
  PullToRefresh,
} from "@/components/ui";
import { useHome } from "@/hooks";

const HomeHeader: React.FC<any> = ({
  currentUser,
  groupedStories,
  onAddStory,
  onStoryClick,
}) => (
  <div className="bg-background">
    <ScrollArea className="w-full border-b border-zinc-100 bg-background dark:border-zinc-800">
      <div className="flex w-max gap-4 px-4 py-4">
        {currentUser && (
          <StoryCircle
            user={currentUser}
            isAddStory={true}
            onClick={onAddStory}
          />
        )}
        {groupedStories.map((group: any) => (
          <StoryCircle
            key={group.user.id}
            user={group.user}
            isSeen={group.isSeen}
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
  </div>
);

const HomeFooter: React.FC<any> = ({
  isFetchingNextPage,
  hasMore,
  hasPosts,
}) => (
  <div className="flex justify-center py-8">
    {isFetchingNextPage ? (
      <p className="text-sm text-zinc-400 animate-pulse">Loading more...</p>
    ) : hasMore ? (
      <div className="h-4" />
    ) : hasPosts ? (
      <p className="text-sm font-medium text-zinc-500">
        You've reached the end of the feed.
      </p>
    ) : (
      <div className="p-20 text-center text-zinc-500">
        <p className="text-lg font-medium">No posts yet.</p>
        <p className="text-sm">Be the first to share something amazing!</p>
      </div>
    )}
  </div>
);

const Home: React.FC<any> = ({ onStoryClick }) => {
  const navigate = useNavigate();
  const {
    currentUser,
    homePosts,
    groupedStories,
    isPostsLoading,
    isStoriesLoading,
    hasMore,
    isFetchingNextPage,
    fetchNextPage,
    handlePostClick,
    handleUserClick,
    refreshPosts,
  } = useHome();

  if (isPostsLoading || isStoriesLoading) {
    return (
      <div className="min-h-screen overflow-hidden rounded-none border-y border-zinc-100 bg-background dark:border-zinc-800 md:rounded-xl md:border">
        <ScrollArea className="w-full whitespace-nowrap border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex w-max gap-3 px-4 py-4">
            <div className="size-16 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
            <div className="size-16 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
            <div className="size-16 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
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
    <div className="w-full max-full min-h-screen rounded-none border-zinc-100 bg-background dark:border-zinc-800 md:rounded-xl">
      <PullToRefresh onRefresh={refreshPosts}>
        <Virtuoso
          useWindowScroll
          data={homePosts}
          overscan={400}
          increaseViewportBy={200}
          components={{
            Header: () => (
              <HomeHeader
                currentUser={currentUser}
                groupedStories={groupedStories}
                onAddStory={() =>
                  navigate("/create", { state: { isStory: true } })
                }
                onStoryClick={onStoryClick}
              />
            ),
            Footer: () => (
              <HomeFooter
                isFetchingNextPage={isFetchingNextPage}
                hasMore={hasMore}
                hasPosts={homePosts.length > 0}
              />
            ),
          }}
          endReached={() => {
            if (hasMore && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          itemContent={(index, post) => (
            <>
              <Post
                key={post.feed_id || post.id}
                {...post}
                currentUser={currentUser}
                onClick={() => handlePostClick(post.id)}
                onUserClick={handleUserClick}
              />
              {(index === 4 || (index > 4 && (index - 4) % 25 === 0)) && (
                <ReelsRow index={Math.floor((index + 1) / 5)} />
              )}
            </>
          )}
        />
      </PullToRefresh>
    </div>
  );
};
export default Home;
