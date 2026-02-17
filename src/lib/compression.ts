import imageCompression, { type Options } from "browser-image-compression";

export const compressImage = async (
  file: File,
  options: Options = {},
): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const defaultOptions: Options = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.75,
    fileType: "image/webp",
    alwaysKeepResolution: true,
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
    return file;
  }
};
