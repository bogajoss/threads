import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  Hash,
  AlignLeft,
  MapPin,
  MoreHorizontal,
  X,
  ImagePlus,
  Users,
  Globe,
  Lock,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
import { uploadFile, fetchUserCommunities, addStory } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ImageCropper from "@/components/ui/image-cropper";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useAutoResizeTextArea } from "@/hooks/useAutoResizeTextArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CircularProgress from "@/components/ui/CircularProgress";
import ProButton from "@/components/ui/ProButton";
import { Actionsheet, ActionsheetItem } from "@/components/ui/actionsheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Trash2, FileText, EyeOff } from "lucide-react";

interface SelectedFile {
  id: string;
  file: File;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const MAX_CHARS = currentUser?.isPro ? 2500 : 500;
  
  const { addPost } = usePosts();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const initialCommunity = location.state?.initialCommunity;
  const isStory = location.state?.isStory || false;

  const [postContent, setPostContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<
    Record<string, string>
  >({});
  const [customThumbnails, setCustomThumbnails] = useState<
    Record<string, File>
  >({});
  // const [showPoll, setShowPoll] = useState(false); // Disabled - Coming Soon
  // const [pollData, setPollData] = useState({
  //   options: ["", ""],
  //   duration: "1 day",
  // });
  const [loading, setLoading] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(
    initialCommunity || null,
  );
  const [replySetting, setReplySetting] = useState("anyone");
  const [showHashtagDialog, setShowHashtagDialog] = useState(false);
  const [hashtagInput, setHashtagInput] = useState("");

  const [tempCropImage, setTempCropImage] = useState<string | null>(null);
  const [croppingFileId, setCroppingFileId] = useState<string | null>(null);
  const [activeCoverFileId, setActiveCoverFileId] = useState<string | null>(
    null,
  );
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  const textareaRef = useAutoResizeTextArea(postContent, 44, 400);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userCommunities = [] } = useQuery({
    queryKey: ["user-communities", currentUser?.id],
    queryFn: () => fetchUserCommunities(currentUser!.id),
    enabled: !!currentUser?.id,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        // Seek to 1 second or middle
        const seekTime = Math.min(1, video.duration / 2);
        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        // Small delay to ensure the frame is actually rendered
        setTimeout(() => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumb = canvas.toDataURL("image/jpeg", 0.7);
            resolve(thumb);
          } catch (e) {
            console.error("Error capturing thumbnail:", e);
            resolve("");
          } finally {
            video.remove();
          }
        }, 150);
      };

      video.onerror = () => {
        resolve("");
      };
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: SelectedFile[] = Array.from(e.target.files).map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    for (const fileObj of newFiles) {
      if (fileObj.file.type.startsWith("video/")) {
        try {
          const thumb = await generateVideoThumbnail(fileObj.file);
          if (thumb) {
            setGeneratedThumbnails((prev) => ({
              ...prev,
              [fileObj.id]: thumb,
            }));
          }
        } catch (err) {
          console.error("Thumbnail generation failed", err);
        }
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const files = e.clipboardData.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
      );
      if (imageFiles.length > 0) {
        e.preventDefault();
        const newFiles: SelectedFile[] = imageFiles.map((file) => ({
          id: Math.random().toString(36).substring(2, 11),
          file,
        }));

        setSelectedFiles((prev) => [...prev, ...newFiles]);

        for (const fileObj of newFiles) {
          if (fileObj.file.type.startsWith("video/")) {
            try {
              const thumb = await generateVideoThumbnail(fileObj.file);
              if (thumb) {
                setGeneratedThumbnails((prev) => ({
                  ...prev,
                  [fileObj.id]: thumb,
                }));
              }
            } catch (err) {
              console.error("Thumbnail generation failed", err);
            }
          }
        }
        addToast(`Added ${newFiles.length} image(s) from clipboard!`, "success");
      }
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !activeCoverFileId) return;
    const file = e.target.files[0];
    setCustomThumbnails((prev) => ({ ...prev, [activeCoverFileId]: file }));
    setActiveCoverFileId(null);
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
    setCustomThumbnails((prev) => {
      const newThumbnails = { ...prev };
      delete newThumbnails[id];
      return newThumbnails;
    });
  };

  // const handleAddPollOption = () => {
  //   if (pollData.options.length < 4) {
  //     setPollData((prev) => ({ ...prev, options: [...prev.options, ""] }));
  //   }
  // };

  // const handleRemovePollOption = (index: number) => {
  //   setPollData((prev) => ({
  //     ...prev,
  //     options: prev.options.filter((_, i) => i !== index),
  //   }));
  // };

  // const handlePollOptionChange = (index: number, value: string) => {
  //   const newOptions = [...pollData.options];
  //   newOptions[index] = value;
  //   setPollData((prev) => ({ ...prev, options: newOptions }));
  // };

  const handleAddHashtag = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.trim().replace(/^#/, "");
      setHashtags((prev) => {
        if (prev) {
          return prev.includes(tag) ? prev : `${prev}, ${tag}`;
        }
        return tag;
      });
      setHashtagInput("");
      setShowHashtagDialog(false);
      addToast(`Hashtag #${tag} added!`);
    }
  };

  const onCropComplete = (blob: Blob) => {
    const croppedFile = new File([blob], `cropped-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    if (croppingFileId) {
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === croppingFileId ? { ...f, file: croppedFile } : f,
        ),
      );
    }

    setTempCropImage(null);
    setCroppingFileId(null);
  };

  const handlePublish = async () => {
    if (!currentUser) return;
    if (!postContent.trim() && selectedFiles.length === 0) return;
    if (postContent.length > MAX_CHARS) return;

    setLoading(true);
    try {
      const uploadedMedia = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];
        const customThumb = customThumbnails[item.id] || null;
        const res = await uploadFile(item.file, "media", customThumb as any);
        uploadedMedia.push(res);
      }

      // let poll = null;
      // if (showPoll && pollData.options.some((o) => o.trim())) {
      //   poll = {
      //     options: pollData.options
      //       .filter((o) => o.trim())
      //       .map((text, idx) => ({
      //         id: idx + 1,
      //         text,
      //         votes: 0,
      //       })),
      //     ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      //   };
      // }

      let finalContent = postContent;
      if (hashtags.trim()) {
        const tagList = hashtags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
          .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
          .join(" ");
        finalContent += `\n\n${tagList}`;
      }

      let finalType = "text";
      if (uploadedMedia.length > 0) {
        finalType = uploadedMedia[0].type === "video" ? "video" : "image";
      }
      // else if (poll) {
      //   finalType = "poll";
      // }

      if (isStory) {
        if (uploadedMedia.length === 0) {
          addToast("Please add media for your story.", "error");
          setLoading(false);
          return;
        }

        await addStory(
          currentUser.id,
          uploadedMedia[0].url,
          uploadedMedia[0].type,
          postContent
        );
        queryClient.invalidateQueries({ queryKey: ["stories"] });
        addToast("Story shared!");
      } else {
        await addPost({
          content: finalContent,
          media: uploadedMedia,
          // poll,
          type: finalType as any,
          userId: currentUser.id,
          communityId: selectedCommunity?.id || null,
        });
        addToast("Post published!");
      }
      navigate("/feed");
    } catch (err) {
      console.error("Failed to create post:", err);
      addToast("Failed to publish content.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  const isPostDisabled =
    (!postContent.trim() && selectedFiles.length === 0) ||
    loading ||
    postContent.length > MAX_CHARS;
  const charsLeft = MAX_CHARS - postContent.length;
  const showWarning = postContent.length > MAX_CHARS - 20;

  return (
    <div className="flex flex-col min-h-screen bg-[--background] text-[--foreground] md:rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[--background]/90 backdrop-blur-xl z-20 border-b border-[--border] rounded-t-xl">
        <button
          onClick={() => navigate(-1)}
          className="text-[15px] font-medium text-neutral-500 hover:text-[--foreground] transition-colors"
        >
          Cancel
        </button>
        <h1 className="text-[17px] font-bold tracking-tight">
          {isStory ? "Add to Story" : "Create post"}
        </h1>
        <button
          onClick={() => setShowMoreSheet(true)}
          className="text-[--foreground] p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all"
        >
          <MoreHorizontal size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex px-6 pt-6 pb-20">
          {/* Left Column (Avatar) */}
          <div className="flex flex-col items-center mr-4 pt-1">
            <Avatar className="w-10 h-10 border-[3px] border-[--background] ring-1 ring-[--border]">
              <AvatarImage
                src={currentUser.avatar}
                className="object-cover"
              />
              <AvatarFallback>
                {currentUser.name?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Right Column (Content) */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[15px] tracking-tight hover:underline cursor-pointer">
                {currentUser.name}
              </span>

              {!isStory && userCommunities.length > 0 && (
                <Select
                  onValueChange={(val) => {
                    const comm = userCommunities.find(
                      (c: any) => c.id === val,
                    );
                    setSelectedCommunity(comm || null);
                  }}
                  value={selectedCommunity?.id || "none"}
                >
                  <SelectTrigger className="h-7 px-3 py-0 border-none bg-neutral-100 dark:bg-neutral-900 text-[12px] font-bold rounded-full w-auto gap-1.5 focus:ring-0 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                    <Users size={12} className="text-neutral-500" />
                    <SelectValue placeholder="Anyone" />
                  </SelectTrigger>
                  <SelectContent
                    align="end"
                    className="bg-[--background] border-[--border] shadow-xl rounded-xl"
                  >
                    <SelectItem
                      value="none"
                      className="text-xs font-medium py-2.5"
                    >
                      Public (Anyone)
                    </SelectItem>
                    {userCommunities.map((comm: any) => (
                      <SelectItem
                        key={comm.id}
                        value={comm.id}
                        className="text-xs font-medium py-2.5"
                      >
                        {comm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                placeholder={isStory ? "Add a caption... (optional)" : "What's new?"}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onPaste={handlePaste}
                className={cn(
                  "w-full bg-transparent text-[--foreground] placeholder-neutral-500 outline-none resize-none text-[16px] leading-relaxed min-h-[44px] mb-1 transition-colors",
                  charsLeft < 0 && "text-rose-500",
                )}
              />

              {postContent.length > 0 && (
                <div className="absolute right-0 bottom-2 flex items-center gap-3">
                  <CircularProgress
                    current={postContent.length}
                    max={MAX_CHARS}
                    size={22}
                    strokeWidth={2.5}
                    isWarning={showWarning}
                  />
                  {showWarning && (
                    <span
                      className={cn(
                        "text-[11px] font-bold",
                        charsLeft < 0 ? "text-rose-500" : "text-neutral-500",
                      )}
                    >
                      {charsLeft}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Media Previews */}
            {selectedFiles.length > 0 && (
              <div className="flex overflow-x-auto gap-3.5 mb-5 mt-2 pb-1 scrollbar-hide snap-x">
                {selectedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative shrink-0 w-[260px] h-[340px] rounded-2xl overflow-hidden border border-[--border] bg-neutral-100 dark:bg-neutral-900 snap-start shadow-md group"
                  >
                    {file.file.type.startsWith("video/") ? (
                      <>
                        {customThumbnails[file.id] ||
                          generatedThumbnails[file.id] ? (
                          <img
                            src={
                              customThumbnails[file.id]
                                ? URL.createObjectURL(
                                  customThumbnails[file.id],
                                )
                                : generatedThumbnails[file.id]
                            }
                            className="w-full h-full object-cover"
                            alt="Video thumbnail"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file.file)}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 transition-all duration-300">
                          <div className="flex items-center justify-start">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCoverFileId(file.id);
                                coverInputRef.current?.click();
                              }}
                              className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xl px-3 py-2 rounded-full flex items-center gap-2 hover:bg-black/80 transition-colors shadow-lg border border-white/10"
                            >
                              <ImagePlus size={14} />
                              <span>Change Cover</span>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        src={URL.createObjectURL(file.file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="absolute top-3.5 right-3.5 bg-black/50 backdrop-blur-lg text-white rounded-full p-2 hover:bg-rose-500 transition-all z-10 shadow-xl group-hover:scale-110 active:scale-90"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverSelect}
                />
              </div>
            )}

            {/* Poll Interface - Disabled */}
            {/* {showPoll && (
              <div className="space-y-2.5 mb-5 mt-2 bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-3xl border border-[--border]">
                {pollData.options.map((option, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="w-full rounded-2xl border border-[--border] bg-[--background] px-4 py-3 text-[14px] font-medium outline-none focus:ring-2 focus:ring-[--primary]/20 transition-all placeholder:text-neutral-400"
                      placeholder={`Option ${idx + 1}`}
                      value={option}
                      onChange={(e) =>
                        handlePollOptionChange(idx, e.target.value)
                      }
                    />
                    {pollData.options.length > 2 && (
                      <button
                        onClick={() => handleRemovePollOption(idx)}
                        className="text-neutral-400 hover:text-rose-500 transition-all px-1.5"
                      >
                        <X size={22} />
                      </button>
                    )}
                  </div>
                ))}
                {pollData.options.length < 4 && (
                  <button
                    onClick={handleAddPollOption}
                    className="text-[13px] font-black text-neutral-400 hover:text-[--primary] transition-colors ml-1.5 mt-1"
                  >
                    + Add option
                  </button>
                )}
              </div>
            )} */}

            {/* Action Icons */}
            <div className="flex items-center gap-7 mt-3 text-neutral-400">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="hover:text-[--foreground] transition-all p-1 hover:scale-110 active:scale-90"
                title="Add Image/Video"
              >
                <ImageIcon size={22} strokeWidth={2.2} />
              </button>
              {!isStory && (
                <button
                  disabled
                  className="hover:text-[--foreground] transition-all p-1 opacity-30 cursor-not-allowed"
                  title="Poll (Coming Soon)"
                >
                  <AlignLeft size={22} strokeWidth={2.2} />
                </button>
              )}
              {!isStory && (
                <Dialog
                  open={showHashtagDialog}
                  onOpenChange={(open) => {
                    setShowHashtagDialog(open);
                    if (!open) setHashtagInput("");
                  }}
                >
                  <DialogTrigger asChild>
                    <button
                      className="hover:text-[--foreground] transition-all p-1 hover:scale-110 active:scale-90"
                      title="Add Hashtag"
                    >
                      <Hash size={22} strokeWidth={2.2} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Add Hashtag</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) =>
                          setHashtagInput(e.target.value.replace(/^#/, ""))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddHashtag();
                          }
                        }}
                        placeholder="e.g. technology, news, sports"
                        className="w-full rounded-xl border border-[--border] bg-[--background] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[--primary]"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setShowHashtagDialog(false);
                            setHashtagInput("");
                          }}
                          variant="secondary"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddHashtag}
                          className="flex-1"
                        >
                          Add Hashtag
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <button
                className="hover:text-[--foreground] transition-all p-1 opacity-30 cursor-not-allowed"
                title="Location"
              >
                <MapPin size={22} strokeWidth={2.2} />
              </button>
            </div>

            {hashtags && (
              <div className="mt-4 flex flex-wrap gap-2.5">
                {hashtags.split(",").map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[13px] font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20"
                  >
                    #{t.trim().replace(/^#/, "")}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-5 bg-[--background] border-t border-[--border] sticky bottom-0 z-20">
        <Select value={replySetting} onValueChange={setReplySetting}>
          <SelectTrigger className="border-none bg-transparent p-0 h-auto w-auto text-neutral-500 text-[14px] font-semibold hover:text-[--foreground] transition-colors gap-1.5 focus:ring-0">
            {replySetting === "anyone" && <Globe size={14} />}
            {replySetting === "following" && <UserCheck size={14} />}
            {replySetting === "mentioned" && <Lock size={14} />}
            <span className="capitalize">
              {replySetting.replace("-", " ")} can reply
            </span>
          </SelectTrigger>
          <SelectContent
            align="start"
            className="bg-[--background] border-[--border] shadow-2xl rounded-2xl p-1.5"
          >
            <SelectItem
              value="anyone"
              className="rounded-xl py-3 px-4 font-bold"
            >
              Anyone
            </SelectItem>
            <SelectItem
              value="following"
              className="rounded-xl py-3 px-4 font-bold"
            >
              Profiles you follow
            </SelectItem>
            <SelectItem
              value="mentioned"
              className="rounded-xl py-3 px-4 font-bold"
            >
              Mentioned only
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3">
          {!currentUser?.isPro && postContent.length > 500 ? (
            <ProButton
              label="Post"
              hoverLabel="Go Pro!"
              onClick={() => {
                navigate("/pro");
                addToast("Pro users get 2500 character limit!", "info");
              }}
              className="min-w-[120px] h-11"
            />
          ) : (
            <Button
              onClick={handlePublish}
              disabled={isPostDisabled}
              loading={loading}
              className={cn(
                "min-w-[90px] h-11 shadow-xl transition-all active:scale-95 text-[15px]",
                isPostDisabled
                  ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600 shadow-none"
                  : "shadow-[--primary]/20 bg-black text-white dark:bg-white dark:text-black",
              )}
            >
              {isStory ? "Share Story" : "Post"}
            </Button>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
        accept="image/*,video/*"
      />

      {tempCropImage && (
        <ImageCropper
          src={tempCropImage}
          isOpen={!!tempCropImage}
          onClose={() => {
            setTempCropImage(null);
            setCroppingFileId(null);
          }}
          onCropComplete={onCropComplete}
        />
      )}

      <Actionsheet
        isOpen={showMoreSheet}
        onClose={() => setShowMoreSheet(false)}
        title="Post Options"
      >
        <ActionsheetItem
          icon={<FileText size={20} />}
          onClick={() => {
            addToast("Draft saved (Simulated)");
            setShowMoreSheet(false);
          }}
        >
          Save as draft
        </ActionsheetItem>
        <ActionsheetItem
          icon={<Settings size={20} />}
          onClick={() => {
            addToast("Settings coming soon");
            setShowMoreSheet(false);
          }}
        >
          Post settings
        </ActionsheetItem>
        <ActionsheetItem
          icon={<EyeOff size={20} />}
          onClick={() => {
            addToast("Visibility settings coming soon");
            setShowMoreSheet(false);
          }}
        >
          Who can see this
        </ActionsheetItem>
        <div className="h-px bg-[--border] my-1 mx-6" />
        <ActionsheetItem
          variant="destructive"
          icon={<Trash2 size={20} />}
          onClick={() => {
            if (confirm("Discard this post?")) {
              navigate(-1);
            }
            setShowMoreSheet(false);
          }}
        >
          Discard post
        </ActionsheetItem>
      </Actionsheet>
    </div>
  );
};

export default CreatePost;
