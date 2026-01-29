import React, { useState } from "react"
import Modal from "@/components/ui/modal"
import Button from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
// @ts-ignore
import { createCommunity } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"

interface CreateCommunityModalProps {
    isOpen: boolean
    onClose: () => void
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { currentUser } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        handle: "",
        description: "",
        isPrivate: false,
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.handle || !currentUser) return

        setLoading(true)
        try {
            // 1. Create community
            const community = await createCommunity({
                name: formData.name,
                handle: formData.handle.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                description: formData.description,
                is_private: formData.isPrivate,
                creator_id: currentUser.id,
            })

            if (!community) throw new Error("Failed to create community")

            // 2. Automatically make creator an ADMIN
            const { error: memberError } = await (supabase
                .from("community_members") as any)
                .insert([
                    {
                        community_id: community.id,
                        user_id: currentUser.id,
                        role: "admin",
                    },
                ])

            if (memberError) throw memberError

            addToast(`Community "${community.name}" created!`)
            onClose()
            navigate(`/c/${community.handle}`)
        } catch (err: any) {
            console.error(err)
            addToast(err.message || "Failed to create community", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => !loading && onClose()}
            title="Create Community"
            className="sm:max-w-md"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-3 flex size-20 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-black">
                        <Users size={32} className="text-violet-600" />
                    </div>
                    <p className="max-w-[200px] text-center text-xs font-medium text-zinc-500">
                        Communities are where people with shared interests connect.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="ml-1 text-sm font-bold">Community Name</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                            placeholder="e.g. Photography Enthusiasts"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="ml-1 text-sm font-bold">Handle</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-zinc-500">
                                c/
                            </span>
                            <input
                                type="text"
                                required
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-8 pr-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                                placeholder="photography"
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
                        <label className="ml-1 text-sm font-bold">
                            Description (Optional)
                        </label>
                        <textarea
                            className="min-h-[100px] w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900"
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

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={loading || !formData.name || !formData.handle}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Create"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default CreateCommunityModal
