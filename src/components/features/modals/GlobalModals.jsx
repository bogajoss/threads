import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { Plus, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../context/PostContext';
import { useToast } from '../../../context/ToastContext';

const GlobalModals = ({
    isPostModalOpen,
    setIsPostModalOpen,
    isEditProfileOpen,
    setIsEditProfileOpen,
    editProfileData,
    setEditProfileData
}) => {
    const { currentUser, updateProfile } = useAuth();
    const { addPost } = usePosts();
    const { addToast } = useToast();
    const [postContent, setPostContent] = useState("");

    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!postContent.trim()) return;

        const newPost = {
            id: `new_${Date.now()}`,
            type: 'text',
            user: currentUser,
            timeAgo: 'Just now',
            content: postContent,
            stats: { comments: 0, likes: 0, collects: 0, mirrors: 0 },
            timestamp: "Just now",
            category: 'text'
        };

        addPost(newPost);
        setPostContent("");
        setIsPostModalOpen(false);
        addToast("Post published!");
    };

    return (
        <>
            {/* Create Post Modal */}
            <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title="Create Post">
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <div className="flex gap-3">
                        <img src={currentUser?.avatar} className="size-12 rounded-full border border-zinc-200 dark:border-zinc-800" alt="" />
                        <textarea
                            className="flex-1 bg-transparent border-none outline-none text-lg min-h-[120px] resize-none dark:text-white"
                            placeholder="What's happening?"
                            autoFocus
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex text-violet-600 gap-1">
                            <button type="button" className="p-2 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full transition-colors"><Plus size={22} /></button>
                            <button type="button" className="p-2 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full transition-colors"><MapPin size={22} /></button>
                        </div>
                        <Button type="submit" disabled={!postContent.trim()} className="px-6 py-2">Post</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Profile">
                <div className="space-y-6">
                    <div className="relative h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden group cursor-pointer">
                        {editProfileData?.cover && <img src={editProfileData.cover} className="w-full h-full object-cover opacity-60" alt="" />}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 p-2 rounded-full text-white"><Plus size={20} /></div>
                        </div>
                    </div>
                    <div className="relative -mt-16 ml-4">
                        <div className="relative size-24 rounded-full border-4 border-white dark:border-black overflow-hidden group cursor-pointer shadow-lg bg-white dark:bg-black">
                            {editProfileData?.avatar && <img src={editProfileData.avatar} className="w-full h-full object-cover opacity-60" alt="" />}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/50 p-2 rounded-full text-white"><Plus size={16} /></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Input label="Name" value={editProfileData?.name || ''} onChange={(e) => setEditProfileData({ ...editProfileData, name: e.target.value })} />
                        <Input label="Bio" textarea={true} value={editProfileData?.bio || ''} onChange={(e) => setEditProfileData({ ...editProfileData, bio: e.target.value })} />
                        <Input label="Website" value={editProfileData?.website || ''} onChange={(e) => setEditProfileData({ ...editProfileData, website: e.target.value })} />
                    </div>
                    <Button className="w-full py-3" onClick={() => { updateProfile(editProfileData); setIsEditProfileOpen(false); addToast("Profile updated!"); }}>Save changes</Button>
                </div>
            </Modal>
        </>
    );
};

export default GlobalModals;
