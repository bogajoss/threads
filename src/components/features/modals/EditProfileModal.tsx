import React, { useState, useRef } from "react"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { uploadFile } from "@/lib/api"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    editProfileData: any
    setEditProfileData: (data: any) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    editProfileData,
    setEditProfileData,
}) => {
    const { updateProfile } = useAuth()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)

    // Final files to upload
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null)
    const [newCoverFile, setNewCoverFile] = useState<File | null>(null)

    const avatarInputRef = useRef<HTMLInputElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: string
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            if (type === "avatar") {
                setNewAvatarFile(file)
            } else {
                setNewCoverFile(file)
            }
        }
    }

    const handleUpdateProfile = async () => {
        setLoading(true)
        try {
            let avatarUrl = editProfileData.avatar
            let coverUrl = editProfileData.cover

            if (newAvatarFile) {
                const res = await uploadFile(newAvatarFile)
                avatarUrl = res.url
            }

            if (newCoverFile) {
                const res = await uploadFile(newCoverFile)
                coverUrl = res.url
            }

            await updateProfile({
                ...editProfileData,
                avatar: avatarUrl,
                cover: coverUrl,
            })

            setNewAvatarFile(null)
            setNewCoverFile(null)
            onClose()
            addToast("Profile updated!")
        } catch (err) {
            console.error("Failed to update profile:", err)
            addToast("Failed to update profile.", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => !loading && onClose()}
                title="Edit Profile"
            >
                <div className="space-y-6">
                    <input
                        type="file"
                        ref={coverInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "cover")}
                    />
                    <input
                        type="file"
                        ref={avatarInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "avatar")}
                    />

                    {/* Cover Preview */}
                    <div
                        className="group relative h-32 cursor-pointer overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
                        onClick={() => coverInputRef.current?.click()}
                    >
                        {(newCoverFile || editProfileData?.cover) && (
                            <img
                                src={
                                    newCoverFile
                                        ? URL.createObjectURL(newCoverFile)
                                        : editProfileData.cover
                                }
                                className="h-full w-full object-cover opacity-60"
                                alt=""
                            />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-black/50 p-2 text-white transition-transform group-hover:scale-110">
                                <Plus size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Avatar Preview */}
                    <div className="relative -mt-16 ml-4">
                        <div
                            className="group relative size-24 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-white shadow-lg dark:border-black dark:bg-black"
                            onClick={() => avatarInputRef.current?.click()}
                        >
                            {(newAvatarFile || editProfileData?.avatar) && (
                                <Avatar className="size-full rounded-none opacity-60">
                                    <AvatarImage
                                        src={
                                            newAvatarFile
                                                ? URL.createObjectURL(newAvatarFile)
                                                : editProfileData.avatar
                                        }
                                        className="object-cover"
                                    />
                                    <AvatarFallback>
                                        {editProfileData?.handle?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-full bg-black/50 p-2 text-white transition-transform group-hover:scale-110">
                                    <Plus size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Name"
                            value={editProfileData?.name || ""}
                            onChange={(e) =>
                                setEditProfileData({ ...editProfileData, name: e.target.value })
                            }
                        />
                        <Input
                            label="Bio"
                            textarea={true}
                            value={editProfileData?.bio || ""}
                            onChange={(e) =>
                                setEditProfileData({ ...editProfileData, bio: e.target.value })
                            }
                        />
                        <Input
                            label="Location"
                            value={editProfileData?.location || ""}
                            onChange={(e) =>
                                setEditProfileData({
                                    ...editProfileData,
                                    location: e.target.value,
                                })
                            }
                        />
                        <Input
                            label="Website"
                            value={editProfileData?.website || ""}
                            onChange={(e) =>
                                setEditProfileData({
                                    ...editProfileData,
                                    website: e.target.value,
                                })
                            }
                        />
                    </div>
                    <Button
                        className="w-full py-3"
                        disabled={loading}
                        onClick={handleUpdateProfile}
                    >
                        {loading ? (
                            <Loader2 size={24} className="mx-auto animate-spin text-white" />
                        ) : (
                            "Save changes"
                        )}
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default EditProfileModal
