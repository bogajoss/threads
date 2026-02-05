import React from "react";
import EditProfileModal from "@/components/features/modals/EditProfileModal";

interface GlobalModalsProps {
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (isOpen: boolean) => void;
  editProfileData: any;
  setEditProfileData: (data: any) => void;
}

const GlobalModals: React.FC<GlobalModalsProps> = ({
  isEditProfileOpen,
  setIsEditProfileOpen,
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
    </>
  );
};

export default GlobalModals;
