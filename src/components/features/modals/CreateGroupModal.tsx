import React, { useState, useRef } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Search, X, Users, Check, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { searchUsers, createGroupConversation, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (convId: string) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [groupName, setGroupName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results.filter((u) => u.id !== currentUser?.id));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const toggleUser = (user: any) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleCreate = async () => {
    if (!currentUser || !groupName.trim() || selectedUsers.length === 0) return;

    setLoading(true);
    try {
      let avatarUrl = null;
      if (avatarFile) {
        const res = await uploadFile(avatarFile);
        avatarUrl = res.url;
      }

      const participantIds = selectedUsers.map((u) => u.id);
      const convId = await createGroupConversation(
        currentUser.id,
        groupName,
        participantIds,
        avatarUrl,
      );

      queryClient.invalidateQueries({
        queryKey: ["conversations", currentUser.id],
      });
      addToast("Group created successfully!");
      onCreated(convId);
      onClose();
      // Reset state
      setGroupName("");
      setSelectedUsers([]);
      setAvatarFile(null);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to create group:", error);
      addToast("Failed to create group", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Group"
      className="sm:max-w-md"
    >
      <div className="px-6 pb-6 pt-8 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div
            className="group relative cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="size-20 border-2 border-zinc-100 dark:border-zinc-800 shadow-md">
              {avatarFile ? (
                <AvatarImage
                  src={URL.createObjectURL(avatarFile)}
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                  <Users size={32} className="text-zinc-300" />
                </div>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={20} className="text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />
          </div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Group Avatar
          </span>
        </div>

        <div className="space-y-6">
          <Input
            label="Group Name"
            placeholder="Team Discussion, Weekend Plans..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-500 ml-1">
              Add Members
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search people..."
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
          </div>

          {/* Selected Users Chips */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 py-1">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-violet-600 dark:bg-violet-500/20"
                >
                  <Avatar className="size-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  <button
                    onClick={() => toggleUser(user)}
                    className="hover:text-violet-800"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Results */}
          <div className="max-h-[240px] space-y-1 overflow-y-auto pr-1">
            {searching ? (
              <div className="py-4 text-center text-xs text-zinc-500">
                Searching...
              </div>
            ) : searchQuery.length >= 2 && searchResults.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-500">
                No users found
              </div>
            ) : (
              searchResults.map((user) => {
                const isSelected = selectedUsers.find((u) => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleUser(user)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors",
                      isSelected
                        ? "bg-violet-50 dark:bg-violet-900/20"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    )}
                  >
                    <Avatar className="size-9">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-bold">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-zinc-500">
                        @{user.handle}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border-2 transition-all",
                        isSelected
                          ? "border-violet-500 bg-violet-500 text-white"
                          : "border-zinc-200 dark:border-zinc-700",
                      )}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <Button
          className="w-full py-3"
          onClick={handleCreate}
          loading={loading}
          disabled={!groupName.trim() || selectedUsers.length === 0}
        >
          <Users className="mr-2" size={18} />
          Create Group
        </Button>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;
