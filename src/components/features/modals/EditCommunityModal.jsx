import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "@/components/ui";
import { Loader2, Camera } from "lucide-react";
import { updateCommunity, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function EditCommunityModal({ isOpen, onClose, community, onUpdate }) {
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

  // Image Upload State
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    handleUpload(file, type);
  };

  const handleUpload = async (file, type) => {
    setLoading(true);
    try {
      const res = await uploadFile(file);
      setFormData(prev => ({ ...prev, [type]: res.url }));
      addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded!`);
    } catch {
      addToast(`Failed to upload ${type}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.handle || !community) return;

    setLoading(true);
    try {
      const updated = await updateCommunity(community.id, {
        name: formData.name,
        handle: formData.handle.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        description: formData.description,
        avatar_url: formData.avatar,
        cover_url: formData.cover,
        is_private: formData.isPrivate,
      });

      addToast("Community updated successfully!");
      if (onUpdate) onUpdate(updated);
      onClose();
    } catch (err) {
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
        <div className="space-y-6 max-h-[85vh] overflow-y-auto px-1">
          {/* Cover & Avatar Upload Section */}
          <div className="relative">
            <div className="h-32 sm:h-40 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden relative group">
              {formData.cover && (
                <img src={formData.cover} className="w-full h-full object-cover" alt="" />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="p-3 bg-black/60 text-white rounded-full hover:bg-black transition-all"
                >
                  <Camera size={20} />
                </button>
              </div>
            </div>

            <div className="absolute -bottom-8 left-6">
              <div className="relative group size-20 sm:size-24 rounded-2xl border-4 border-white dark:border-black bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-lg">
                <img src={formData.avatar} className="size-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="text-white p-2"
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
                  <label className="text-sm font-bold ml-1">Community Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold ml-1">Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-sm">c/</span>
                    <input
                      type="text"
                      required
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium text-sm"
                      value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold ml-1">Description</label>
                  <textarea
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all min-h-[100px] resize-none font-medium"
                    placeholder="What is this community about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Private Community</span>
                    <span className="text-[10px] text-zinc-500">Only Admins can post in private communities</span>
                  </div>
                  <input
                    type="checkbox"
                    className="size-5 rounded-md accent-violet-600 cursor-pointer"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 py-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl h-11 font-bold"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-11 font-bold bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
                  disabled={loading || !formData.name}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={avatarInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'avatar')}
        />
        <input
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'cover')}
        />
      </Modal>
    </>
  );
}