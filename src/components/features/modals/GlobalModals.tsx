import React from "react";
import EditProfileModal from "@/components/features/modals/EditProfileModal";
import ReportModal from "@/components/features/modals/ReportModal";
import { useReportModal } from "@/context/ReportContext";

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
  const { isOpen, targetType, targetId, closeReport } = useReportModal();

  return (
    <>
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        editProfileData={editProfileData}
        setEditProfileData={setEditProfileData}
      />

      {targetType && targetId && (
        <ReportModal 
          isOpen={isOpen}
          onClose={closeReport}
          targetType={targetType}
          targetId={targetId}
        />
      )}
    </>
  );
};

export default GlobalModals;
