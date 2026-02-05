import React from "react";
// @ts-ignore
import EditProfileModal from "@/components/features/modals/EditProfileModal";
import CreateStoryModal from "@/components/features/modals/CreateStoryModal";

interface GlobalModalsProps {
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (isOpen: boolean) => void;
  isStoryModalOpen: boolean;
  setIsStoryModalOpen: (isOpen: boolean) => void;
  editProfileData: any;
  setEditProfileData: (data: any) => void;
}

const GlobalModals: React.FC<GlobalModalsProps> = ({
  isEditProfileOpen,
  setIsEditProfileOpen,
  isStoryModalOpen,
  setIsStoryModalOpen,
  editProfileData,
  setEditProfileData,
}) => {
  return (
    <>
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
