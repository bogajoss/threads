import React, { useState, useRef } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { Plus, MapPin, Loader2, Image as ImageIcon, FileText, BarChart2, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../context/PostContext';
import { useToast } from '../../../context/ToastContext';
import { uploadFile } from '../../../services/api';

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

    // Post State
    const [postContent, setPostContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showPoll, setShowPoll] = useState(false);
    const [pollData, setPollData] = useState({ options: ["", ""], duration: "1 day" });
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddPollOption = () => {
        if (pollData.options.length < 4) {
            setPollData(prev => ({ ...prev, options: [...prev.options, ""] }));
        }
    };

    const handleRemovePollOption = (index) => {
        setPollData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handlePollOptionChange = (index, value) => {
        const newOptions = [...pollData.options];
        newOptions[index] = value;
        setPollData(prev => ({ ...prev, options: newOptions }));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if ((!postContent.trim() && selectedFiles.length === 0) || !currentUser) return;

        setLoading(true);
        try {
            // 1. Upload Files
            const uploadedMedia = [];
            for (const file of selectedFiles) {
                const res = await uploadFile(file);
                uploadedMedia.push(res);
            }

            // 2. Prepare Poll (if any)
            let poll = null;
            if (showPoll && pollData.options.some(o => o.trim())) {
                poll = {
                    options: pollData.options.filter(o => o.trim()).map(text => ({ text, votes: 0 })),
                    ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Default 1 day
                };
            }

            // 3. Create Post
            await addPost({
                content: postContent,
                media: uploadedMedia,
                poll,
                type: uploadedMedia.length > 0 ? (uploadedMedia[0].type === 'video' ? 'video' : 'image') : (poll ? 'poll' : 'text'),
                userId: currentUser.id
            });

            // 4. Reset & Close
            setPostContent("");
            setSelectedFiles([]);
            setShowPoll(false);
            setPollData({ options: ["", ""], duration: "1 day" });
            setIsPostModalOpen(false);
            addToast("Post published!");
        } catch (err) {
            console.error('Failed to create post:', err);
            addToast("Failed to publish post.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(editProfileData);
            setIsEditProfileOpen(false);
            addToast("Profile updated!");
        } catch (err) {
            console.error('Failed to update profile:', err);
            addToast("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Create Post Modal */}
            <Modal isOpen={isPostModalOpen} onClose={() => !loading && setIsPostModalOpen(false)} title="Create Post">
                <form onSubmit={handleCreatePost} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 no-scrollbar">
                    <div className="flex gap-3">
                        <img src={currentUser?.avatar} className="size-12 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover" alt="" />
                        <div className="flex-1">
                            <textarea
                                className="w-full bg-transparent border-none outline-none text-lg min-h-[100px] resize-none dark:text-white"
                                placeholder="What's happening?"
                                autoFocus
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />

                            {/* Poll Editor */}
                            {showPoll && (
                                <div className="mt-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold opacity-60">Poll</span>
                                        <button type="button" onClick={() => setShowPoll(false)} className="text-zinc-500 hover:text-rose-500"><X size={18} /></button>
                                    </div>
                                    {pollData.options.map((option, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-violet-500"
                                                placeholder={`Option ${idx + 1}`}
                                                value={option}
                                                onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                                            />
                                            {pollData.options.length > 2 && (
                                                <button type="button" onClick={() => handleRemovePollOption(idx)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                            )}
                                        </div>
                                    ))}
                                    {pollData.options.length < 4 && (
                                        <button
                                            type="button"
                                            onClick={handleAddPollOption}
                                            className="text-sm font-bold text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            + Add option
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Media Previews */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {selectedFiles.map((file, idx) => (
                                        <div key={idx} className="relative group size-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700">
                                            {file.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(file)} className="size-full object-cover" alt="" />
                                            ) : (
                                                <div className="size-full flex items-center justify-center text-zinc-500">
                                                    {file.type.startsWith('video/') ? <Plus size={24} className="animate-pulse" /> : <FileText size={24} />}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} strokeWidth={3} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex text-violet-600 gap-1">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                title="Attach media"
                            >
                                <ImageIcon size={22} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPoll(true)}
                                className="p-2.5 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                title="Add poll"
                            >
                                <BarChart2 size={22} />
                            </button>
                            <button type="button" className="p-2.5 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full transition-colors"><MapPin size={22} /></button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                className="hidden"
                                accept="image/*,video/*,application/pdf"
                            />
                        </div>
                        <Button type="submit" disabled={(!postContent.trim() && selectedFiles.length === 0) || loading} className="px-8 py-2.5 min-w-[100px] text-base">
                            {loading ? <Loader2 size={18} className="animate-spin" /> : "Post"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditProfileOpen} onClose={() => !loading && setIsEditProfileOpen(false)} title="Edit Profile">
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
                    <Button className="w-full py-3" disabled={loading} onClick={handleUpdateProfile}>
                        {loading ? <Loader2 size={24} className="animate-spin text-white mx-auto" /> : "Save changes"}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default GlobalModals;
