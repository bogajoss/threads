import React, { useState, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import { Loader2, X } from "lucide-react"
// @ts-ignore
import { EditIcon } from "@/components/ui"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { uploadFile, addStory } from "@/lib/api"
import ImageCropper from "@/components/ui/image-cropper"

interface CreateStoryModalProps {
    isOpen: boolean
    onClose: () => void
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { currentUser } = useAuth()
    const { addToast } = useToast()
    const queryClient = useQueryClient()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [tempCropImage, setTempCropImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setSelectedFile(file)
    }

    const handleStartCrop = () => {
        if (!selectedFile) return
        const reader = new FileReader()
        reader.onload = () => {
            setTempCropImage(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
    }

    const onCropComplete = (blob: Blob) => {
        const croppedFile = new File([blob], `story-cropped-${Date.now()}.jpg`, {
            type: "image/jpeg",
        })
        setSelectedFile(croppedFile)
        setTempCropImage(null)
    }

    const handleCreateStory = async () => {
        if (!selectedFile || !currentUser) return

        setLoading(true)
        try {
            const uploadedMedia = await uploadFile(selectedFile)
            await addStory(currentUser.id, uploadedMedia.url, uploadedMedia.type)

            setSelectedFile(null)
            onClose()
            addToast("Story shared!")
            queryClient.invalidateQueries({ queryKey: ["stories"] })
        } catch (err) {
            console.error("Failed to create story:", err)
            addToast("Failed to share story.", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => !loading && onClose()}
            title="Add Story"
        >
            <div className="space-y-6">
                {!selectedFile ? (
                    <div className="py-10">
                        <div
                            className="group relative w-full"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="relative z-40 mx-auto flex h-32 w-32 cursor-pointer items-center justify-center rounded-xl border-4 border-white bg-zinc-900 transition-all duration-500 group-hover:-translate-y-8 group-hover:translate-x-8 group-hover:shadow-2xl dark:border-zinc-900 dark:bg-white">
                                <svg
                                    className="h-8 w-8 text-white/60 dark:text-zinc-950/60"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                                    <path d="M7 9l5 -5l5 5"></path>
                                    <path d="M12 4l0 12"></path>
                                </svg>
                            </div>
                            <div className="absolute inset-0 z-30 mx-auto flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-violet-500 bg-transparent opacity-0 transition-all duration-300 group-hover:opacity-80"></div>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="font-bold dark:text-white">Choose a photo</p>
                            <p className="text-sm text-zinc-500">Stories last for 24 hours</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                className="h-full w-full object-cover"
                                alt="Preview"
                            />
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-rose-500"
                                title="Remove"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Edit Tools List */}
                        <div className="flex items-center justify-center gap-4 rounded-2xl bg-zinc-50/50 py-2 dark:bg-zinc-900/50">
                            <button
                                onClick={handleStartCrop}
                                className="group flex flex-col items-center gap-1.5 rounded-xl p-3 text-zinc-600 transition-all hover:bg-white hover:text-violet-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
                            >
                                <div className="rounded-lg bg-white p-2 shadow-sm transition-all group-hover:shadow-md dark:bg-zinc-800">
                                    {/* @ts-ignore */}
                                    <EditIcon size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    Crop / Edit
                                </span>
                            </button>

                            {/* Placeholder for future tools */}
                            <button className="flex cursor-not-allowed flex-col items-center gap-1.5 rounded-xl p-3 opacity-40 text-zinc-600 dark:text-zinc-400">
                                <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-zinc-800">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                    >
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 21 3 22l1-4.5L17 3z"></path>
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    Text
                                </span>
                            </button>

                            <button className="flex cursor-not-allowed flex-col items-center gap-1.5 rounded-xl p-3 opacity-40 text-zinc-600 dark:text-zinc-400">
                                <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-zinc-800">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    Stickers
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                />

                <Button
                    className="w-full py-3 text-lg"
                    disabled={!selectedFile || loading}
                    onClick={handleCreateStory}
                >
                    {loading ? (
                        <Loader2 size={24} className="mx-auto animate-spin" />
                    ) : (
                        "Share story"
                    )}
                </Button>
            </div>

            {tempCropImage && (
                <ImageCropper
                    src={tempCropImage}
                    isOpen={!!tempCropImage}
                    onClose={() => setTempCropImage(null)}
                    onCropComplete={onCropComplete}
                    aspect={9 / 16}
                />
            )}
        </Modal>
    )
}

export default CreateStoryModal
