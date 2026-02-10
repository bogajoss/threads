import React from "react";
import ReportModal from "@/components/features/modals/ReportModal";
import { useReportModal } from "@/context/ReportContext";

interface GlobalModalsProps {}

const GlobalModals: React.FC<GlobalModalsProps> = () => {
  const { isOpen, targetType, targetId, closeReport } = useReportModal();

  return (
    <>
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
