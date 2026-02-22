import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { reportsApi } from "@/lib/api/reports";
import type { ReportTargetType } from "@/lib/api/reports";
import { toast } from "sonner";
import { Modal } from "@/components/ui";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
}) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to report content.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reportsApi.createReport(
        currentUser.id,
        targetType,
        targetId,
        reason,
      );
      toast.success(
        "Thank you for your report. Our team will review it shortly.",
      );
      onClose();
      setReason("");
    } catch (error) {
      console.error("Report error:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const capitalizedTarget = targetType
    ? targetType.charAt(0).toUpperCase() + targetType.slice(1)
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[320px] rounded-[32px] border border-black/10 bg-white/75 p-0 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75 sm:max-w-[340px]"
    >
      <div className="flex flex-col text-center">
        {/* Header Content */}
        <div className="flex flex-col items-center px-6 py-8 pb-6">
          <h2 className="text-[19px] font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
            Report {capitalizedTarget}
          </h2>
          <p className="mt-1.5 px-4 text-[14px] leading-snug text-zinc-500/80 dark:text-zinc-400/80">
            Select a reason for reporting this content. Your report is securely
            anonymous.
          </p>
        </div>

        {/* Input Field (Refined iOS styling) */}
        <div className="px-6 pb-6">
          <textarea
            autoFocus
            rows={3}
            placeholder="Reason for report..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full resize-none rounded-2xl border border-black/5 bg-black/5 p-4 text-[16px] outline-none placeholder:text-zinc-400 focus:border-violet-500/30 dark:border-white/5 dark:bg-white/5 dark:text-zinc-100"
          />
        </div>

        {/* Action Buttons (Strict Actionsheet Style) */}
        <div className="flex flex-col border-t border-black/10 dark:border-white/10">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="flex h-14 w-full items-center justify-center text-[19px] font-semibold text-violet-600 transition-colors active:bg-black/5 disabled:opacity-30 dark:text-violet-400 dark:active:bg-white/5"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-14 w-full items-center justify-center border-t border-black/10 text-[19px] font-medium text-zinc-500 transition-colors active:bg-black/5 dark:border-white/10 dark:text-zinc-400 dark:active:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
