import React, { useState } from "react";
import { X, Flag, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { reportsApi } from "@/lib/api/reports";
import type { ReportTargetType } from "@/lib/api/reports";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetType, targetId }) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to report content.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reportsApi.createReport(currentUser.id, targetType, targetId, reason);
      toast.success("Thank you for your report. Our team will review it shortly.");
      onClose();
      setReason("");
    } catch (error) {
      console.error("Report error:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-[--border] bg-[--card] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
              <Flag className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black">Report {targetType}</h2>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-[--secondary]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-amber-500/10 p-4 text-amber-600 dark:text-amber-500">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-xs font-bold leading-relaxed">
              AntiGravity takes community safety seriously. Please describe why this content violates our guidelines.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[--muted-foreground]">
              Reason for reporting (Optional)
            </label>
            <Textarea
              placeholder="Provide more context..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px] rounded-2xl bg-[--secondary]/30 focus:ring-rose-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="flex-1 rounded-2xl shadow-lg shadow-rose-500/20" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Report"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
