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
  Loader2,
} from "lucide-react";
import Input from "@/components/ui/Input";
import CircularProgress from "@/components/ui/CircularProgress";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { uploadFile } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PageTransition } from "@/components/layout";
import { useAutoResizeTextArea } from "@/hooks/useAutoResizeTextArea";
import { cn } from "@/lib/utils";

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

      const updatePayload: any = {
        name: editProfileData.name,
        bio: editProfileData.bio,
        location: editProfileData.location,
        website: cleanedWebsite,
      };

      if (avatarUrl && avatarUrl !== "/default-avatar.webp") {
        updatePayload.avatar = avatarUrl;
      }

      if (coverUrl && coverUrl !== "/welcome-banner.webp") {
        updatePayload.cover = coverUrl;
      }

      await updateProfile(updatePayload);

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

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-muted/30 md:rounded-2xl md:border md:border-border">
        {/* iOS Translucent Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex size-9 items-center justify-center rounded-full transition-all active:scale-90 active:bg-accent"
            >
              <ChevronLeft size={24} strokeWidth={2.5} className="text-foreground" />
            </button>
            <h2 className="text-[20px] font-black tracking-tight text-foreground">Edit Profile</h2>
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className={cn(
              "text-[16px] font-bold text-primary transition-all active:scale-95 disabled:opacity-50",
              loading && "animate-pulse"
            )}
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </div>

        <div className="mx-auto w-full max-w-2xl space-y-8 p-4 pb-32">
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

          {/* Media Group */}
          <section className="space-y-2">
            <h3 className="px-4 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
              Profile Media
            </h3>
            <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
              {/* Cover Photo */}
              <div
                className="group relative h-44 cursor-pointer overflow-hidden bg-muted/50 transition-colors hover:bg-muted"
                onClick={() => coverInputRef.current?.click()}
              >
                {(newCoverFile || editProfileData?.cover) && (
                  <img
                    src={coverPreviewUrl ?? editProfileData.cover}
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                    alt=""
                  />
                )}
                
                {/* Minimal Camera Icon for Cover */}
                <div className="absolute bottom-3 right-3 z-10">
                  <div className="rounded-full bg-black/20 p-2 text-white/90 backdrop-blur-md transition-all active:scale-90 active:bg-black/40 shadow-sm border border-white/10">
                    <Camera size={18} strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Avatar Item */}
              <div className="flex items-center gap-4 border-t border-border p-4">
                <div
                  className="group relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-full ring-2 ring-background shadow-md"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Avatar className="size-full rounded-none">
                    <AvatarImage
                      src={avatarPreviewUrl ?? editProfileData.avatar}
                      className="object-cover transition-opacity group-hover:opacity-80"
                    />
                    <AvatarFallback className="bg-muted text-xl font-bold text-muted-foreground">
                      {editProfileData?.handle?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera size={18} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold text-foreground">Profile Picture</h4>
                  <p className="text-[12px] font-medium text-muted-foreground">
                    GIFs enabled for PRO users
                  </p>
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="mt-1 text-[13px] font-bold text-primary active:opacity-60"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Basic Info Group */}
          <section className="space-y-2">
            <h3 className="px-4 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
              Personal Information
            </h3>
            <div className="divide-y divide-border overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-1 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User size={14} strokeWidth={2.5} className="text-muted-foreground/70" />
                  <label className="text-[11px] font-bold uppercase tracking-widest">
                    Name
                  </label>
                </div>
                <Input
                  value={editProfileData?.name || ""}
                  className="h-auto border-none bg-transparent p-0 text-[16px] font-medium text-foreground shadow-none focus-visible:ring-0"
                  onChange={(e) =>
                    setEditProfileDataDirty({
                      ...editProfileData,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText size={14} strokeWidth={2.5} className="text-muted-foreground/70" />
                    <label className="text-[11px] font-bold uppercase tracking-widest">
                      Bio
                    </label>
                  </div>
                  <CircularProgress
                    current={wordCount}
                    max={60}
                    size={16}
                    strokeWidth={3}
                    isWarning={bioWarn}
                  />
                </div>
                <textarea
                  ref={bioTextareaRef}
                  value={editProfileData?.bio || ""}
                  className="min-h-[60px] max-h-[400px] w-full resize-none border-none bg-transparent p-0 text-[16px] font-medium text-foreground outline-none shadow-none focus-visible:ring-0"
                  placeholder="Bio..."
                  onChange={(e) => {
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

          {/* Social Details Group */}
          <section className="space-y-2">
            <h3 className="px-4 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
              Public Details
            </h3>
            <div className="divide-y divide-border overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-1 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={14} strokeWidth={2.5} className="text-muted-foreground/70" />
                  <label className="text-[11px] font-bold uppercase tracking-widest">
                    Location
                  </label>
                </div>
                <Input
                  placeholder="Based in..."
                  value={editProfileData?.location || ""}
                  className="h-auto border-none bg-transparent p-0 text-[16px] font-medium text-foreground shadow-none focus-visible:ring-0"
                  onChange={(e) =>
                    setEditProfileDataDirty({
                      ...editProfileData,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe size={14} strokeWidth={2.5} className="text-muted-foreground/70" />
                  <label className="text-[11px] font-bold uppercase tracking-widest">
                    Website
                  </label>
                </div>
                <Input
                  placeholder="yoursite.com"
                  value={editProfileData?.website || ""}
                  className="h-auto border-none bg-transparent p-0 text-[16px] font-medium text-foreground shadow-none focus-visible:ring-0"
                  onChange={(e) =>
                    setEditProfileDataDirty({
                      ...editProfileData,
                      website: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="flex h-14 w-full items-center justify-center font-bold text-muted-foreground transition-all active:scale-95 active:text-foreground"
            >
              Discard Changes
            </button>
          </div>

          <div className="pt-10 text-center">
            <p className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              MySys Profile Management
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EditProfile;
