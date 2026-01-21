import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/features/profile/ProfileHeader';
import Post from '../components/features/post/Post';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useToast } from '../context/ToastContext';

const Profile = ({ onEditProfile }) => {
    const { handle } = useParams();
    const navigate = useNavigate();
    const { profiles, currentUser } = useAuth();
    const { getUserPosts } = usePosts();
    const { addToast } = useToast();
    const [activeProfileTab, setActiveProfileTab] = useState('Feed');

    const profile = useMemo(() => {
        return profiles[handle] || {
            name: handle,
            handle: handle,
            avatar: 'https://static.hey.xyz/images/brands/lens.svg',
            cover: 'https://static.hey.xyz/images/hero.webp',
            bio: 'Lens Profile',
            following: '0',
            followers: '0',
        };
    }, [handle, profiles]);

    const posts = useMemo(() => getUserPosts(handle, activeProfileTab.toLowerCase()), [handle, activeProfileTab, getUserPosts]);

    const handlePostClick = (id) => {
        navigate(`/post/${id}`);
    };

    const handleUserClick = (targetHandle) => {
        if (targetHandle === handle) return;
        navigate(`/u/${targetHandle}`);
    };

    return (
        <div className="border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen pb-20">
            <div className="border-y md:border-b-0 border-zinc-100 dark:border-zinc-800">
                <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 md:hidden">
                    <div className="flex items-center gap-x-4">
                        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white transition-colors"><ArrowLeft size={22} /></button>
                        <div className="flex flex-col">
                            <h5 className="text-lg font-bold dark:text-white leading-none">{profile.name}</h5>
                            <span className="text-xs text-zinc-500 mt-0.5">{posts ? posts.length : 0} Posts</span>
                        </div>
                    </div>
                </div>
                <ProfileHeader
                    profile={profile}
                    currentUser={currentUser}
                    isCurrentUser={currentUser?.handle === profile.handle}
                    onEditProfile={onEditProfile}
                    showToast={addToast}
                />

                <div className="sticky top-[60px] md:top-0 bg-white dark:bg-black z-10 border-b border-zinc-100 dark:border-zinc-800">
                    <ul className="flex list-none justify-between px-5">
                        {["Feed", "Replies", "Media", "Collected"].map(tab => (
                            <li key={tab} onClick={() => setActiveProfileTab(tab)} className={`relative cursor-pointer py-3.5 text-sm font-semibold transition-colors border-b-2 flex-1 text-center ${activeProfileTab === tab ? 'text-black dark:text-white border-black dark:border-white' : 'text-zinc-500 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}>
                                {tab}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Post
                                key={post.id}
                                currentUser={currentUser}
                                showToast={addToast}
                                {...post}
                                onClick={() => handlePostClick(post.id)}
                                onUserClick={handleUserClick}
                            />
                        ))
                    ) : (
                        <div className="p-16 text-center text-zinc-500 flex flex-col items-center gap-4">
                            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-full"><Search size={32} className="text-zinc-300" /></div>
                            <p className="font-medium">No posts found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
