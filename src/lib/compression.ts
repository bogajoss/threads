import imageCompression, { type Options } from "browser-image-compression";

/**
 * Compresses an image file.
 * @param {File} file - The original image file.
 * @param {Options} options - Custom compression options.
 * @returns {Promise<File>} - The compressed file.
 */
export const compressImage = async (
  file: File,
  options: Options = {},
): Promise<File> => {
  // If it's not an image, return original file
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const defaultOptions: Options = {
    maxSizeMB: 0.8, // Slightly more aggressive (800KB)
    maxWidthOrHeight: 1920, // Keep Full HD resolution
    useWebWorker: true,
    initialQuality: 0.75, // Good balance for WebP
    fileType: "image/webp",
    alwaysKeepResolution: true, // Don't shrink dimensions unless necessary
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(
      `Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
    );
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    return file; // Fallback to original file if compression fails
  }
};
