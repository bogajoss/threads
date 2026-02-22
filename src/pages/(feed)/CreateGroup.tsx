import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Search, X, Check, Camera, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { searchUsers, createGroupConversation, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const CreateGroup: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string>("");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Revoke the old object URL before creating a new one
      setPreviewAvatar((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    }
  };

  // Revoke the blob URL when the component unmounts
  useEffect(() => {
    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!currentUser || !groupName.trim() || selectedUsers.length === 0) {
      addToast("Please provide a group name and select at least one member", "error");
      return;
    }

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
      navigate(`/m/${convId}`);
    } catch (error) {
      console.error("Failed to create group:", error);
      addToast("Failed to create group", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 dark:bg-black md:rounded-xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">New Group</h1>
        </div>
        <Button
          onClick={handleCreate}
          disabled={loading || !groupName.trim() || selectedUsers.length === 0}
          className="rounded-full px-6 py-2 text-sm font-bold shadow-none"
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* Name and Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="h-24 w-24 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
              <AvatarImage src={previewAvatar} className="object-cover" />
              <AvatarFallback className="bg-zinc-50 dark:bg-zinc-900">
                <Camera className="h-8 w-8 text-zinc-400 group-hover:text-violet-500" />
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <div className="w-full max-w-md">
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Name"
              className="text-center font-bold text-lg h-12"
            />
          </div>
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
                <button onClick={() => toggleUser(user)} className="ml-1 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="space-y-4">
          <h3 className="font-bold text-zinc-900 dark:text-white">Add Members</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            {searching && <div className="text-center py-4 text-zinc-500">Searching...</div>}

            {!searching && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-4 text-zinc-500">No users found</div>
            )}

            {searchResults.map((user) => {
              const isSelected = selectedUsers.some((u) => u.id === user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user)}
                  className={cn(
                    "flex items-center justify-between rounded-xl p-3 cursor-pointer transition-colors",
                    isSelected ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 dark:text-white">{user.name}</span>
                      <span className="text-sm text-zinc-500">@{user.handle}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                    isSelected
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "border-zinc-300 dark:border-zinc-600"
                  )}>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateGroup;
