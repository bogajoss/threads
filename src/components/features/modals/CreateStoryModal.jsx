import React, { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Image as ImageIcon, Loader2, X, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { uploadFile, addStory } from "@/lib/api";
import ImageCropper from "@/components/ui/ImageCropper";

const CreateStoryModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempCropImage, setTempCropImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleStartCrop = () => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempCropImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const onCropComplete = (blob) => {
    const croppedFile = new File([blob], `story-cropped-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    setSelectedFile(croppedFile);
    setTempCropImage(null);
  };

  const handleCreateStory = async () => {
    if (!selectedFile || !currentUser) return;

    setLoading(true);
    try {
      const uploadedMedia = await uploadFile(selectedFile);
      await addStory(currentUser.id, uploadedMedia.url, uploadedMedia.type);

      setSelectedFile(null);
      onClose();
      addToast("Story shared!");
      queryClient.invalidateQueries(["stories"]);
    } catch (err) {
      console.error("Failed to create story:", err);
      addToast("Failed to share story.");
    } finally {
      setLoading(false);
    }
  };

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
              className="relative w-full group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="relative z-40 cursor-pointer group-hover:translate-x-8 group-hover:shadow-2xl group-hover:-translate-y-8 transition-all duration-500 bg-zinc-900 dark:bg-white flex items-center justify-center h-32 w-32 mx-auto rounded-xl border-4 border-white dark:border-zinc-900">
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
              <div className="absolute border-2 opacity-0 group-hover:opacity-80 transition-all duration-300 border-dashed border-violet-500 inset-0 z-30 bg-transparent flex items-center justify-center h-32 w-32 mx-auto rounded-xl"></div>
            </div>
            <div className="text-center mt-8">
              <p className="font-bold dark:text-white">Choose a photo</p>
              <p className="text-sm text-zinc-500">Stories last for 24 hours</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-[9/16] w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-2xl border dark:border-zinc-800">
              <img
                src={URL.createObjectURL(selectedFile)}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-rose-500 transition-colors"
                title="Remove"
              >
                <X size={20} />
              </button>
            </div>

            {/* Edit Tools List */}
            <div className="flex items-center justify-center gap-4 py-2 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl">
              <button
                onClick={handleStartCrop}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 group"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm group-hover:shadow-md transition-all">
                  <Pencil size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Crop / Edit
                </span>
              </button>

              {/* Placeholder for future tools */}
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl opacity-40 cursor-not-allowed text-zinc-600 dark:text-zinc-400">
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
                  <svg
                    size={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 21 3 22l1-4.5L17 3z"></path>
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Text
                </span>
              </button>

              <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl opacity-40 cursor-not-allowed text-zinc-600 dark:text-zinc-400">
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
                  <svg
                    size={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
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
            <Loader2 size={24} className="animate-spin mx-auto" />
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
  );
};

export default CreateStoryModal;
