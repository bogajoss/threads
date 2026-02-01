import React, { useState, useRef, useEffect } from "react"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import { useQuery } from "@tanstack/react-query"
import {
    ImageIcon,
    BarChart2,
    X,
    Trash2,
    Globe,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { usePosts } from "@/context/PostContext"
import { useToast } from "@/context/ToastContext"
// @ts-ignore
import { uploadFile, fetchUserCommunities } from "@/lib/api"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MediaUploader from "./MediaUploader"

interface CreatePostModalProps {
    isOpen: boolean
    onClose: () => void
    initialCommunity?: any
}

interface SelectedFile {
    id: string
    file: File
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    initialCommunity,
}) => {
    const { currentUser } = useAuth()
    const { addPost } = usePosts()
    const { addToast } = useToast()

    const [postContent, setPostContent] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
    const [customThumbnails, setCustomThumbnails] = useState<
        Record<string, File>
    >({})
    const [showPoll, setShowPoll] = useState(false)
    const [pollData, setPollData] = useState({
        options: ["", ""],
        duration: "1 day",
    })
    const [loading, setLoading] = useState(false)
    const [selectedCommunity, setSelectedCommunity] = useState<any | null>(null)

    // Set initial community only when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedCommunity(initialCommunity || null)
        }
    }, [isOpen, initialCommunity])

    // Fetch user's communities
    const { data: userCommunities = [] } = useQuery({
        queryKey: ["user-communities", currentUser?.id],
        queryFn: () => fetchUserCommunities(currentUser!.id),
        enabled: !!currentUser?.id,
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files).map((file) => ({
            id: Math.random().toString(36).substring(2, 11),
            file,
        }))
        setSelectedFiles((prev) => [...prev, ...files])
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        const files = e.clipboardData.files
        if (files && files.length > 0) {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"))
            if (imageFiles.length > 0) {
                e.preventDefault()
                const newFiles: SelectedFile[] = imageFiles.map(file => ({
                    id: Math.random().toString(36).substring(2, 11),
                    file,
                }))
                setSelectedFiles((prev) => [...prev, ...newFiles])
            }
        }
    }

    const handleAddPollOption = () => {
        if (pollData.options.length < 4) {
            setPollData((prev) => ({ ...prev, options: [...prev.options, ""] }))
        }
    }

    const handleRemovePollOption = (index: number) => {
        setPollData((prev) => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index),
        }))
    }

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollData.options]
        newOptions[index] = value
        setPollData((prev) => ({ ...prev, options: newOptions }))
    }

    const handleCreatePost = async (e: React.MouseEvent) => {
        e.preventDefault()
        if ((!postContent.trim() && selectedFiles.length === 0) || !currentUser)
            return

        setLoading(true)
        try {
            const uploadedMedia = []
            for (let i = 0; i < selectedFiles.length; i++) {
                const item = selectedFiles[i]
                const customPoster = customThumbnails[item.id] || null
                const res = await uploadFile(item.file, "media", customPoster)
                uploadedMedia.push(res)
            }

            let poll = null
            if (showPoll && pollData.options.some((o) => o.trim())) {
                poll = {
                    options: pollData.options
                        .filter((o) => o.trim())
                        .map((text, idx) => ({
                            id: idx + 1,
                            text,
                            votes: 0,
                        })),
                    ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                }
            }

            await addPost({
                content: postContent,
                media: uploadedMedia,
                poll,
                type:
                    uploadedMedia.length > 0
                        ? uploadedMedia[0].type === "video"
                            ? "video"
                            : "image"
                        : poll
                            ? "poll"
                            : "text",
                userId: currentUser.id,
                communityId: selectedCommunity?.id || null,
            })

            setPostContent("")
            setSelectedFiles([])
            setShowPoll(false)
            setPollData({ options: ["", ""], duration: "1 day" })
            setSelectedCommunity(null)
            onClose()
            addToast("Post published!")
        } catch (err) {
            console.error("Failed to create post:", err)
            addToast("Failed to publish post.", "error")
        } finally {
            setLoading(false)
        }
    }

    const footerActions = (
        <div className="flex w-full items-center justify-between pt-2">
            <div className="flex gap-1">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full p-2 text-violet-600 transition-all hover:bg-violet-50 active:scale-95 dark:text-violet-400 dark:hover:bg-violet-900/20"
                    title="Attach media"
                >
                    <ImageIcon size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => setShowPoll(!showPoll)}
                    className={`rounded-full p-2 transition-all active:scale-95 ${showPoll ? "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400" : "text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/20"}`}
                    title="Add poll"
                >
                    <BarChart2 size={20} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
                <Button
                    onClick={handleCreatePost}
                    disabled={
                        (!postContent.trim() && selectedFiles.length === 0)
                    }
                    loading={loading}
                    className="h-9 rounded-full bg-zinc-900 px-6 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50 active:scale-95 dark:bg-white dark:text-zinc-950"
                >
                    Post
                </Button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
                accept="image/*,video/*,application/pdf"
            />
        </div>
    )

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => !loading && onClose()}
            title="Create Post"
            className="gap-0 overflow-hidden p-0 sm:max-w-[620px] max-h-[89dvh]"
            footer={footerActions}
        >
            <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
                {/* User & Audience Selector */}
                <div className="flex items-start gap-3 px-1">
                    <Avatar className="size-10 shrink-0 border border-zinc-100 shadow-sm dark:border-zinc-800">
                        <AvatarImage src={currentUser?.avatar} className="object-cover" />
                        <AvatarFallback>
                            {currentUser?.handle?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {currentUser?.name}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                        className="group flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                    >
                                        {selectedCommunity ? (
                                            <>
                                                <Avatar className="size-4 shrink-0 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800">
                                                    <AvatarImage src={selectedCommunity.avatar} className="object-cover" />
                                                    <AvatarFallback className="text-[6px]">
                                                        {selectedCommunity.name?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="max-w-[100px] truncate">
                                                    {selectedCommunity.name}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Globe
                                                    size={12}
                                                    className="text-zinc-400 transition-colors group-hover:text-violet-500"
                                                />
                                                <span>Everyone</span>
                                            </>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    onCloseAutoFocus={(e) => e.preventDefault()}
                                    className="w-60 rounded-xl border-zinc-100 p-1.5 shadow-xl dark:border-zinc-800"
                                >
                                    <DropdownMenuItem
                                        onClick={() => setSelectedCommunity(null)}
                                        className="cursor-pointer gap-3 rounded-lg px-3 py-2 focus:bg-zinc-50 dark:focus:bg-zinc-800"
                                    >
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                            <Globe size={16} className="text-zinc-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">Everyone</span>
                                            <span className="text-[11px] text-zinc-500">
                                                Public feed
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                    {userCommunities.length > 0 && (
                                        <div className="mx-2 my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                                    )}
                                    <div className="max-h-[200px] overflow-y-auto">
                                        {userCommunities
                                            .filter(
                                                (c: any) => !c.isPrivate || c.myRole === "admin"
                                            )
                                            .map((c: any) => (
                                                <DropdownMenuItem
                                                    key={c.id}
                                                    onClick={() => setSelectedCommunity(c)}
                                                    className="cursor-pointer gap-3 rounded-lg px-3 py-2 focus:bg-zinc-50 dark:focus:bg-zinc-800"
                                                >
                                                    <Avatar className="size-8 border border-zinc-100 dark:border-zinc-700">
                                                        <AvatarImage src={c.avatar} />
                                                        <AvatarFallback>{c.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex flex-col">
                                                        <span className="truncate text-sm font-bold">
                                                            {c.name}
                                                        </span>
                                                        <span className="text-[11px] text-zinc-500">
                                                            Community
                                                        </span>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <textarea
                            className="min-h-[120px] max-h-[650px] w-full resize-none border-none bg-transparent text-lg font-medium leading-relaxed outline-none placeholder:text-zinc-400 dark:text-zinc-100 px-1"
                            placeholder="What's on your mind?"
                            autoFocus
                            value={postContent}
                            onPaste={handlePaste}
                            onChange={(e) => {
                                setPostContent(e.target.value)
                                e.target.style.height = "auto"
                                e.target.style.height = e.target.scrollHeight + "px"
                            }}
                        />
                    </div>
                </div>

                {/* Attachments Area */}
                <div className="px-1 mt-2">
                    <MediaUploader
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        customThumbnails={customThumbnails}
                        setCustomThumbnails={setCustomThumbnails}
                    />

                    {showPoll && (
                        <div className="mb-4 space-y-3 animate-in slide-in-from-top-2 duration-200 rounded-xl border border-violet-100 bg-violet-50/30 p-4 dark:border-violet-900/30 dark:bg-violet-900/10">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                                    Poll Options
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowPoll(false)}
                                    className="text-zinc-400 transition-colors hover:text-rose-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {pollData.options.map((option, idx) => (
                                    <div key={idx} className="group flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                className="w-full rounded-lg border border-zinc-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium outline-none transition-all placeholder:font-normal focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-900"
                                                placeholder={`Option ${idx + 1}`}
                                                value={option}
                                                autoFocus={idx === pollData.options.length - 1}
                                                onChange={(e) =>
                                                    handlePollOptionChange(idx, e.target.value)
                                                }
                                            />
                                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300">
                                                {option.length}/25
                                            </span>
                                        </div>
                                        {pollData.options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePollOption(idx)}
                                                className="rounded-lg p-2.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {pollData.options.length < 4 && (
                                <button
                                    type="button"
                                    onClick={handleAddPollOption}
                                    className="w-full rounded-lg border border-dashed border-violet-200 py-2.5 text-sm font-bold text-violet-600 transition-all hover:bg-violet-100 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/30"
                                >
                                    + Add option
                                </button>
                            )}
                            <div className="flex items-center gap-2 px-1 pt-1">
                                <span className="text-[10px] font-medium text-zinc-500">
                                    Poll ends in
                                </span>
                                <select
                                    className="cursor-pointer bg-transparent text-[10px] font-bold text-zinc-700 outline-none hover:text-violet-600 dark:text-zinc-300"
                                    value={pollData.duration}
                                    onChange={(e) =>
                                        setPollData({ ...pollData, duration: e.target.value })
                                    }
                                >
                                    <option value="1 day">1 day</option>
                                    <option value="3 days">3 days</option>
                                    <option value="7 days">7 days</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default CreatePostModal
