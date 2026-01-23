import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import StoryCircle from "@/components/features/story/StoryCircle";
import Post from "@/components/features/post/Post";
import SkeletonPost from "@/components/ui/SkeletonPost";
import SignupCard from "@/components/ui/SignupCard";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
import { fetchStories } from "@/services/api";

const Home = ({ onStoryClick, onAddStory }) => {
  const { currentUser } = useAuth();
  const { posts, loading: isPostsLoading } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // 1. Fetch Stories
  const { data: stories = [], isLoading: isStoriesLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: fetchStories,
  });

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
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 px-4 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-800">
          <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
          <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
          <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
        </div>
        {[1, 2, 3].map((i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-4 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-800">
        {currentUser && (
          <StoryCircle
            user={currentUser}
            isAddStory={true}
            onClick={onAddStory}
          />
        )}
        {stories.map((story) => (
          <StoryCircle
            key={story.id}
            user={story.user}
            onClick={() => onStoryClick(story)}
          />
        ))}
      </div>

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
      </div>
    </div>
  );
};

export default Home;
