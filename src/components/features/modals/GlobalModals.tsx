import React from "react";
import ReportModal from "@/components/features/modals/ReportModal";
import { useReportModal } from "@/context/ReportContext";

const GlobalModals: React.FC = () => {
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
