import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Modal,
  Avatar,
  AvatarImage,
  AvatarFallback,
  VerifiedIcon,
  AdminIcon,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SkeletonUser,
} from "@/components/ui";
import { ShieldCheck, User as UserIcon, Search } from "lucide-react";
import { fetchCommunityMembers, updateMemberRole } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: any;
}

export default function ManageMembersModal({
  isOpen,
  onClose,
  community,
}: ManageMembersModalProps) {
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const isOwner = currentUser?.id === community?.creatorId;

  const loadMembers = useCallback(
    async (query = "") => {
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
    },
    [community?.id, addToast],
  );

  useEffect(() => {
    if (isOpen && community?.id) {
      loadMembers("");
    } else {
      setMemberSearch("");
      setMembers([]);
      setSearchTriggered(false);
    }
  }, [isOpen, community?.id, loadMembers]);

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

  const handleToggleAdmin = async (
    memberUserId: string,
    currentRole: string,
  ) => {
    try {
      const newRole = currentRole === "admin" ? "member" : "admin";
      await updateMemberRole(community.id, memberUserId, newRole);
      setMembers((prev) =>
        prev.map((m) =>
          m.userId === memberUserId ? { ...m, role: newRole } : m,
        ),
      );
      addToast(`Role updated to ${newRole}`);
    } catch {
      addToast("Failed to update role", "error");
    }
  };

  const adminsList = useMemo(
    () =>
      members.filter(
        (m) => m.role === "admin" || m.userId === community.creatorId,
      ),
    [members, community.creatorId],
  );

  const membersList = useMemo(
    () =>
      members.filter(
        (m) => m.role !== "admin" && m.userId !== community.creatorId,
      ),
    [members, community.creatorId],
  );

  const renderMemberList = (list: any[]) => {
    if (loading) {
      return (
        <div className="flex flex-col">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonUser key={i} />
          ))}
        </div>
      );
    }

    if (list.length > 0) {
      return (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {list.map((m) => (
            <div
              key={m.userId}
              className="flex items-center justify-between p-4 transition-colors hover:bg-white dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-zinc-200 shadow-sm dark:border-zinc-700">
                  <AvatarImage src={m.user.avatar_url} />
                  <AvatarFallback>
                    {m.user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-bold dark:text-zinc-200">
                      {m.user.name}
                    </span>
                    {m.user.role === "admin" && (
                      <AdminIcon size={18} />
                    )}
                    {m.user.is_verified && (
                      <VerifiedIcon size={14} />
                    )}
                  </div>
                  <span className="text-xs font-medium text-zinc-500">
                    @{m.user.username}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {m.userId === community.creatorId ? (
                  <span className="rounded-full bg-zinc-200 px-3 py-1 text-[10px] font-black tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    OWNER
                  </span>
                ) : (
                  isOwner && (
                    <button
                      onClick={() => handleToggleAdmin(m.userId, m.role)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
                        m.role === "admin"
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {m.role === "admin" ? (
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
                {!isOwner &&
                  m.role === "admin" &&
                  m.userId !== community.creatorId && (
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black tracking-wider text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                      ADMIN
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <UserIcon size={24} className="text-zinc-400" />
        </div>
        <p className="text-sm font-bold dark:text-white">
          No {activeTab} found
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Try a different search term
        </p>
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
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-11 w-full rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
            <TabsTrigger
              value="members"
              className="flex-1 rounded-lg font-bold data-[state=active]:bg-white dark:text-zinc-400 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white"
            >
              Members ({membersList.length})
            </TabsTrigger>
            <TabsTrigger
              value="admins"
              className="flex-1 rounded-lg font-bold data-[state=active]:bg-white dark:text-zinc-400 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white"
            >
              Admins ({adminsList.length})
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[400px] min-h-[300px] mt-4 overflow-y-auto overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
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
