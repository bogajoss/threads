import React, { useState } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { reportsApi } from "@/lib/api/reports";
import type { ReportTargetType } from "@/lib/api/reports";
import { toast } from "sonner";
import { Modal, Button, Input } from "@/components/ui";

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
      title={`Report ${capitalizedTarget}`}
      className="sm:max-w-[440px]"
    >
      <div className="space-y-5 px-5 pb-7 pt-2">
        {/* Header Icon & Info */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 shadow-inner">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-[--foreground]">
              Community Safety First
            </h3>
            <p className="text-xs text-[--muted-foreground] max-w-[280px] mx-auto leading-relaxed">
              Help us keep Sysm safe by reporting content that violates our
              community guidelines.
            </p>
          </div>
        </div>

        {/* Warning Box */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 dark:border-amber-900/30 dark:bg-amber-900/10">
          <div className="flex gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                Note on Reporting
              </p>
              <p className="text-[11px] leading-relaxed text-amber-700/80 dark:text-amber-500/70">
                Reports are handled anonymously. Abuse of the reporting system
                may lead to account restrictions.
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-2.5">
          <Input
            label="Reason for reporting"
            placeholder="Explain why this content should be reviewed..."
            textarea={true}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[120px] focus:ring-violet-500/30 text-sm rounded-xl"
          />
          <p className="text-[10px] text-center text-[--muted-foreground] px-4 italic opacity-80">
            Be as specific as possible to help our moderation team understand
            the issue.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11 text-sm font-bold"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="violet"
            className="flex-1 rounded-xl h-11 text-sm font-black shadow-lg shadow-violet-500/20 active:scale-95 transition-all"
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
