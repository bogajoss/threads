import React, { useState, useRef } from "react"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Camera, Trash2, LogOut, ShieldCheck, Search, UserPlus, X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { uploadFile, searchUsers, addParticipantsToConversation } from "@/lib/api" 
import { supabase } from "@/lib/supabase"
import { useToast } from "@/context/ToastContext"
import { useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

interface GroupSettingsModalProps {
    isOpen: boolean
    onClose: () => void
    conversation: any
    onUpdate: (data: any) => void
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
    isOpen,
    onClose,
    conversation,
    onUpdate,
}) => {
    const { currentUser } = useAuth()
    const { addToast } = useToast()
    const queryClient = useQueryClient()
    
    const [name, setName] = useState(conversation.name || "")
    const [loading, setLoading] = useState(false)
    const [participants, setParticipants] = useState<any[]>([])
    const [loadingParts, setLoadingLoadingParts] = useState(false)

    // Add member state
    const [showAddMember, setShowAddMember] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [searching, setSearching] = useState(false)
    const [addingMembers, setAddingMembers] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const isCreator = currentUser?.id === conversation.creatorId

    const fetchParticipants = async () => {
        setLoadingLoadingParts(true)
        try {
            const { data, error } = await (supabase
                .from("conversation_participants")
                .select(`
                    user:users (
                        id,
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .eq("conversation_id", conversation.id) as any)
            
            if (error) throw error
            setParticipants(data.map((p: any) => p.user))
        } catch (error) {
            console.error("Failed to fetch participants:", error)
        } finally {
            setLoadingLoadingParts(false)
        }
    }

    React.useEffect(() => {
        if (isOpen) {
            fetchParticipants()
            setName(conversation.name || "")
            setShowAddMember(false)
            setSearchQuery("")
            setSearchResults([])
        }
    }, [isOpen, conversation.id])

    const handleSearchMembers = async (query: string) => {
        setSearchQuery(query)
        if (query.length < 2) {
            setSearchResults([])
            return
        }

        setSearching(true)
        try {
            const results = await searchUsers(query)
            // Filter out those who are already participants
            const existingIds = participants.map(p => p.id)
            setSearchResults(results.filter(u => !existingIds.includes(u.id)))
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setSearching(false)
        }
    }

    const handleAddMember = async (userId: string) => {
        setAddingMembers(true)
        try {
            await addParticipantsToConversation(conversation.id, [userId])
            addToast("Member added successfully!")
            // Refresh local participants list
            fetchParticipants()
            // Clear search
            setSearchQuery("")
            setSearchResults([])
        } catch (error) {
            console.error("Add failed:", error)
            addToast("Failed to add member", "error")
        } finally {
            setAddingMembers(false)
        }
    }

    const handleUpdateAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !isCreator) return

        setLoading(true)
        try {
            const res = await uploadFile(file)
            const { error } = await (supabase
                .from("conversations") as any)
                .update({ avatar_url: res.url })
                .eq("id", conversation.id)
            
            if (error) throw error
            onUpdate({ ...conversation, avatar: res.url })
            addToast("Group avatar updated!")
        } catch (error) {
            console.error("Update failed:", error)
            addToast("Failed to update avatar", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleSaveName = async () => {
        if (!name.trim() || name === conversation.name || !isCreator) return

        setLoading(true)
        try {
            const { error } = await (supabase
                .from("conversations") as any)
                .update({ name: name.trim() })
                .eq("id", conversation.id)
            
            if (error) throw error
            onUpdate({ ...conversation, name: name.trim() })
            addToast("Group name updated!")
        } catch (error) {
            console.error("Update failed:", error)
            addToast("Failed to update name", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleLeaveGroup = async () => {
        if (!window.confirm("Are you sure you want to leave this group?") || !currentUser) return
        
        setLoading(true)
        try {
            const { error } = await (supabase
                .from("conversation_participants")
                .delete()
                .eq("conversation_id", conversation.id)
                .eq("user_id", currentUser.id) as any)
            
            if (error) throw error
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            onClose()
            addToast("You left the group.")
            window.location.href = "/messages"
        } catch (error) {
            console.error("Leave failed:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Group Info"
            className="sm:max-w-md"
        >
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col items-center gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800">
                    <div className="group relative">
                        <Avatar className="size-24 border-4 border-white shadow-xl dark:border-zinc-900">
                            <AvatarImage src={conversation.avatar} className="object-cover" />
                            <AvatarFallback className="text-2xl font-black bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
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
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpdateAvatar} />
                    </div>

                    <div className="w-full space-y-3">
                        {isCreator ? (
                            <div className="flex gap-2">
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Group name"
                                    className="h-10"
                                />
                                <Button 
                                    size="sm" 
                                    onClick={handleSaveName} 
                                    loading={loading}
                                    disabled={name === conversation.name}
                                >
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <h3 className="text-center text-xl font-black dark:text-white">{conversation.name}</h3>
                        )}
                    </div>
                </div>

                {/* Members List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                            Members · {participants.length}
                        </h4>
                        {isCreator && (
                            <button 
                                onClick={() => setShowAddMember(!showAddMember)}
                                className={cn(
                                    "flex items-center gap-1.5 text-xs font-bold transition-colors",
                                    showAddMember ? "text-rose-500" : "text-violet-600 hover:text-violet-700"
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
                        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchMembers(e.target.value)}
                                    placeholder="Search people to add..."
                                    className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                                />
                            </div>
                            
                            {searchResults.length > 0 && (
                                <div className="max-h-[200px] overflow-y-auto rounded-xl border border-zinc-100 bg-zinc-50/50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50">
                                    {searchResults.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-8">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <div className="truncate text-xs font-bold">{user.name}</div>
                                                    <div className="truncate text-[10px] text-zinc-500">@{user.handle}</div>
                                                </div>
                                            </div>
                                            <button 
                                                disabled={addingMembers}
                                                onClick={() => handleAddMember(user.id)}
                                                className="rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold text-white transition-all hover:bg-violet-700 active:scale-95 disabled:opacity-50"
                                            >
                                                {addingMembers ? "Adding..." : "Add"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {searching && <div className="py-2 text-center text-xs text-zinc-400">Searching...</div>}
                        </div>
                    )}

                    <div className="max-h-[300px] space-y-1 overflow-y-auto pr-1">
                        {loadingParts ? (
                            <div className="py-8 text-center text-zinc-400">Loading members...</div>
                        ) : (
                            participants.map(user => (
                                <div key={user.id} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                    <Avatar className="size-10">
                                        <AvatarImage src={user.avatar_url} className="object-cover" />
                                        <AvatarFallback>{user.display_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="truncate text-sm font-bold">{user.display_name}</span>
                                            {user.id === conversation.creatorId && (
                                                <ShieldCheck size={12} className="text-violet-500" />
                                            )}
                                        </div>
                                        <div className="truncate text-xs text-zinc-500">@{user.username}</div>
                                    </div>
                                    {user.id === currentUser?.id && (
                                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:bg-zinc-800">You</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col gap-2 pt-2">
                    <Button variant="outline" className="w-full justify-start text-zinc-600 dark:text-zinc-400" onClick={handleLeaveGroup}>
                        <LogOut size={18} className="mr-2" />
                        Leave Group
                    </Button>
                    
                    {isCreator && (
                        <Button variant="ghost" className="w-full justify-start text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20">
                            <Trash2 size={18} className="mr-2" />
                            Delete Group
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default GroupSettingsModal