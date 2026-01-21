import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Post from '../components/features/post/Post';
import SkeletonPost from '../components/ui/SkeletonPost';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchPosts } from '../services/api';

const Explore = () => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All posts');

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts
    });

    const tabs = ["All posts", "Video", "Images", "Audio", "Text"];

    const filteredPosts = useMemo(() => {
        const filter = activeTab.toLowerCase();
        if (filter === 'all posts') return posts;
        return posts.filter(post => post.category === (filter === 'video' ? 'video' : filter === 'images' ? 'images' : filter === 'audio' ? 'audio' : 'text'));
    }, [posts, activeTab]);

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
        <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen shadow-sm pb-20">
            <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 border-b border-zinc-100 dark:border-zinc-800">
                <ul className="flex list-none justify-between px-5 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative cursor-pointer py-4 px-2 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'text-black dark:text-white border-black dark:border-white' : 'text-zinc-500 border-transparent hover:text-zinc-800 dark:hover:text-zinc-300'}`}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {filteredPosts.map((post) => (
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

export default Explore;
