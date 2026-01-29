import { supabase } from "@/lib/supabase";
import { compressImage } from "@/lib/compression";
import { generateVideoThumbnail } from "@/lib/video";

export interface UploadResult {
    url: string;
    poster: string | null;
    name: string;
    type: "image" | "video" | "file";
    size: number;
}

/**
 * Uploads a file to Supabase Storage.
 */
export const uploadFile = async (
    file: File,
    bucket: string = "media",
    customPoster: File | null = null,
): Promise<UploadResult> => {
    // Compress if it's an image
    let fileToUpload = file;
    let fileExt = file.name.split(".").pop();
    let posterUrl: string | null = null;

    if (file.type.startsWith("image/")) {
        try {
            fileToUpload = await compressImage(file);
            fileExt = "webp"; // Forced conversion in compression.js
        } catch (error) {
            console.error("Image compression failed, uploading original:", error);
        }
    }

    // Handle video poster
    if (file.type.startsWith("video/")) {
        try {
            if (customPoster) {
                // Use user provided thumbnail
                const thumbRes = await uploadFile(customPoster, bucket);
                posterUrl = thumbRes.url;
            } else {
                // Generate automatic thumbnail
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
                : "file",
        size: fileToUpload.size,
    };
};
