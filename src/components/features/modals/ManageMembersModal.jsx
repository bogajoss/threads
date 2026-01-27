import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Avatar, AvatarImage, AvatarFallback, VerifiedBadge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { Loader2, ShieldCheck, User as UserIcon, Search } from "lucide-react";
import { fetchCommunityMembers, updateMemberRole } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

export default function ManageMembersModal({ isOpen, onClose, community }) {
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const isOwner = currentUser?.id === community?.creatorId;

  const loadMembers = useCallback(async (query = "") => {
    if (!community?.id) return;
    setLoading(true);
    setSearchTriggered(true);
    try {
      const data = await fetchCommunityMembers(community.id, query);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members:", err);
      addToast("Failed to load members", "error");
    } finally {
      setLoading(false);
    }
  }, [community?.id, addToast]);

  useEffect(() => {
    if (isOpen && community?.id) {
        loadMembers("");
    } else {
        setMemberSearch("");
        setMembers([]);
        setSearchTriggered(false);
    }
  }, [isOpen, community?.id, loadMembers]);

  // Simple debounce for search
  useEffect(() => {
    if (memberSearch.length >= 2) {
      const timer = setTimeout(() => {
        loadMembers(memberSearch);
      }, 500);
      return () => clearTimeout(timer);
    } else if (memberSearch.length === 0 && searchTriggered) {
        loadMembers("");
    }
  }, [memberSearch, loadMembers, searchTriggered]);

  const handleToggleAdmin = async (memberUserId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'member' : 'admin';
      await updateMemberRole(community.id, memberUserId, newRole);
      setMembers(prev => prev.map(m =>
        m.userId === memberUserId ? { ...m, role: newRole } : m
      ));
      addToast(`Role updated to ${newRole}`);
    } catch {
      addToast("Failed to update role", "error");
    }
  };

  const adminsList = useMemo(() => 
    members.filter(m => m.role === 'admin' || m.userId === community.creatorId),
  [members, community.creatorId]);

  const membersList = useMemo(() => 
    members.filter(m => m.role !== 'admin' && m.userId !== community.creatorId),
  [members, community.creatorId]);

  const renderMemberList = (list) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-violet-500" size={32} />
        </div>
      );
    }

    if (list.length > 0) {
      return (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {list.map((m) => (
            <div key={m.userId} className="p-4 flex items-center justify-between hover:bg-white dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <AvatarImage src={m.user.avatar_url} />
                  <AvatarFallback>{m.user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold truncate max-w-[140px] dark:text-white">
                      {m.user.display_name}
                    </span>
                    {m.user.is_verified && <VerifiedBadge />}
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">@{m.user.username}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {m.userId === community.creatorId ? (
                  <span className="text-[10px] font-black px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full tracking-wider">OWNER</span>
                ) : (
                  isOwner && (
                    <button
                      onClick={() => handleToggleAdmin(m.userId, m.role)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                        m.role === 'admin'
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {m.role === 'admin' ? (
                        <>
                          <ShieldCheck size={14} />
                          Admin
                        </>
                      ) : (
                        <>
                          <UserIcon size={14} />
                          Make Admin
                        </>
                      )}
                    </button>
                  )
                )}
                {!isOwner && m.role === 'admin' && m.userId !== community.creatorId && (
                    <span className="text-[10px] font-black px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-full tracking-wider">ADMIN</span>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
          <UserIcon size={24} className="text-zinc-400" />
        </div>
        <p className="text-sm font-bold dark:text-white">No {activeTab} found</p>
        <p className="text-xs text-zinc-500 mt-1">Try a different search term</p>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Members"
      className="sm:max-w-md"
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-11">
            <TabsTrigger value="members" className="flex-1 rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 dark:text-zinc-400 dark:data-[state=active]:text-white">
              Members ({membersList.length})
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex-1 rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 dark:text-zinc-400 dark:data-[state=active]:text-white">
              Admins ({adminsList.length})
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden min-h-[300px] max-h-[400px] overflow-y-auto">
            <TabsContent value="members" className="m-0">
              {renderMemberList(membersList)}
            </TabsContent>
            <TabsContent value="admins" className="m-0">
              {renderMemberList(adminsList)}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Modal>
  );
}