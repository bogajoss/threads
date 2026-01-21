import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StoryCircle from '../components/features/story/StoryCircle';
import Post from '../components/features/post/Post';
import SkeletonPost from '../components/ui/SkeletonPost';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchPosts, fetchProfiles } from '../services/api';

const Home = ({ onStoryClick, onAddStory }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    // 1. Fetch Posts
    const { data: posts = [], isLoading: isPostsLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts
    });

    // 2. Fetch Profiles for stories (simplified for now)
    const { data: profiles = {}, isLoading: isProfilesLoading } = useQuery({
        queryKey: ['profiles'],
        queryFn: fetchProfiles
    });

    // Filter out replies, show only top-level posts on the home feed
    const homePosts = useMemo(() => {
        return posts.filter(p => !p.parent_id);
    }, [posts]);

    // Use fetched profiles for stories if mock data is not available
    const stories = useMemo(() => {
        // Ideally we'd have a separate fetchStories, but using profiles for now as a demo
        return Object.values(profiles).slice(0, 10).map(p => ({
            id: p.id,
            user: p
        }));
    }, [profiles]);

    const handlePostClick = (id) => {
        navigate(`/post/${id}`);
    };

    const handleUserClick = (handle) => {
        navigate(`/u/${handle}`);
    };

    if (isPostsLoading || isProfilesLoading) {
        return (
            <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 px-4 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-800">
                    <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
                    <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
                    <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse shrink-0" />
                </div>
                {[1, 2, 3].map(i => <SkeletonPost key={i} />)}
            </div>
        );
    }

    return (
        <div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-4 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-800">
                {currentUser && (
                    <StoryCircle user={currentUser} isAddStory={true} onClick={onAddStory} />
                )}
                {stories.map(story => (
                    <StoryCircle key={story.id} user={story.user} onClick={() => onStoryClick(story)} />
                ))}
            </div>

            <div
                className="relative h-48 sm:h-64 w-full gap-y-5 rounded-none md:rounded-xl bg-black overflow-hidden bg-cover bg-center mb-6 shadow-sm mt-4 group"
                style={{ backgroundImage: `url("https://static.hey.xyz/images/hero.webp")` }}
            >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500"></div>
                <div className="absolute bottom-6 left-6 z-10 transition-transform duration-500 group-hover:translate-x-2">
                    <div className="font-extrabold text-3xl sm:text-4xl text-white tracking-tight drop-shadow-lg">Welcome to Hey</div>
                    <div className="font-bold text-zinc-200 text-lg opacity-90">a decentralized social network</div>
                </div>
            </div>

            <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen shadow-sm pb-24">
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
