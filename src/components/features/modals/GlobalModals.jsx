import React from 'react';
import CreatePostModal from '@/components/features/modals/CreatePostModal';
import EditProfileModal from '@/components/features/modals/EditProfileModal';
import CreateStoryModal from '@/components/features/modals/CreateStoryModal';

const GlobalModals = ({
    isPostModalOpen,
    setIsPostModalOpen,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isStoryModalOpen,
    setIsStoryModalOpen,
    editProfileData,
    setEditProfileData
}) => {
    return (
        <>
            <CreatePostModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)} 
            />
            <EditProfileModal 
                isOpen={isEditProfileOpen} 
                onClose={() => setIsEditProfileOpen(false)} 
                editProfileData={editProfileData}
                setEditProfileData={setEditProfileData}
            />
            <CreateStoryModal 
                isOpen={isStoryModalOpen} 
                onClose={() => setIsStoryModalOpen(false)} 
            />
        </>
    );
};

export default GlobalModals;