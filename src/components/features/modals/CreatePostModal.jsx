import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  MapPin,
  Loader2,
  Image as ImageIcon,
  FileText,
  BarChart2,
  X,
  Trash2,
  Globe,
  Users
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
import { uploadFile, fetchUserCommunities } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CreatePostModal = ({ isOpen, onClose, initialCommunity }) => {
  const { currentUser } = useAuth();
  const { addPost } = usePosts();
  const { addToast } = useToast();

  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [customThumbnails, setCustomThumbnails] = useState({}); // { fileIndex: thumbnailFile }
  const [showPoll, setShowPoll] = useState(false);
  const [pollData, setPollData] = useState({
    options: ["", ""],
    duration: "1 day",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null); // { id, name, handle }

  // Set initial community if provided
  useEffect(() => {
    if (initialCommunity) {
      setSelectedCommunity(initialCommunity);
    } else {
      setSelectedCommunity(null);
    }
  }, [initialCommunity, isOpen]);

  // Fetch user's communities
  const { data: userCommunities = [] } = useQuery({
    queryKey: ["user-communities", currentUser?.id],
    queryFn: () => fetchUserCommunities(currentUser?.id),
    enabled: !!currentUser?.id,
  });

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file && activeThumbnailIndex !== null) {
      setCustomThumbnails((prev) => ({
        ...prev,
        [activeThumbnailIndex]: file,
      }));
    }
    setActiveThumbnailIndex(null);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    const newThumbs = { ...customThumbnails };
    delete newThumbs[index];
    setCustomThumbnails(newThumbs);
  };

  const handleAddPollOption = () => {
    if (pollData.options.length < 4) {
      setPollData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const handleRemovePollOption = (index) => {
    setPollData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if ((!postContent.trim() && selectedFiles.length === 0) || !currentUser)
      return;

    setLoading(true);
    try {
      const uploadedMedia = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const customPoster = customThumbnails[i] || null;
        const res = await uploadFile(file, "media", customPoster);
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
      });

      setPostContent("");
      setSelectedFiles([]);
      setShowPoll(false);
      setPollData({ options: ["", ""], duration: "1 day" });
      setSelectedCommunity(null);
      onClose();
      addToast("Post published!");
    } catch (err) {
      console.error("Failed to create post:", err);
      addToast("Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex items-center justify-between w-full">
      <div className="flex text-violet-600 gap-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full transition-colors"
          title="Attach media"
        >
          <ImageIcon size={22} />
        </button>
        <button
          type="button"
          onClick={() => setShowPoll(true)}
          className="p-2.5 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full transition-colors"
          title="Add poll"
        >
          <BarChart2 size={22} />
        </button>
        <button
          type="button"
          className="p-2.5 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <MapPin size={22} />
        </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    accept="image/*,video/*,application/pdf"
                  />
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailSelect}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <Button
                  onClick={handleCreatePost}
        
        disabled={
          (!postContent.trim() && selectedFiles.length === 0) || loading
        }
        className="px-8 py-2.5 min-w-[100px] text-base"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "Post"}
      </Button>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => !loading && onClose()}
        title="Create Post"
        className="sm:max-w-xl"
        footer={footerActions}
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="size-12 border border-zinc-200 dark:border-zinc-800">
              <AvatarImage src={currentUser?.avatar} className="object-cover" />
              <AvatarFallback>
                {currentUser?.handle?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {/* Community Selector */}
              <div className="mb-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                      {selectedCommunity ? (
                        <>
                          <Users size={14} />
                          <span>{selectedCommunity.name}</span>
                        </>
                      ) : (
                        <>
                          <Globe size={14} />
                          <span>Everyone</span>
                        </>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl">
                    <DropdownMenuItem 
                      onClick={() => setSelectedCommunity(null)}
                      className="gap-2 py-2.5 cursor-pointer"
                    >
                      <Globe size={16} className="text-zinc-500" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Everyone</span>
                        <span className="text-[10px] text-zinc-500">Post to your public feed</span>
                      </div>
                    </DropdownMenuItem>
                    {userCommunities
                      .filter(c => !c.isPrivate || c.myRole === 'admin')
                      .map((c) => (
                        <DropdownMenuItem 
                          key={c.id} 
                          onClick={() => setSelectedCommunity(c)}
                          className="gap-2 py-2.5 cursor-pointer"
                        >
                          <Avatar className="size-6">
                            <AvatarImage src={c.avatar} />
                            <AvatarFallback>{c.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{c.name}</span>
                            <span className="text-[10px] text-zinc-500">Post to community</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <textarea
                className="w-full bg-transparent border-none outline-none text-lg min-h-[120px] resize-none dark:text-white"
                placeholder="What's happening?"
                autoFocus
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />

              {showPoll && (
                <div className="mt-4 p-4 rounded-2xl space-y-3 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold opacity-60">Poll</span>
                    <button
                      type="button"
                      onClick={() => setShowPoll(false)}
                      className="text-zinc-500 hover:text-rose-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {pollData.options.map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-violet-500"
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
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  {pollData.options.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="text-sm font-bold text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      + Add option
                    </button>
                  )}
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative group size-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          className="size-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="size-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-100 dark:bg-zinc-800">
                          {file.type.startsWith("video/") ? (
                            <>
                              {customThumbnails[idx] ? (
                                <img
                                  src={URL.createObjectURL(customThumbnails[idx])}
                                  className="size-full object-cover"
                                  alt="Custom thumbnail"
                                />
                              ) : (
                                <Plus size={24} className="animate-pulse" />
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveThumbnailIndex(idx);
                                  thumbnailInputRef.current?.click();
                                }}
                                className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] font-bold py-1 backdrop-blur-sm hover:bg-black transition-colors"
                              >
                                {customThumbnails[idx] ? "Change Thumbnail" : "Add Thumbnail"}
                              </button>
                            </>
                          ) : (
                            <FileText size={24} />
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

    </>
  );
};

export default CreatePostModal;
