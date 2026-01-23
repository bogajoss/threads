import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileHeader from '@/components/features/profile/ProfileHeader';
import Post from '@/components/features/post/Post';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { useToast } from '@/context/ToastContext';

const Profile = ({ onEditProfile }) => {
    const { handle } = useParams();
    const navigate = useNavigate();
    const { profiles, currentUser, getProfileByHandle } = useAuth();
    const { getUserPosts } = usePosts();
    const { addToast } = useToast();
    const [activeProfileTab, setActiveProfileTab] = useState('feed');
    const [loading, setLoading] = useState(!profiles[handle]);
    const [profile, setProfile] = useState(profiles[handle]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!profiles[handle]) {
                setLoading(true);
                const fetched = await getProfileByHandle(handle);
                setProfile(fetched);
                setLoading(false);
            } else {
                setProfile(profiles[handle]);
            }
        };
        fetchProfile();
    }, [handle, profiles, getProfileByHandle]);

    const posts = useMemo(() => getUserPosts(handle, activeProfileTab), [handle, activeProfileTab, getUserPosts]);

    const handlePostClick = (id) => {
        navigate(`/post/${id}`);
    };

    const handleUserClick = (targetHandle) => {
        if (targetHandle === handle) return;
        navigate(`/u/${targetHandle}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={40} className="animate-spin text-violet-500" />
            </div>
        );
    }

    const displayProfile = profile || {
        id: null,
        name: handle,
        handle: handle,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sysm',
        cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop',
        bio: 'Profile not found',
        following: '0',
        followers: '0',
    };

    const renderPosts = () => {
        if (posts.length > 0) {
            return posts.map(post => (
                <Post
                    key={post.id}
                    currentUser={currentUser}
                    showToast={addToast}
                    {...post}
                    onClick={() => handlePostClick(post.id)}
                    onUserClick={handleUserClick}
                />
            ));
        }
        return (
            <div className="p-16 text-center text-zinc-500 flex flex-col items-center gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-full"><Search size={32} className="text-zinc-300" /></div>
                <p className="font-medium">No posts found</p>
            </div>
        );
    };

    return (
        <div className="border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
            <div className="border-y md:border-b-0 border-zinc-100 dark:border-zinc-800">
                <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 md:hidden">
                    <div className="flex items-center gap-x-4">
                        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white transition-colors"><ArrowLeft size={22} /></button>
                        <div className="flex flex-col">
                            <h5 className="text-lg font-bold dark:text-white leading-none">{displayProfile.name}</h5>
                            <span className="text-xs text-zinc-500 mt-0.5">{posts ? posts.length : 0} Posts</span>
                        </div>
                    </div>
                </div>
                <ProfileHeader
                    profile={displayProfile}
                    currentUser={currentUser}
                    isCurrentUser={currentUser?.handle === displayProfile.handle}
                    onEditProfile={onEditProfile}
                    showToast={addToast}
                />

                <Tabs value={activeProfileTab} onValueChange={setActiveProfileTab} className="w-full">
                    <div className="sticky top-[60px] md:top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 border-b border-zinc-100 dark:border-zinc-800">
                        <TabsList className="w-full h-auto bg-transparent p-0 rounded-none justify-start px-2">
                            {["feed", "replies", "media"].map(tab => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="flex-1 py-4 text-sm font-bold capitalize rounded-none border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white text-zinc-500 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                >
                                    {tab === 'feed' ? 'Posts' : tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <TabsContent value="feed" className="m-0 border-none">
                        {renderPosts()}
                    </TabsContent>
                    <TabsContent value="replies" className="m-0 border-none">
                        {renderPosts()}
                    </TabsContent>
                    <TabsContent value="media" className="m-0 border-none">
                        {renderPosts()}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;
