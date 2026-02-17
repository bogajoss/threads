export const generateVideoThumbnail = (
  file: File,
  seekTo: number = 1,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Thumbnail generation timed out"));
    }, 10000);

    const cleanup = () => {
      clearTimeout(timeout);
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }
      video.remove();
    };

    video.style.display = "none";
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      let targetTime = seekTo;
      if (seekTo === 1 && video.duration > 0) {
        targetTime = video.duration * (0.1 + Math.random() * 0.8);
      }
      video.currentTime = Math.min(targetTime, video.duration || targetTime);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          cleanup();
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              cleanup();
              reject(new Error("Could not create blob"));
              return;
            }
            const thumbnailFile = new File([blob], "thumbnail.webp", {
              type: "image/webp",
            });
            cleanup();
            resolve(thumbnailFile);
          },
          "image/webp",
          0.7,
        );
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Video loading error"));
    };
  });
};
