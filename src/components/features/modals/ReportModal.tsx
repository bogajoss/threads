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
      className="max-w-[320px] rounded-[22px] border-none bg-white/85 p-0 backdrop-blur-2xl dark:bg-zinc-900/85 sm:max-w-[340px]"
    >
      <div className="flex flex-col text-center">
        {/* Header Content */}
        <div className="flex flex-col items-center px-6 py-6 pb-5">
          <h2 className="text-[17px] font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
            Report {capitalizedTarget}
          </h2>
          <p className="mt-1 px-2 text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">
            Why are you reporting this content? Your report is anonymous.
          </p>
        </div>

        {/* Input Field */}
        <div className="px-6 pb-6">
          <textarea
            autoFocus
            rows={3}
            placeholder="Reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full resize-none rounded-xl border border-zinc-200/50 bg-zinc-100/50 p-3 text-[15px] outline-none placeholder:text-zinc-400 focus:border-violet-500/50 dark:border-zinc-800/50 dark:bg-zinc-800/50 dark:text-zinc-100"
          />
        </div>

        {/* Action Buttons (iOS Style) */}
        <div className="flex flex-col border-t border-zinc-200/50 dark:border-zinc-800/50">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="flex h-[50px] w-full items-center justify-center text-[17px] font-semibold text-violet-600 transition-colors active:bg-zinc-100/50 disabled:opacity-30 dark:text-violet-400 dark:active:bg-zinc-800/50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-[50px] w-full items-center justify-center border-t border-zinc-200/50 text-[17px] font-normal text-zinc-500 transition-colors active:bg-zinc-100/50 dark:border-zinc-800/50 dark:text-zinc-400 dark:active:bg-zinc-800/50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
