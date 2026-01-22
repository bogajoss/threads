import React, { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { uploadFile } from '@/services/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ImageCropper from '@/components/ui/ImageCropper';

const EditProfileModal = ({ isOpen, onClose, editProfileData, setEditProfileData }) => {
    const { updateProfile } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    
    // Final files to upload
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [newCoverFile, setNewCoverFile] = useState(null);

    // Cropper State
    const [tempImage, setTempImage] = useState(null);
    const [croppingType, setCroppingType] = useState(null); // 'avatar' | 'cover'

    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setTempImage(reader.result);
                setCroppingType(type);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (blob) => {
        // Convert blob to file for upload compatibility
        const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        if (croppingType === 'avatar') {
            setNewAvatarFile(file);
        } else {
            setNewCoverFile(file);
        }
        setTempImage(null);
        setCroppingType(null);
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            let avatarUrl = editProfileData.avatar;
            let coverUrl = editProfileData.cover;

            if (newAvatarFile) {
                const res = await uploadFile(newAvatarFile);
                avatarUrl = res.url;
            }

            if (newCoverFile) {
                const res = await uploadFile(newCoverFile);
                coverUrl = res.url;
            }

            await updateProfile({
                ...editProfileData,
                avatar: avatarUrl,
                cover: coverUrl
            });

            setNewAvatarFile(null);
            setNewCoverFile(null);
            onClose();
            addToast("Profile updated!");
        } catch (err) {
            console.error('Failed to update profile:', err);
            addToast("Failed to update profile.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => !loading && onClose()} title="Edit Profile">
                <div className="space-y-6">
                    <input 
                        type="file" 
                        ref={coverInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'cover')} 
                    />
                    <input 
                        type="file" 
                        ref={avatarInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'avatar')} 
                    />

                    {/* Cover Preview */}
                    <div
                        className="relative h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden group cursor-pointer"
                        onClick={() => coverInputRef.current?.click()}
                    >
                        {(newCoverFile || editProfileData?.cover) && (
                            <img src={newCoverFile ? URL.createObjectURL(newCoverFile) : editProfileData.cover} className="w-full h-full object-cover opacity-60" alt="" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 p-2 rounded-full text-white group-hover:scale-110 transition-transform"><Plus size={20} /></div>
                        </div>
                    </div>

                    {/* Avatar Preview */}
                    <div className="relative -mt-16 ml-4">
                        <div
                            className="relative size-24 rounded-full border-4 border-white dark:border-black overflow-hidden group cursor-pointer shadow-lg bg-white dark:bg-black"
                            onClick={() => avatarInputRef.current?.click()}
                        >
                            {(newAvatarFile || editProfileData?.avatar) && (
                                <Avatar className="size-full opacity-60 rounded-none">
                                    <AvatarImage src={newAvatarFile ? URL.createObjectURL(newAvatarFile) : editProfileData.avatar} className="object-cover" />
                                    <AvatarFallback>{editProfileData?.handle?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/50 p-2 rounded-full text-white group-hover:scale-110 transition-transform"><Plus size={16} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input label="Name" value={editProfileData?.name || ''} onChange={(e) => setEditProfileData({ ...editProfileData, name: e.target.value })} />
                        <Input label="Bio" textarea={true} value={editProfileData?.bio || ''} onChange={(e) => setEditProfileData({ ...editProfileData, bio: e.target.value })} />
                        <Input label="Location" value={editProfileData?.location || ''} onChange={(e) => setEditProfileData({ ...editProfileData, location: e.target.value })} />
                        <Input label="Website" value={editProfileData?.website || ''} onChange={(e) => setEditProfileData({ ...editProfileData, website: e.target.value })} />
                    </div>
                    <Button className="w-full py-3" disabled={loading} onClick={handleUpdateProfile}>
                        {loading ? <Loader2 size={24} className="animate-spin text-white mx-auto" /> : "Save changes"}
                    </Button>
                </div>
            </Modal>

            {tempImage && (
                <ImageCropper 
                    src={tempImage}
                    isOpen={!!tempImage}
                    onClose={() => { setTempImage(null); setCroppingType(null); }}
                    onCropComplete={onCropComplete}
                    aspect={croppingType === 'avatar' ? 1 : (croppingType === 'cover' ? 3/1 : undefined)}
                    circular={croppingType === 'avatar'}
                />
            )}
        </>
    );
};

export default EditProfileModal;