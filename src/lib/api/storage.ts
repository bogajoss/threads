import { supabase } from "@/lib/supabase";
import { compressImage } from "@/lib/compression";
import { generateVideoThumbnail } from "@/lib/video";

export interface UploadResult {
  url: string;
  poster: string | null;
  name: string;
  type: "image" | "video" | "file" | "audio";
  size: number;
}

export const uploadFile = async (
  file: File,
  bucket: string = "media",
  customPoster: File | null = null,
): Promise<UploadResult> => {
  let fileToUpload = file;
  let fileExt = file.name.split(".").pop();
  let posterUrl: string | null = null;

  if (file.type.startsWith("image/") && file.type !== "image/gif") {
    try {
      fileToUpload = await compressImage(file);
      fileExt = "webp";
    } catch (error) {
      console.error("Image compression failed, uploading original:", error);
    }
  }

  if (file.type.startsWith("video/")) {
    try {
      if (customPoster) {
        const thumbRes = await uploadFile(customPoster, bucket);
        posterUrl = thumbRes.url;
      } else {
        const thumbnailFile = await generateVideoThumbnail(file);
        const thumbRes = await uploadFile(thumbnailFile, bucket);
        posterUrl = thumbRes.url;
      }
    } catch (err) {
      console.error("Failed to handle video poster:", err);
    }
  }

  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileToUpload);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    url: publicUrl,
    poster: posterUrl,
    name: file.name,
    type: file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
          ? "audio"
          : "file",
    size: fileToUpload.size,
  };
};

export const deleteFileFromUrl = async (
  url: string,
  bucket: string = "media",
): Promise<void> => {
  try {
    if (!url) return;

    const urlParts = url.split(`/public/${bucket}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error(`Failed to delete file from storage: ${filePath}`, error);
    }
  } catch (err) {
    console.error("Error in deleteFileFromUrl:", err);
  }
};

export const deleteMultipleFiles = async (
  urls: (string | undefined | null)[],
  bucket: string = "media",
): Promise<void> => {
  const validUrls = urls.filter((url): url is string => !!url);
  if (validUrls.length === 0) return;

  await Promise.all(validUrls.map((url) => deleteFileFromUrl(url, bucket)));
};
