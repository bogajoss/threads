import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Globe, ChevronLeft, Film, Layout } from "lucide-react";
import { MediaIcon, ShareIcon, ProButton } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
import { uploadFile, fetchUserCommunities, addStory } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import MediaUploader from "@/components/features/modals/MediaUploader";
import { PageTransition } from "@/components/layout";
import ImageCropper from "@/components/ui/image-cropper";
import CircularProgress from "@/components/ui/CircularProgress";
import { cn } from "@/lib/utils";

interface SelectedFile {
  id: string;
  file: File;
}

type PostType = "post" | "reel" | "story";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { addPost } = usePosts();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const initialCommunity = location.state?.initialCommunity;
  const initialType: PostType = location.state?.isStory
    ? "story"
    : location.state?.isReel
      ? "reel"
      : "post";

  const [createType, setCreateType] = useState<PostType>(initialType);
  const [postContent, setPostContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [customThumbnails, setCustomThumbnails] = useState<
    Record<string, File>
  >({});
  const [showPoll, setShowPoll] = useState(false);
  const [pollData, setPollData] = useState({
    options: ["", ""],
    duration: "1 day",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(
    initialCommunity || null,
  );

  const [tempCropImage, setTempCropImage] = useState<string | null>(null);
  const [croppingFileId, setCroppingFileId] = useState<string | null>(null);

  const isStory = createType === "story";
  const isReel = createType === "reel";

  const { data: userCommunities = [] } = useQuery({
    queryKey: ["user-communities", currentUser?.id],
    queryFn: () => fetchUserCommunities(currentUser!.id),
    enabled: !!currentUser?.id && !isStory,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
    }));

    if (isStory || isReel) {
      setSelectedFiles([files[0]]);
    } else {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleAddPollOption = () => {
    if (pollData.options.length < 4) {
      setPollData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const handleRemovePollOption = (index: number) => {
    setPollData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleCrop = (id: string) => {
    const fileToCrop = selectedFiles.find((f) => f.id === id);
    if (!fileToCrop) return;

    setCroppingFileId(id);
    const reader = new FileReader();
    reader.onload = () => {
      setTempCropImage(reader.result as string);
    };
    reader.readAsDataURL(fileToCrop.file);
  };

  const handleStartCrop = () => {
    if (selectedFiles.length === 0) return;
    handleCrop(selectedFiles[0].id);
  };

  const onCropComplete = (blob: Blob) => {
    const croppedFile = new File([blob], `cropped-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    if (isStory || isReel) {
      setSelectedFiles([
        { id: Math.random().toString(36).substring(2, 11), file: croppedFile },
      ]);
    } else if (croppingFileId) {
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === croppingFileId ? { ...f, file: croppedFile } : f,
        ),
      );
    }

    setTempCropImage(null);
    setCroppingFileId(null);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (isStory) {
      if (selectedFiles.length === 0) return;
      setLoading(true);
      try {
        const uploadedMedia = await uploadFile(selectedFiles[0].file);
        await addStory(currentUser.id, uploadedMedia.url, uploadedMedia.type);
        addToast("Story shared!");
        queryClient.invalidateQueries({ queryKey: ["stories"] });
        navigate("/feed");
      } catch (err) {
        console.error("Failed to create story:", err);
        addToast("Failed to share story.", "error");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!postContent.trim() && selectedFiles.length === 0) return;

    if (isOverCharLimit && !isStory && !isReel) {
      navigate("/pro");
      return;
    }

    setLoading(true);
    try {
      const uploadedMedia = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];
        const customPoster = customThumbnails[item.id] || null;
        const res = await uploadFile(item.file, "media", customPoster);
        uploadedMedia.push(res);
      }

      let poll = null;
      if (!isReel && showPoll && pollData.options.some((o) => o.trim())) {
        poll = {
          options: pollData.options
            .filter((o) => o.trim())
            .map((text, idx) => ({
              id: idx + 1,
              text,
              votes: 0,
            })),
          ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
      }

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

      await addPost({
        content: finalContent,
        media: uploadedMedia,
        poll,
        type: isReel
          ? "reel"
          : uploadedMedia.length > 0
            ? uploadedMedia[0].type === "video"
              ? "video"
              : "image"
            : poll
              ? "poll"
              : "text",
        userId: currentUser.id,
        communityId: selectedCommunity?.id || null,
      });

      addToast(isReel ? "Reel published!" : "Post published!");
      navigate("/feed");
    } catch (err) {
      console.error("Failed to create post:", err);
      addToast("Failed to publish content.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((isStory || isReel) && selectedFiles.length > 1) {
      setSelectedFiles([selectedFiles[0]]);
    }
  }, [createType, isStory, isReel, selectedFiles]);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const pageTitle = isStory
    ? "Add Story"
    : isReel
      ? "Create Reel"
      : "Create Post";

  const charCount = postContent.length;
  const isOverCharLimit = charCount > 160;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-[--background] dark:bg-black md:rounded-3xl md:border md:border-[--border] md:shadow-sm">
        <div className="sticky top-0 z-10 flex flex-col border-b border-[--border] bg-[--background]/80 backdrop-blur-md dark:bg-black/80">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full p-2 text-[--foreground] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl font-black tracking-tight text-[--foreground] font-english">
                {pageTitle}
              </h1>
            </div>

            {!isStory && (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="group flex items-center gap-1.5 rounded-full border border-[--border] bg-[--card] px-3 py-1.5 text-xs font-bold text-[--foreground] transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      {selectedCommunity ? (
                        <>
                          <Avatar className="size-4 shrink-0 overflow-hidden rounded-full border border-[--border]">
                            <AvatarImage
                              src={selectedCommunity.avatar}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-[6px]">
                              {selectedCommunity.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="max-w-[80px] truncate">
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
                    align="end"
                    className="w-64 rounded-xl border-[--border] bg-[--card] p-1.5 shadow-xl"
                  >
                    <DropdownMenuItem
                      onClick={() => setSelectedCommunity(null)}
                      className="cursor-pointer gap-3 rounded-lg px-3 py-2 focus:bg-zinc-50 dark:focus:bg-zinc-900"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                        <Globe size={18} className="text-zinc-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">Everyone</span>
                        <span className="text-xs text-zinc-500">
                          Public feed
                        </span>
                      </div>
                    </DropdownMenuItem>
                    {userCommunities.length > 0 && (
                      <div className="mx-2 my-1 h-px bg-[--border]" />
                    )}
                    <div className="max-h-[250px] overflow-y-auto">
                      {userCommunities
                        .filter(
                          (c: any) => !c.isPrivate || c.myRole === "admin",
                        )
                        .map((c: any) => (
                          <DropdownMenuItem
                            key={c.id}
                            onClick={() => setSelectedCommunity(c)}
                            className="cursor-pointer gap-3 rounded-lg px-3 py-2 focus:bg-zinc-50 dark:focus:bg-zinc-900"
                          >
                            <Avatar className="size-9 border border-[--border]">
                              <AvatarImage src={c.avatar} />
                              <AvatarFallback>{c.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex flex-col">
                              <span className="truncate text-sm font-bold">
                                {c.name}
                              </span>
                              <span className="text-xs text-zinc-500">
                                Community
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="flex px-4 pb-4">
            <div className="flex w-full overflow-hidden rounded-2xl bg-zinc-100/50 p-1.5 dark:bg-zinc-900/50 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50">
              {[
                { id: "post", label: "Post", icon: Layout },
                { id: "story", label: "Story", icon: MediaIcon },
                { id: "reel", label: "Reel", icon: Film },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setCreateType(type.id as PostType)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-black transition-all duration-300",
                    createType === type.id
                      ? "bg-white text-zinc-950 shadow-md shadow-zinc-200/50 dark:bg-zinc-800 dark:text-white dark:shadow-none translate-y-[-1px]"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200",
                  )}
                >
                  <type.icon
                    size={16}
                    strokeWidth={createType === type.id ? 3 : 2}
                  />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handlePublish}
          className="flex flex-1 flex-col gap-8 p-6 max-w-5xl w-full mx-auto font-bangla"
        >
          {!isStory && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black tracking-wide text-zinc-500 uppercase dark:text-zinc-400 font-english">
                  Caption
                </label>
                <div className="w-6 h-6">
                  <CircularProgress
                    current={charCount}
                    max={160}
                    size={24}
                    strokeWidth={3}
                    isWarning={isOverCharLimit}
                  />
                </div>
              </div>
              <Textarea
                className="min-h-[150px] w-full rounded-2xl border-[--border] bg-zinc-50/30 p-4 text-lg font-medium leading-relaxed outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5 dark:bg-zinc-900/20 text-[--foreground] placeholder:text-zinc-400"
                placeholder={
                  isReel
                    ? "Add a caption for your reel..."
                    : "What's on your mind?"
                }
                value={postContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPostContent(e.target.value)
                }
              />
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black tracking-wide text-zinc-500 uppercase dark:text-zinc-400 font-english">
                {isStory ? "Select Media" : isReel ? "Add Video" : "Add Media"}
              </label>
              {selectedFiles.length > 0 && !isStory && !isReel && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 transition-colors font-english"
                >
                  + ADD MORE
                </button>
              )}
            </div>

            {selectedFiles.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-[--border] bg-zinc-50/30 py-20 transition-all hover:border-violet-500 hover:bg-violet-50/10 dark:bg-zinc-900/20 cursor-pointer"
              >
                <div className="rounded-2xl bg-[--background] p-5 shadow-sm ring-1 ring-[--border] transition-transform group-hover:scale-110">
                  {isReel ? (
                    <Film className="text-violet-500" size={40} />
                  ) : (
                    <MediaIcon className="text-violet-500" size={40} />
                  )}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-lg font-bold text-[--foreground] font-english">
                    Choose a{" "}
                    {isStory
                      ? "photo or video"
                      : isReel
                        ? "video"
                        : "photo or video"}
                  </p>
                  <p className="text-sm text-zinc-500 font-english">
                    {isStory
                      ? "Stories last for 24 hours"
                      : isReel
                        ? "Reels should be in vertical format"
                        : "Photos and videos are supported"}
                  </p>
                </div>
              </div>
            ) : isStory || isReel ? (
              <div className="space-y-6">
                <div
                  className={cn(
                    "relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[2.5rem] shadow-2xl ring-8 ring-[--border] bg-black",
                    isStory ? "aspect-[9/16]" : "aspect-[9/16]",
                  )}
                >
                  {selectedFiles[0].file.type.startsWith("video/") ? (
                    <video
                      src={URL.createObjectURL(selectedFiles[0].file)}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(selectedFiles[0].file)}
                      className="h-full w-full object-cover"
                      alt="Preview"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    className="absolute right-4 top-4 rounded-full bg-black/50 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-rose-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex justify-center">
                  {selectedFiles[0].file.type.startsWith("image/") && (
                    <button
                      type="button"
                      onClick={handleStartCrop}
                      className="flex items-center gap-2 rounded-full bg-violet-100 px-6 py-2.5 text-sm font-black text-violet-600 transition-all hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400"
                    >
                      <MediaIcon size={18} />
                      <span>CROP & EDIT</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <MediaUploader
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                customThumbnails={customThumbnails}
                setCustomThumbnails={setCustomThumbnails}
                onCrop={handleCrop}
              />
            )}
          </div>

          {!isStory && (
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-black tracking-wide text-zinc-500 uppercase dark:text-zinc-400 font-english">
                Add Hashtags
              </label>
              <Input
                placeholder="Art, Expression, Learn"
                type="text"
                className="w-full rounded-2xl border-[--border] bg-zinc-50/30 px-5 py-4 text-base font-medium transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5 dark:bg-zinc-900/20 h-14"
                value={hashtags}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setHashtags(e.target.value)
                }
              />
            </div>
          )}

          {!isStory && !isReel && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black tracking-wide text-zinc-500 uppercase dark:text-zinc-400 font-english">
                  Poll (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPoll(!showPoll)}
                  className={`text-xs font-bold transition-colors font-english ${showPoll ? "text-rose-500" : "text-violet-600 dark:text-violet-400"}`}
                >
                  {showPoll ? "REMOVE POLL" : "ADD POLL"}
                </button>
              </div>

              {showPoll && (
                <div className="space-y-4 rounded-2xl border border-violet-100 bg-violet-50/10 p-6 dark:border-violet-900/20 dark:bg-violet-900/5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    {pollData.options.map((option, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          className="w-full rounded-xl border border-[--border] bg-[--background] px-4 py-3.5 text-sm font-medium outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5"
                          placeholder={`Option ${idx + 1}`}
                          value={option}
                          onChange={(e) =>
                            handlePollOptionChange(idx, e.target.value)
                          }
                        />
                        {pollData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePollOption(idx)}
                            className="rounded-xl p-3.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {pollData.options.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="w-full rounded-xl border border-dashed border-violet-200 py-3.5 text-sm font-bold text-violet-600 hover:bg-violet-100/50 dark:border-violet-800 transition-all font-english"
                    >
                      + ADD OPTION
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 items-center justify-end pb-16 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl px-8 py-3 font-bold text-zinc-500 hover:text-[--foreground] border-[--border] transition-all font-english"
              onClick={() => navigate(-1)}
            >
              CANCEL
            </Button>

            {isOverCharLimit && !isStory && !isReel ? (
              <ProButton
                type="submit"
                label="pro"
                hoverLabel="lagbe!"
                disabled={loading}
              />
            ) : (
              <Button
                type="submit"
                variant={loading ? "primary" : "animated"}
                icon={!loading && <ShareIcon size={24} />}
                disabled={
                  (!isStory &&
                    !postContent.trim() &&
                    selectedFiles.length === 0) ||
                  (isStory && selectedFiles.length === 0) ||
                  (isReel && selectedFiles.length === 0) ||
                  loading
                }
                className="font-english"
              >
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : isStory ? (
                  "Post"
                ) : isReel ? (
                  "Post"
                ) : (
                  "Post"
                )}
              </Button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple={!isStory && !isReel}
            className="hidden"
            accept={isReel ? "video/*" : "image/*,video/*"}
          />
        </form>
      </div>

      {tempCropImage && (
        <ImageCropper
          src={tempCropImage}
          isOpen={!!tempCropImage}
          onClose={() => {
            setTempCropImage(null);
            setCroppingFileId(null);
          }}
          onCropComplete={onCropComplete}
          aspect={isStory || isReel ? 9 / 16 : undefined}
        />
      )}
    </PageTransition>
  );
};

export default CreatePost;
