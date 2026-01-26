import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal, Button, Avatar, AvatarImage, AvatarFallback, VerifiedBadge } from "@/components/ui";
import { Loader2, Camera, X, ShieldCheck, User as UserIcon } from "lucide-react";
import { updateCommunity, uploadFile, fetchCommunityMembers, updateMemberRole } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

export default function EditCommunityModal({ isOpen, onClose, community, onUpdate }) {
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    description: "",
    avatar: "",
    cover: "",
    isPrivate: false,
  });
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const isOwner = currentUser?.id === community?.creatorId;

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
      // Clear search when opening
      setMemberSearch("");
      setMembers([]);
      setSearchTriggered(false);
    }
  }, [community, isOpen, isOwner]);

  const loadMembers = useCallback(async (query = "") => {
    if (!query && !isOwner) return;
    setLoadingMembers(true);
    setSearchTriggered(true);
    try {
      const data = await fetchCommunityMembers(community.id, query);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoadingMembers(false);
    }
  }, [community.id, isOwner]);

  // Simple debounce for search
  useEffect(() => {
    if (memberSearch.length >= 2) {
      const timer = setTimeout(() => {
        loadMembers(memberSearch);
      }, 500);
      return () => clearTimeout(timer);
    } else if (memberSearch.length === 0) {
      setMembers([]);
      setSearchTriggered(false);
    }
  }, [memberSearch, loadMembers]);

  const handleToggleAdmin = async (memberUserId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    try {
      await updateMemberRole(community.id, memberUserId, newRole);
      setMembers(prev => prev.map(m =>
        m.userId === memberUserId ? { ...m, role: newRole } : m
      ));
      addToast(`Role updated to ${newRole}`);
    } catch {
      addToast("Failed to update role", "error");
    }
  };

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
        handle: formData.handle.toLowerCase().replace(/[^a-z0-9-]/g, ''),
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
                  <label className="text-sm font-bold ml-1 text-rose-500">Handle (Experimental)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-sm">c/</span>
                    <input
                      type="text"
                      required
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium text-sm"
                      value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
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

                {isOwner && (
                  <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-col gap-1 px-1">
                      <span className="text-sm font-bold">Manage Members</span>
                      <span className="text-[10px] text-zinc-500">Search for members to manage their roles</span>
                    </div>

                    <div className="px-1">
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search members by name or handle..."
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        />
                      </div>
                    </div>

                    {searchTriggered && (
                      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[300px] overflow-y-auto mt-2">
                        {loadingMembers ? (
                          <div className="p-8 flex justify-center">
                            <Loader2 className="animate-spin text-violet-500" />
                          </div>
                        ) : members.length === 0 ? (
                          <div className="p-8 text-center text-sm text-zinc-500 font-medium">No results found for "{memberSearch}"</div>
                        ) : (
                          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {members.map((m) => (
                              <div key={m.userId} className="p-3 flex items-center justify-between hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <Avatar className="size-9 border border-zinc-200 dark:border-zinc-700">
                                    <AvatarImage src={m.user.avatar_url} />
                                    <AvatarFallback>{m.user.username?.[0]?.toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-bold truncate max-w-[120px]">{m.user.display_name}</span>
                                      {m.user.is_verified && <VerifiedBadge />}
                                    </div>
                                    <span className="text-xs text-zinc-500">@{m.user.username}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {m.userId === community.creatorId ? (
                                    <span className="text-[10px] font-bold px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">OWNER</span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdmin(m.userId, m.role)}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${m.role === 'admin'
                                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400'
                                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                                        }`}
                                    >
                                      {m.role === 'admin' ? (
                                        <>
                                          <ShieldCheck size={14} />
                                          Remove Admin
                                        </>
                                      ) : (
                                        <>
                                          <UserIcon size={14} />
                                          Make Admin
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
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
