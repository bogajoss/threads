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
      title="Chat Details"
      className="sm:max-w-md"
    >
      <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800">
            <Avatar className="size-24 border-4 border-white shadow-xl dark:border-zinc-900">
              <AvatarImage src={user.avatar} className="object-cover" />
              <AvatarFallback className="text-2xl font-black bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                {user.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-black dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm font-medium text-zinc-500">
                @{user.handle}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={handleViewProfile}
            >
              <User size={16} className="mr-2" />
              View Profile
            </Button>
          </div>

          {(user.bio || user.location || user.website) && (
            <div className="space-y-3 px-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                About
              </h4>
              <div className="space-y-2">
                {user.bio && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {user.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {user.location && (
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin size={14} />
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
                      className="flex items-center gap-1 text-xs text-violet-600 hover:underline"
                    >
                      <LinkIcon size={14} />
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
              Privacy & Support
            </h4>

            <button className="flex w-full items-center justify-between rounded-xl p-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-2 dark:bg-zinc-800 text-zinc-500">
                  <Ban size={18} />
                </div>
                <span>Block @{user.handle}</span>
              </div>
              <ExternalLink size={14} className="text-zinc-400" />
            </button>

            <button className="flex w-full items-center justify-between rounded-xl p-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 p-2 dark:bg-zinc-800 text-zinc-500">
                  <ShieldAlert size={18} />
                </div>
                <span>Report User</span>
              </div>
              <ExternalLink size={14} className="text-zinc-400" />
            </button>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2 pb-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                onClick={handleDeleteConversation}
                loading={loading}
              >
                <Trash2 size={18} className="mr-2" />
                Delete Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DMSettingsModal;