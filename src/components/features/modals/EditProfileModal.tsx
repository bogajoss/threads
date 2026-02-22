import React, { useState, useRef, useMemo, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CircularProgress from "@/components/ui/CircularProgress";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { uploadFile } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProfileData: any;
  setEditProfileData: (data: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  editProfileData,
  setEditProfileData,
}) => {
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Stable preview URLs — revoke when file changes or modal unmounts
  const coverPreviewUrl = useMemo(
    () => (newCoverFile ? URL.createObjectURL(newCoverFile) : null),
    [newCoverFile],
  );
  const avatarPreviewUrl = useMemo(
    () => (newAvatarFile ? URL.createObjectURL(newAvatarFile) : null),
    [newAvatarFile],
  );
  useEffect(() => () => { if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl); }, [coverPreviewUrl]);
  useEffect(() => () => { if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl); }, [avatarPreviewUrl]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Pro user GIF validation
      if (file.type === "image/gif" && !currentUser?.isPro) {
        addToast("GIF profile pictures are only available for PRO users!", "error");
        return;
      }

      if (type === "avatar") {
        setNewAvatarFile(file);
      } else {
        setNewCoverFile(file);
      }
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      let avatarUrl = editProfileData.avatar;
      let coverUrl = editProfileData.cover;

      if (newAvatarFile) {
        const res = await uploadFile(newAvatarFile);
        avatarUrl = res.url;
      }

      if (newCoverFile) {
        const res = await uploadFile(newCoverFile);
        coverUrl = res.url;
      }

      const sanitizeWebsite = (input?: string | null) => {
        if (!input) return input;
        const trimmed = input.trim();
        if (!trimmed) return trimmed;
        try {
          const url = new URL(
            /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
          );
          return url.hostname.replace(/^www\./i, "");
        } catch {
          // fallback: remove protocol, www and any path
          return trimmed
            .replace(/^https?:\/\//i, "")
            .replace(/^www\./i, "")
            .replace(/\/.*$/, "");
        }
      };

      const cleanedWebsite = sanitizeWebsite(editProfileData?.website);

      await updateProfile({
        ...editProfileData,
        avatar: avatarUrl,
        cover: coverUrl,
        website: cleanedWebsite,
      });

      setNewAvatarFile(null);
      setNewCoverFile(null);
      onClose();
      addToast("Profile updated!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      addToast("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getWordCount = (val?: string) =>
    (val || "").trim().split(/\s+/).filter(Boolean).length;

  const wordCount = getWordCount(editProfileData?.bio);
  const bioWarn = wordCount >= 50;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => !loading && onClose()}
        title="Edit Profile"
      >
        <div className="space-y-6 p-6">
          <input
            type="file"
            ref={coverInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFileChange(e, "cover")
            }
          />
          <input
            type="file"
            ref={avatarInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFileChange(e, "avatar")
            }
          />

          <div
            className="group relative h-32 cursor-pointer overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
            onClick={() => coverInputRef.current?.click()}
          >
            {(newCoverFile || editProfileData?.cover) && (
              <img
                src={coverPreviewUrl ?? editProfileData.cover}
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

          <div className="relative -mt-16 ml-4">
            <div
              className="group relative size-24 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-white shadow-lg dark:border-black dark:bg-black"
              onClick={() => avatarInputRef.current?.click()}
            >
              {(newAvatarFile || editProfileData?.avatar) && (
                <Avatar className="size-full rounded-none opacity-60">
                  <AvatarImage
                    src={avatarPreviewUrl ?? editProfileData.avatar}
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
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) =>
                setEditProfileData({ ...editProfileData, name: e.target.value })
              }
            />

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <Input
                  label="Bio"
                  textarea={true}
                  value={editProfileData?.bio || ""}
                  className="min-h-[96px] resize-none pr-2"
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => {
                    const raw = e.target.value;
                    const words = raw.trim().split(/\s+/).filter(Boolean);
                    if (words.length > 60) {
                      const trimmed = words.slice(0, 60).join(" ");
                      setEditProfileData({ ...editProfileData, bio: trimmed });
                    } else {
                      setEditProfileData({ ...editProfileData, bio: raw });
                    }
                  }}
                />
              </div>

              <div className="flex items-center pt-3">
                <CircularProgress
                  current={wordCount}
                  max={60}
                  size={24}
                  strokeWidth={3}
                  isWarning={bioWarn}
                />
              </div>
            </div>

            <Input
              label="Location"
              value={editProfileData?.location || ""}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) =>
                setEditProfileData({
                  ...editProfileData,
                  location: e.target.value,
                })
              }
            />
            <Input
              label="Website"
              value={editProfileData?.website || ""}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) =>
                setEditProfileData({
                  ...editProfileData,
                  website: e.target.value,
                })
              }
            />
          </div>
          <Button
            className="w-full py-3"
            loading={loading}
            onClick={handleUpdateProfile}
          >
            Save changes
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditProfileModal;
