/**
 * Generates a thumbnail from a video file at a specific second.
 */
export const generateVideoThumbnail = (file, seekTo = 1) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = seekTo;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const thumbnailFile = new File([blob], "thumbnail.webp", {
          type: "image/webp",
        });
        URL.revokeObjectURL(video.src);
        resolve(thumbnailFile);
      }, "image/webp", 0.7);
    };

    video.onerror = (e) => reject(e);
  });
};
