import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  User,
  ShieldAlert,
  Ban,
  Trash2,
  ExternalLink,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { deleteConversation } from "@/lib/api";
import ReportModal from "./ReportModal";

interface DMSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  conversationId: string;
}

const DMSettingsModal: React.FC<DMSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  conversationId,
}) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);

  if (!user) return null;

  const handleViewProfile = () => {
    onClose();
    navigate(`/u/${user.handle}`);
  };

  const handleDeleteConversation = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this entire conversation? This cannot be undone.",
      )
    )
      return;

    setLoading(true);
    try {
      await deleteConversation(conversationId);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      addToast("Conversation deleted.");
      onClose();
      navigate("/m");
    } catch (err) {
      console.error("Delete failed:", err);
      addToast("Failed to delete conversation", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[320px] rounded-[32px] border border-black/10 bg-white/75 p-0 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75 sm:max-w-[340px]"
    >
      <div className="flex flex-col">
        {/* Header section */}
        <div className="flex flex-col items-center gap-4 px-6 py-8 pb-6 text-center">
          <Avatar className="size-24 border-4 border-white shadow-xl dark:border-zinc-900">
            <AvatarImage src={user.avatar} className="object-cover" />
            <AvatarFallback className="bg-zinc-100 text-2xl font-black text-zinc-400 dark:bg-zinc-800">
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="text-[20px] font-black leading-tight dark:text-white">
              {user.name}
            </h3>
            <p className="text-[14px] font-medium text-zinc-500">@{user.handle}</p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="h-8 rounded-full bg-zinc-100 px-4 text-xs font-bold transition-transform active:scale-95 dark:bg-zinc-800"
            onClick={handleViewProfile}
          >
            <User size={14} className="mr-1.5" />
            View Profile
          </Button>
        </div>

        {/* Content sections */}
        <div className="flex flex-col border-t border-black/10 dark:border-white/10">
          {(user.bio || user.location || user.website) && (
            <div className="border-b border-black/10 p-4 px-6 dark:border-white/10">
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                About
              </h4>
              <div className="space-y-3">
                {user.bio && (
                  <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {user.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {user.location && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                      <MapPin size={12} />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={
                        user.website.startsWith("http")
                          ? user.website
                          : `https://${user.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-bold text-violet-600 hover:underline"
                    >
                      <LinkIcon size={12} />
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action rows (iOS style) */}
          <div className="flex flex-col">
            <button className="flex h-14 w-full items-center justify-between border-b border-black/10 px-6 transition-colors active:bg-black/5 dark:border-white/10 dark:active:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-2 dark:bg-zinc-800">
                  <Ban size={18} className="text-zinc-500" />
                </div>
                <span className="text-[16px] font-semibold text-zinc-700 dark:text-zinc-200">
                  Block @{user.handle}
                </span>
              </div>
              <ExternalLink size={14} className="text-zinc-400" />
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="flex h-14 w-full items-center justify-between border-b border-black/10 px-6 transition-colors active:bg-black/5 dark:border-white/10 dark:active:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-2 dark:bg-zinc-800">
                  <ShieldAlert size={18} className="text-zinc-500" />
                </div>
                <span className="text-[16px] font-semibold text-zinc-700 dark:text-zinc-200">
                  Report User
                </span>
              </div>
              <ExternalLink size={14} className="text-zinc-400" />
            </button>

            <button
              onClick={handleDeleteConversation}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center text-[17px] font-bold text-rose-500 transition-colors active:bg-rose-500/10 dark:active:bg-rose-500/20"
            >
              <Trash2 size={18} className="mr-2" />
              {loading ? "Deleting..." : "Delete Conversation"}
            </button>

            <button
              onClick={onClose}
              className="flex h-14 w-full items-center justify-center border-t border-black/10 text-[17px] font-medium text-zinc-500 transition-colors active:bg-black/5 dark:border-white/10 dark:active:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="user"
        targetId={user.id}
      />
    </Modal>
  );
};

export default DMSettingsModal;
