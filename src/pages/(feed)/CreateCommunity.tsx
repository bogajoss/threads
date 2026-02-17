import React, { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  createCommunity,
  uploadFile,
  checkCommunityHandleAvailability,
} from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const CreateCommunity: React.FC = () => {
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
          const isAvailable = await checkCommunityHandleAvailability(
            formData.handle,
          );
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
    if (!formData.name || !formData.handle || !formData.description) {
      addToast("Please fill all required fields", "error");
      return;
    }
    if (handleStatus.available === false) {
      addToast("Handle is already taken", "error");
      return;
    }

    createMutation.mutate({
      ...formData,
      creatorId: currentUser?.id,
      isPrivate: formData.isPrivate,
      avatar: formData.avatar
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20 dark:bg-black md:rounded-xl">
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-zinc-100 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Create Community</h1>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <Avatar
                className="h-24 w-24 border-2 border-dashed border-zinc-300 transition-all group-hover:border-violet-500 dark:border-zinc-700"
              >
                <AvatarImage src={formData.avatar} className="object-cover" />
                <AvatarFallback className="bg-zinc-50 dark:bg-zinc-900">
                  <Camera className="h-8 w-8 text-zinc-400 group-hover:text-violet-500" />
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={avatarInputRef}
                onChange={handleFileChange}
              />
            </div>
            <p className="text-sm text-zinc-500">
              Community Icon (Optional)
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Technology Enthusiasts"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Handle
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                  c/
                </span>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      handle: e.target.value.toLowerCase().replace(/\s+/g, ""),
                    })
                  }
                  placeholder="tech-enthusiasts"
                  required
                  className={cn(
                    "w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-9 pr-10 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white",
                    handleStatus.available === true &&
                      "border-green-500 focus:border-green-500 focus:ring-green-500/20",
                    handleStatus.available === false &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {handleStatus.loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
                  ) : handleStatus.available === true ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : handleStatus.available === false ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
              </div>
              {handleStatus.available === false && (
                <p className="mt-1 text-sm text-red-500">
                  This handle is already taken
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What is this community about?"
                required
                rows={4}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) =>
                   setFormData({ ...formData, isPrivate: e.target.checked })
                }
                className="h-5 w-5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 bg-zinc-50 dark:bg-black dark:border-zinc-700"
              />
              <label htmlFor="isPrivate" className="flex flex-col cursor-pointer select-none">
                <span className="font-medium text-zinc-900 dark:text-white">
                  Private Community
                </span>
                <span className="text-sm text-zinc-500">
                  Only approved members can see posts
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={
                createMutation.isPending ||
                loading ||
                handleStatus.available === false
              }
              className="w-full py-6 text-lg font-bold shadow-lg shadow-violet-500/20"
            >
              {createMutation.isPending ? "Creating..." : "Create Community"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
