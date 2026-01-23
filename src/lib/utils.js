import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const isValidUUID = (uuid) => {
  if (typeof uuid !== "string") return false;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return uuidRegex.test(uuid);
};

/**

 * @param {HTMLImageElement} image - Image File Object

 * @param {Object} crop - pixelCrop Object

 * @param {String} fileName - Name of the returned file in Promise

 */

export const getCroppedImg = (image, crop) => {
  const canvas = document.createElement("canvas");

  const scaleX = image.naturalWidth / image.width;

  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;

  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,

    crop.x * scaleX,

    crop.y * scaleY,

    crop.width * scaleX,

    crop.height * scaleY,

    0,

    0,

    crop.width,

    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));

          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      1,
    );
  });
};

export const formatTimeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};
