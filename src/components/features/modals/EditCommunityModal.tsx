import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "@/components/ui";
import { Loader2, Camera } from "lucide-react";
import { updateCommunity, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface EditCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: any;
  onUpdate?: (updated: any) => void;
}

export default function EditCommunityModal({
  isOpen,
  onClose,
  community,
  onUpdate,
}: EditCommunityModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    description: "",
    avatar: "",
    cover: "",
    isPrivate: false,
  });
  const [loading, setLoading] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (community && isOpen) {
      setFormData({
        name: community.name || "",
        handle: community.handle || "",
        description: community.description || "",
        avatar: community.avatar || "",
        cover: community.cover || "",
        isPrivate: community.isPrivate || false,
      });
    }
  }, [community, isOpen]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUpload(file, type);
  };

  const handleUpload = async (file: File, type: string) => {
    setLoading(true);
    try {
      const res = await uploadFile(file);
      setFormData((prev) => ({ ...prev, [type]: res.url }));
      addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded!`);
    } catch {
      addToast(`Failed to upload ${type}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.handle || !community) return;

    setLoading(true);
    try {
      const updated = await updateCommunity(community.id, {
        name: formData.name,
        handle: formData.handle.toLowerCase().replace(/[^a-z0-9_]/g, ""),
        description: formData.description,
        avatar_url: formData.avatar,
        cover_url: formData.cover,
        is_private: formData.isPrivate,
      });

      addToast("Community updated successfully!");
      if (onUpdate) onUpdate(updated);
      onClose();
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Failed to update community", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => !loading && onClose()}
        title="Edit Community"
        className="sm:max-w-xl"
      >
        <div className="max-h-[85vh] space-y-6 overflow-y-auto px-1">
          <div className="relative">
            <div className="group relative h-32 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 sm:h-40">
              {formData.cover && (
                <img
                  src={formData.cover}
                  className="h-full w-full object-cover"
                  alt=""
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="rounded-full bg-black/60 p-3 text-white transition-all hover:bg-black"
                >
                  <Camera size={20} />
                </button>
              </div>
            </div>

            <div className="absolute -bottom-8 left-6">
              <div className="group relative size-20 overflow-hidden rounded-2xl border-4 border-white bg-zinc-100 shadow-lg dark:border-black dark:bg-zinc-800 sm:size-24">
                <img
                  src={formData.avatar}
                  className="size-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="p-2 text-white"
                  >
                    <Camera size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="ml-1 text-sm font-bold">
                    Community Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 font-medium outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="ml-1 text-sm font-bold">Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">
                      c/
                    </span>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-8 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900"
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
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="ml-1 text-sm font-bold">Description</label>
                  <textarea
                    className="min-h-[100px] w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 font-medium outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                    placeholder="What is this community about?"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
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

              <div className="flex gap-3 py-2 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 rounded-xl font-bold"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 flex-1 rounded-xl bg-zinc-900 font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  disabled={loading || !formData.name}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <input
          type="file"
          ref={avatarInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "avatar")}
        />
        <input
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "cover")}
        />
      </Modal>
    </>
  );
}