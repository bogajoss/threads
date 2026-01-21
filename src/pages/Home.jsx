import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StoryCircle from '../components/features/story/StoryCircle';
import Post from '../components/features/post/Post';
import SkeletonPost from '../components/ui/SkeletonPost';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchPosts } from '../services/api';
import db from '../data/db.json';

const Home = ({ onStoryClick, onAddStory }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts
    });

    const homePosts = useMemo(() => {
        return posts.filter(p => ['h1', 'h2', 'h3', 'd1'].includes(p.id) || p.type === 'poll' || (p.id && p.id.toString().startsWith('new_')));
    }, [posts]);

    const stories = useMemo(() => {
        return db.stories.map(s => ({ ...s, user: db.profiles[s.userHandle] || s.user }));
    }, []);

    const handlePostClick = (id) => {
        navigate(`/post/${id}`);
    };

    const handleUserClick = (handle) => {
        navigate(`/u/${handle}`);
    };

    if (isLoading) {
        return (
            <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
                {[1, 2, 3].map(i => <SkeletonPost key={i} />)}
            </div>
        );
    }

    return (
        <div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 px-4 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-800">
                {currentUser && (
                    <StoryCircle user={currentUser} isAddStory={true} onClick={onAddStory} />
                )}
                {stories.map(story => (
                    <StoryCircle key={story.id} user={story.user} onClick={() => onStoryClick(story)} />
                ))}
            </div>

            <div
                className="relative h-48 sm:h-64 w-full gap-y-5 rounded-none md:rounded-xl bg-black overflow-hidden bg-cover bg-center mb-5 shadow-sm mt-4"
                style={{ backgroundImage: `url("https://static.hey.xyz/images/hero.webp")` }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-6 left-6 z-10">
                    <div className="font-extrabold text-3xl sm:text-4xl text-white tracking-tight">Welcome to Hey</div>
                    <div className="font-bold text-zinc-200 text-lg">a social network built on Lens</div>
                </div>
            </div>

            <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen shadow-sm pb-20">
                {homePosts.map((post) => (
                    <Post
                        key={post.id}
                        {...post}
                        currentUser={currentUser}
                        showToast={addToast}
                        onClick={() => handlePostClick(post.id)}
                        onUserClick={handleUserClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
