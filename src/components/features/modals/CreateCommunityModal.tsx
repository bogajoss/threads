import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Loader2, Users, Camera, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { createCommunity, uploadFile, checkCommunityHandleAvailability } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    description: "",
    avatar: "",
    isPrivate: false,
  });
  const [loading, setLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [handleStatus, setHandleStatus] = useState<{
    loading: boolean;
    available: boolean | null;
  }>({ loading: false, available: null });

  useEffect(() => {
    if (formData.handle.length >= 5) {
      const timer = setTimeout(async () => {
        setHandleStatus({ loading: true, available: null });
        try {
          const isAvailable = await checkCommunityHandleAvailability(formData.handle);
          setHandleStatus({ loading: false, available: isAvailable });
        } catch {
          setHandleStatus({ loading: false, available: null });
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setHandleStatus({ loading: false, available: null });
    }
  }, [formData.handle]);

  const createMutation = useMutation({
    mutationFn: (data: any) => createCommunity(data),
    onSuccess: (community: any) => {
      if (!community) return;
      addToast(`Community "${community.name}" created!`);
      queryClient.invalidateQueries({
        queryKey: ["user-communities", currentUser?.id],
      });
      onClose();
      navigate(`/c/${community.handle}`);
    },
    onError: (err: any) => {
      console.error(err);
      addToast(err.message || "Failed to create community", "error");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const res = await uploadFile(file);
      setFormData((prev) => ({ ...prev, avatar: res.url }));
      addToast("Icon uploaded!");
    } catch {
      addToast("Failed to upload icon", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.handle || formData.handle.length < 5 || !currentUser || handleStatus.available === false) return;

    createMutation.mutate({
      name: formData.name,
      handle: formData.handle.toLowerCase().replace(/[^a-z0-9_]/g, ""),
      description: formData.description,
      avatar_url: formData.avatar,
      is_private: formData.isPrivate,
      creator_id: currentUser.id,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !createMutation.isPending && !loading && onClose()}
      title="Create Community"
      className="sm:max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div 
            className="group relative cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            <Avatar className="size-24 border-2 border-dashed border-zinc-200 dark:border-zinc-800 shadow-sm transition-all group-hover:border-violet-500">
              {formData.avatar ? (
                <AvatarImage src={formData.avatar} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-zinc-50 dark:bg-zinc-900">
                  <Users size={32} className="text-zinc-300" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {loading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : (
                <Camera size={24} className="text-white" />
              )}
            </div>
          </div>
          <p className="text-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Community Icon
          </p>
          <input
            type="file"
            ref={avatarInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-bold">Community Name</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border-none bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              placeholder="e.g. Photography Enthusiasts"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-bold">Handle</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-zinc-500">
                c/
              </span>
              <input
                type="text"
                required
                className="w-full rounded-xl border-none bg-zinc-50 dark:bg-zinc-900 pl-8 pr-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                placeholder="photography"
                value={formData.handle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    handle: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, ""),
                  })
                }
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {handleStatus.loading ? (
                  <Loader2 className="size-4 animate-spin text-zinc-400" />
                ) : handleStatus.available === true ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : handleStatus.available === false ? (
                  <XCircle size={18} className="text-rose-500" />
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-bold">
              Description (Optional)
            </label>
            <textarea
              className="min-h-[100px] w-full resize-none rounded-xl border-none bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              placeholder="What is this community about?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Private Community</span>
              <span className="text-[10px] text-zinc-500">
                Only Admins can post in private communities
              </span>
            </div>
            <input
              type="checkbox"
              className="size-5 cursor-pointer rounded-md accent-violet-600"
              checked={formData.isPrivate}
              onChange={(e) =>
                setFormData({ ...formData, isPrivate: e.target.checked })
              }
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={createMutation.isPending || loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={
              createMutation.isPending || loading || !formData.name || !formData.handle || formData.handle.length < 5 || handleStatus.available === false
            }
          >
            {createMutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCommunityModal;