import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Camera,
  User,
  FileText,
  MapPin,
  Globe,
  Save,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CircularProgress from "@/components/ui/CircularProgress";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { uploadFile } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PageTransition } from "@/components/layout";
import { useAutoResizeTextArea } from "@/hooks/useAutoResizeTextArea";

interface EditProfileDraft {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();
  const draftStorageKey = currentUser?.id
    ? `edit-profile-draft:${currentUser.id}`
    : null;

  const [loading, setLoading] = useState(false);
  const [editProfileData, setEditProfileData] = useState<any>(
    currentUser || {},
  );
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const hasRestoredDraftRef = useRef(false);
  const isDirtyRef = useRef(false);
  const bioTextareaRef = useAutoResizeTextArea(editProfileData?.bio || "", 80, 300);

  // Create stable preview URLs from file objects, revoke them when files change or on unmount
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

  const setEditProfileDataDirty = (nextData: any) => {
    isDirtyRef.current = true;
    setEditProfileData(nextData);
  };

  useEffect(() => {
    if (!currentUser || hasRestoredDraftRef.current) return;

    if (draftStorageKey) {
      const rawDraft = sessionStorage.getItem(draftStorageKey);
      if (rawDraft) {
        try {
          const parsedDraft = JSON.parse(rawDraft) as EditProfileDraft;
          setEditProfileData({ ...currentUser, ...parsedDraft });
          isDirtyRef.current = true;
        } catch (error) {
          console.error("Failed to restore edit profile draft", error);
          sessionStorage.removeItem(draftStorageKey);
          setEditProfileData(currentUser);
        }
      } else {
        setEditProfileData(currentUser);
      }
    } else {
      setEditProfileData(currentUser);
    }

    hasRestoredDraftRef.current = true;
  }, [currentUser, draftStorageKey]);

  useEffect(() => {
    if (!draftStorageKey || !hasRestoredDraftRef.current) return;

    const draft: EditProfileDraft = {
      name: editProfileData?.name || "",
      bio: editProfileData?.bio || "",
      location: editProfileData?.location || "",
      website: editProfileData?.website || "",
    };

    const isEmptyDraft =
      !draft.name?.trim() &&
      !draft.bio?.trim() &&
      !draft.location?.trim() &&
      !draft.website?.trim();

    if (isEmptyDraft) {
      sessionStorage.removeItem(draftStorageKey);
      return;
    }

    sessionStorage.setItem(draftStorageKey, JSON.stringify(draft));
  }, [
    draftStorageKey,
    editProfileData?.bio,
    editProfileData?.location,
    editProfileData?.name,
    editProfileData?.website,
  ]);

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
          // Keep the full path, just remove www. from hostname
          const hostname = url.hostname.replace(/^www\./i, "");
          const pathname = url.pathname === "/" ? "" : url.pathname;
          return hostname + pathname;
        } catch {
          // Fallback: only remove protocol and www, keep the rest
          return trimmed
            .replace(/^https?:\/\//i, "")
            .replace(/^www\./i, "");
        }
      };

      const cleanedWebsite = sanitizeWebsite(editProfileData?.website);

      await updateProfile({
        ...editProfileData,
        avatar: avatarUrl,
        cover: coverUrl,
        website: cleanedWebsite,
      });

      if (draftStorageKey) {
        sessionStorage.removeItem(draftStorageKey);
      }
      isDirtyRef.current = false;

      setNewAvatarFile(null);
      setNewCoverFile(null);
      addToast("Profile updated!");
      navigate(-1);
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

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black md:rounded-xl md:border">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold dark:text-white">Edit Profile</h2>
          </div>
        </div>

        <div className="mx-auto mt-4 w-full max-w-2xl space-y-8 p-4 pb-24">
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

          {/* Media Section */}
          <section className="space-y-4">
            <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              Media
            </h3>
            <div className="overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900">
              {/* Cover */}
              <div
                className="group relative h-40 cursor-pointer overflow-hidden bg-zinc-100 dark:bg-zinc-800"
                onClick={() => coverInputRef.current?.click()}
              >
                {(newCoverFile || editProfileData?.cover) && (
                  <img
                    src={coverPreviewUrl ?? editProfileData.cover}
                    className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
                    alt=""
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex flex-col items-center gap-1 text-white">
                    <Camera size={24} />
                    <span className="text-xs font-bold uppercase">
                      Change Cover
                    </span>
                  </div>
                </div>
              </div>

              {/* Avatar Row */}
              <div className="flex items-center gap-6 p-4">
                <div
                  className="group relative size-24 cursor-pointer overflow-hidden rounded-full ring-4 ring-white shadow-lg dark:ring-zinc-800"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Avatar className="size-full rounded-none">
                    <AvatarImage
                      src={avatarPreviewUrl ?? editProfileData.avatar}
                      className="object-cover transition-opacity group-hover:opacity-60"
                    />
                    <AvatarFallback>
                      {editProfileData?.handle?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold dark:text-zinc-200">
                    Profile Picture
                  </p>
                  <p className="text-xs text-zinc-500">
                    Recommended size: 400x400px
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              Basic Info
            </h3>
            <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-zinc-50 dark:divide-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <User size={16} />
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Display Name
                  </label>
                </div>
                <Input
                  value={editProfileData?.name || ""}
                  className="h-auto bg-transparent p-0 text-base font-medium placeholder:text-zinc-400 focus-visible:ring-0 dark:text-zinc-100 shadow-none"
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) =>
                    setEditProfileDataDirty({
                      ...editProfileData,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <FileText size={16} />
                    <label className="text-xs font-bold uppercase tracking-tight">
                      Bio
                    </label>
                  </div>
                  <CircularProgress
                    current={wordCount}
                    max={60}
                    size={20}
                    strokeWidth={3}
                    isWarning={bioWarn}
                  />
                </div>
                <textarea
                  ref={bioTextareaRef}
                  value={editProfileData?.bio || ""}
                  className="min-h-[80px] max-h-[400px] w-full bg-transparent p-0 text-base font-medium resize-none placeholder:text-zinc-400 focus-visible:ring-0 dark:text-zinc-100 shadow-none outline-none"
                  placeholder="Tell others about yourself..."
                  onChange={(
                    e: React.ChangeEvent<HTMLTextAreaElement>,
                  ) => {
                    const raw = e.target.value;
                    const words = raw.trim().split(/\s+/).filter(Boolean);
                    if (words.length > 60) {
                      const trimmed = words.slice(0, 60).join(" ");
                      setEditProfileDataDirty({ ...editProfileData, bio: trimmed });
                    } else {
                      setEditProfileDataDirty({ ...editProfileData, bio: raw });
                    }
                  }}
                />
              </div>
            </div>
          </section>

          {/* Extras */}
          <section className="space-y-4">
            <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              Public Details
            </h3>
            <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-zinc-50 dark:divide-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <MapPin size={16} />
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Location
                  </label>
                </div>
                <Input
                  placeholder="Where are you based?"
                  value={editProfileData?.location || ""}
                  className="h-auto bg-transparent p-0 text-base font-medium placeholder:text-zinc-400 focus-visible:ring-0 dark:text-zinc-100 shadow-none"
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) =>
                    setEditProfileDataDirty({
                      ...editProfileData,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Globe size={16} />
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Website
                  </label>
                </div>
                <Input
                  placeholder="yoursite.com"
                  value={editProfileData?.website || ""}
                  className="h-auto bg-transparent p-0 text-base font-medium placeholder:text-zinc-400 focus-visible:ring-0 dark:text-zinc-100 shadow-none"
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) =>
                    setEditProfileDataDirty({
                      ...editProfileData,
                      website: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </section>

          <div className="flex gap-4 pt-4">
            <Button
              variant="secondary"
              className="flex-1 rounded-2xl p-4 font-bold"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-2xl p-4 font-bold bg-violet-600 hover:bg-violet-700 text-white"
              onClick={handleUpdateProfile}
              loading={loading}
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          </div>

          <div className="py-10 text-center text-xs text-zinc-400">
            Your profile changes will be visible to everyone on MySys.
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EditProfile;
