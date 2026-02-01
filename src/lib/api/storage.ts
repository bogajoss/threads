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
                : file.type.startsWith("audio/")
                    ? "audio"
                    : "file",
        size: fileToUpload.size,
    };
};

/**
 * Extracts the storage path from a Supabase public URL and deletes the file.
 */
export const deleteFileFromUrl = async (url: string, bucket: string = "media"): Promise<void> => {
    try {
        if (!url) return;
        
        // Example URL: https://dbkcedktqhueqnulnosq.supabase.co/storage/v1/object/public/media/filename.webp
        // We need to extract 'filename.webp'
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

/**
 * Deletes multiple files from their URLs.
 */
export const deleteMultipleFiles = async (urls: (string | undefined | null)[], bucket: string = "media"): Promise<void> => {
    const validUrls = urls.filter((url): url is string => !!url);
    if (validUrls.length === 0) return;
    
    // Process in parallel
    await Promise.all(validUrls.map(url => deleteFileFromUrl(url, bucket)));
};
