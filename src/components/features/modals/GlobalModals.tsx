import React from "react";
import CreatePostModal from "@/components/features/modals/CreatePostModal";
// @ts-ignore
import EditProfileModal from "@/components/features/modals/EditProfileModal";
import CreateStoryModal from "@/components/features/modals/CreateStoryModal";

interface GlobalModalsProps {
  isPostModalOpen: boolean;
  setIsPostModalOpen: (isOpen: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (isOpen: boolean) => void;
  isStoryModalOpen: boolean;
  setIsStoryModalOpen: (isOpen: boolean) => void;
  editProfileData: any;
  setEditProfileData: (data: any) => void;
  postCommunity: any;
}

const GlobalModals: React.FC<GlobalModalsProps> = ({
  isPostModalOpen,
  setIsPostModalOpen,
  isEditProfileOpen,
  setIsEditProfileOpen,
  isStoryModalOpen,
  setIsStoryModalOpen,
  editProfileData,
  setEditProfileData,
  postCommunity,
}) => {
  return (
    <>
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        initialCommunity={postCommunity}
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
