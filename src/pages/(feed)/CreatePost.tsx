import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ImageIcon,
  Trash2,
  Globe,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
// @ts-ignore
import { uploadFile, fetchUserCommunities } from "@/lib/api";
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

interface SelectedFile {
  id: string;
  file: File;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { addPost } = usePosts();
  const { addToast } = useToast();

  const initialCommunity = location.state?.initialCommunity;

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

  // Fetch user's communities
  const { data: userCommunities = [] } = useQuery({
    queryKey: ["user-communities", currentUser?.id],
    queryFn: () => fetchUserCommunities(currentUser!.id),
    enabled: !!currentUser?.id,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
    }));
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = e.clipboardData.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (imageFiles.length > 0) {
        e.preventDefault();
        const newFiles: SelectedFile[] = imageFiles.map((file) => ({
          id: Math.random().toString(36).substring(2, 11),
          file,
        }));
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!postContent.trim() && selectedFiles.length === 0) || !currentUser)
      return;

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
        };
      }

      // Append hashtags to content if provided
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
      });

      setPostContent("");
      setHashtags("");
      setSelectedFiles([]);
      setShowPoll(false);
      setPollData({ options: ["", ""], duration: "1 day" });
      setSelectedCommunity(null);
      addToast("Post published!");
      navigate("/feed");
    } catch (err) {
      console.error("Failed to create post:", err);
      addToast("Failed to publish post.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-white dark:bg-black md:rounded-3xl md:border md:border-zinc-200/50 md:dark:border-zinc-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-black tracking-tight dark:text-white">
              Create Post
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {selectedCommunity ? (
                    <>
                      <Avatar className="size-4 shrink-0 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800">
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
                className="w-64 rounded-xl border-zinc-100 p-1.5 shadow-xl dark:border-zinc-800"
              >
                <DropdownMenuItem
                  onClick={() => setSelectedCommunity(null)}
                  className="cursor-pointer gap-3 rounded-lg px-3 py-2 focus:bg-zinc-50 dark:focus:bg-zinc-800"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <Globe size={18} className="text-zinc-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Everyone</span>
                    <span className="text-xs text-zinc-500">Public feed</span>
                  </div>
                </DropdownMenuItem>
                {userCommunities.length > 0 && (
                  <div className="mx-2 my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                )}
                <div className="max-h-[250px] overflow-y-auto">
                  {userCommunities
                    .filter((c: any) => !c.isPrivate || c.myRole === "admin")
                    .map((c: any) => (
                      <DropdownMenuItem
                        key={c.id}
                        onClick={() => setSelectedCommunity(c)}
                        className="cursor-pointer gap-3 rounded-lg px-3 py-2 focus:bg-zinc-50 dark:focus:bg-zinc-800"
                      >
                        <Avatar className="size-9 border border-zinc-100 dark:border-zinc-700">
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
        </div>

        <form onSubmit={handleCreatePost} className="flex flex-1 flex-col gap-8 p-6 max-w-5xl w-full mx-auto">
          {/* Caption Section */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Caption
            </label>
            <Textarea
              className="min-h-[150px] w-full rounded-2xl border-zinc-100 bg-zinc-50/50 p-4 text-base font-medium outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100"
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPostContent(e.target.value)}
              onPaste={handlePaste}
            />
          </div>

          {/* Media Section */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Add Photos
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-10 transition-all hover:border-violet-500 hover:bg-violet-50/30 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-violet-500 dark:hover:bg-violet-900/10 cursor-pointer"
            >
              <div className="rounded-full bg-white p-3 shadow-sm transition-transform group-hover:scale-110 dark:bg-zinc-800">
                <ImageIcon className="text-violet-500" size={28} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Click to upload or drag and drop</p>
                <p className="text-xs text-zinc-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>
            <MediaUploader
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              customThumbnails={customThumbnails}
              setCustomThumbnails={setCustomThumbnails}
            />
          </div>

          {/* Hashtags Section */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Add Hashtags (separated by comma " , ")
            </label>
            <Input
              placeholder="Art, Expression, Learn"
              type="text"
              className="w-full rounded-2xl border-zinc-100 bg-zinc-50/50 px-5 py-4 text-sm font-medium transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-800 dark:bg-zinc-900/50"
              value={hashtags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHashtags(e.target.value)}
            />
          </div>

          {/* Poll Section (Optional) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Poll (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowPoll(!showPoll)}
                className={`text-xs font-bold transition-colors ${showPoll ? "text-rose-500" : "text-violet-600 dark:text-violet-400"}`}
              >
                {showPoll ? "Remove Poll" : "Add Poll"}
              </button>
            </div>
            
            {showPoll && (
              <div className="space-y-4 rounded-2xl border border-violet-100 bg-violet-50/30 p-5 dark:border-violet-900/30 dark:bg-violet-900/10">
                <div className="space-y-3">
                  {pollData.options.map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-900"
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
                          className="rounded-xl p-3 text-zinc-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20"
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
                    className="w-full rounded-xl border border-dashed border-violet-200 py-3 text-sm font-bold text-violet-600 hover:bg-violet-100 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/30"
                  >
                    + Add option
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center justify-end pb-10">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-8 py-2.5 font-bold"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={(!postContent.trim() && selectedFiles.length === 0) || loading}
              className="rounded-xl bg-zinc-950 px-10 py-2.5 font-bold text-white transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-zinc-950"
            >
              {loading && <Loader2 size={18} className="mr-2 animate-spin" />}
              Create Post
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
        </form>
      </div>
    </PageTransition>
  );
};

export default CreatePost;