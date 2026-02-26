import React, { useState, useRef } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  UserPlus,
  X,
  Loader2,
  Camera,
  Search,
  ShieldCheck,
  LogOut,
  Trash2,
  UserMinus,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  uploadFile,
  searchUsers,
  addParticipantsToConversation,
  deleteConversation,
  leaveConversation,
  fetchConversationParticipants,
  updateConversation,
  removeParticipant,
} from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: any;
  onUpdate: (data: any) => void;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
  isOpen,
  onClose,
  conversation,
  onUpdate,
}) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [name, setName] = useState(conversation.name || "");
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCreator = currentUser?.id === conversation.creatorId;

  const { 
    data: participantsData, 
    isLoading: loadingParts, 
    fetchNextPage: loadMoreParticipants, 
    hasNextPage: hasMoreParticipants, 
    isFetchingNextPage: isFetchingMoreParticipants 
  } = useInfiniteQuery({
    queryKey: ["conversation-participants", conversation.id],
    queryFn: ({ pageParam = 1 }) => fetchConversationParticipants(conversation.id, pageParam as number, 50),
    enabled: isOpen && !!conversation.id,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 50 ? allPages.length + 1 : undefined;
    },
  });

  const participants = React.useMemo(() => {
    return participantsData?.pages.flatMap(page => page) || [];
  }, [participantsData]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateConversation(conversation.id, data),
    onSuccess: (updated) => {
      onUpdate(updated);
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser?.id],
      });
      addToast("Group updated!");
    },
    onError: (err: any) => {
      addToast(err.message || "Update failed", "error");
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (userId: string) =>
      addParticipantsToConversation(conversation.id, [userId]),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation-participants", conversation.id],
      });
      addToast("Member added!");
      setSearchQuery("");
      setSearchResults([]);
    },
    onError: () => addToast("Failed to add member", "error"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeParticipant(conversation.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation-participants", conversation.id],
      });
      addToast("Member removed from group");
    },
    onError: () => addToast("Failed to remove member", "error"),
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveConversation(conversation.id, currentUser!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser?.id],
      });
      onClose();
      addToast("You left the group.");
      navigate("/m");
    },
    onError: () => addToast("Failed to leave group", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteConversation(conversation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser?.id],
      });
      onClose();
      addToast("Group deleted.");
      navigate("/m");
    },
    onError: () => addToast("Failed to delete group", "error"),
  });

  React.useEffect(() => {
    if (isOpen) {
      setName(conversation.name || "");
      setShowAddMember(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen, conversation.id, conversation.name]);

  const handleSearchMembers = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query);
      const existingIds = participants.map((p: any) => p.id);
      setSearchResults(results.filter((u) => !existingIds.includes(u.id)));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleUpdateAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isCreator) return;

    try {
      const res = await uploadFile(file);
      updateMutation.mutate({ avatar_url: res.url });
    } catch (error) {
      console.error("Upload failed:", error);
      addToast("Failed to update avatar", "error");
    }
  };

  const handleSaveName = () => {
    if (!name.trim() || name === conversation.name || !isCreator) return;
    updateMutation.mutate({ name: name.trim() });
  };

  const handleLeaveGroup = () => {
    if (
      !window.confirm("Are you sure you want to leave this group?") ||
      !currentUser
    )
      return;
    leaveMutation.mutate();
  };

  const handleDeleteGroup = () => {
    if (!isCreator) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this group? All messages and media will be removed forever.",
      )
    )
      return;
    deleteMutation.mutate();
  };

  const handleRemoveMember = (userId: string, userName: string) => {
    if (!isCreator) return;
    if (window.confirm(`Remove ${userName} from this group?`)) {
      removeMemberMutation.mutate(userId);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[340px] rounded-[32px] border border-black/10 bg-white/75 p-0 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75 sm:max-w-[360px]"
    >
      <div className="flex flex-col">
        {/* Header section */}
        <div className="flex flex-col items-center gap-4 px-6 py-8 pb-6 text-center">
          <div className="group relative">
            <Avatar className="size-24 border-4 border-white shadow-xl dark:border-zinc-900">
              <AvatarImage
                src={conversation.avatar}
                className="object-cover"
              />
              <AvatarFallback className="bg-zinc-100 text-2xl font-black text-zinc-400 dark:bg-zinc-800">
                {conversation.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            {isCreator && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 rounded-full bg-violet-600 p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
              >
                <Camera size={16} />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleUpdateAvatar}
            />
          </div>

          <div className="w-full space-y-3">
            {isCreator ? (
              <div className="flex gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Group name"
                  className="h-10 rounded-xl border-black/5 bg-black/5 focus:ring-violet-500/20 dark:border-white/5 dark:bg-white/5 dark:focus:bg-zinc-800"
                />
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  loading={updateMutation.isPending}
                  disabled={name === conversation.name}
                  className="h-10 rounded-xl px-4 font-bold"
                >
                  Save
                </Button>
              </div>
            ) : (
              <h3 className="text-[20px] font-black leading-tight dark:text-white">
                {conversation.name}
              </h3>
            )}
          </div>
        </div>

        {/* Members section */}
        <div className="flex flex-col border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between border-b border-black/5 p-4 px-6 dark:border-white/5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Members · {participants.length}
            </h4>
            {isCreator && (
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className={cn(
                  "flex items-center gap-1.5 text-[11px] font-bold transition-colors",
                  showAddMember
                    ? "text-rose-500"
                    : "text-violet-600 hover:text-violet-700",
                )}
              >
                {showAddMember ? (
                  <>
                    <X size={14} />
                    Cancel
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    Add Member
                  </>
                )}
              </button>
            )}
          </div>

          {showAddMember && isCreator && (
            <div className="animate-in slide-in-from-top-2 border-b border-black/10 p-4 px-6 duration-200 dark:border-white/10">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchMembers(e.target.value)}
                  placeholder="Search people..."
                  className="w-full rounded-xl border-none bg-black/5 py-2.5 pl-10 pr-4 text-[14px] font-medium outline-none focus:ring-2 focus:ring-violet-500/20 dark:bg-white/5"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="mt-3 max-h-[200px] overflow-y-auto rounded-2xl bg-black/5 p-1 dark:bg-white/5">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-white dark:hover:bg-zinc-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate text-[12px] font-bold">
                            {user.name}
                          </div>
                          <div className="truncate text-[10px] text-zinc-500">
                            @{user.handle}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => addMemberMutation.mutate(user.id)}
                        disabled={addMemberMutation.isPending}
                        className="rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold text-white transition-all hover:bg-violet-700 active:scale-95 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {searching && (
                <div className="flex justify-center py-4">
                  <Loader2 size={18} className="animate-spin text-zinc-400" />
                </div>
              )}
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto border-b border-black/10 dark:border-white/10">
            {loadingParts ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 size={24} className="animate-spin text-zinc-300" />
              </div>
            ) : (
              participants.map((user: any) => (
                <div
                  key={user.id}
                  className="flex h-14 items-center gap-3 px-6 transition-colors active:bg-black/5 dark:active:bg-white/5"
                >
                  <Avatar className="size-9">
                    <AvatarImage
                      src={user.avatar_url}
                      className="object-cover"
                    />
                    <AvatarFallback>{user.display_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[14px] font-bold">
                        {user.display_name}
                      </span>
                      {user.id === conversation.creatorId && (
                        <ShieldCheck size={12} className="text-violet-500" />
                      )}
                    </div>
                    <div className="truncate text-[11px] text-zinc-500">
                      @{user.username}
                    </div>
                  </div>
                  {isCreator && user.id !== currentUser?.id && (
                    <button
                      onClick={() => handleRemoveMember(user.id, user.display_name)}
                      disabled={removeMemberMutation.isPending}
                      className="rounded-full p-2 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-500 dark:hover:bg-rose-900/20 active:scale-90"
                      title="Remove Member"
                    >
                      <UserMinus size={18} />
                    </button>
                  )}
                  {user.id === currentUser?.id && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-black text-zinc-500 dark:bg-zinc-800">
                      YOU
                    </span>
                  )}
                </div>
              ))
            )}
            {hasMoreParticipants && (
              <div className="flex justify-center p-4">
                <button
                  onClick={() => loadMoreParticipants()}
                  disabled={isFetchingMoreParticipants}
                  className="text-[13px] font-bold text-violet-600 hover:text-violet-700 disabled:opacity-50"
                >
                  {isFetchingMoreParticipants ? "Loading..." : "Load More Members"}
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col">
            <button
              onClick={handleLeaveGroup}
              disabled={leaveMutation.isPending}
              className="flex h-14 w-full items-center justify-center text-[17px] font-semibold text-rose-600 transition-colors active:bg-rose-500/10 dark:text-rose-500 dark:active:bg-rose-500/20"
            >
              <LogOut size={18} className="mr-2" />
              Leave Group
            </button>
            
            {isCreator && (
              <button
                onClick={handleDeleteGroup}
                disabled={deleteMutation.isPending}
                className="flex h-14 w-full items-center justify-center border-t border-black/10 text-[17px] font-bold text-rose-500 transition-colors active:bg-rose-500/10 dark:border-white/10 dark:active:bg-rose-500/20"
              >
                <Trash2 size={18} className="mr-2" />
                Delete Group
              </button>
            )}

            <button
              onClick={onClose}
              className="flex h-14 w-full items-center justify-center border-t border-black/10 text-[17px] font-medium text-zinc-500 transition-colors active:bg-black/5 dark:border-white/10 dark:active:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GroupSettingsModal;
