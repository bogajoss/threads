import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Clipboard } from "@capacitor/clipboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Universal copy to clipboard - works on both web and Android
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Use Capacitor Clipboard for Android/iOS
      await Clipboard.write({ string: text });
    } else {
      // Use native Clipboard API for web
      await navigator.clipboard.writeText(text);
    }
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    throw err;
  }
};

// Get base URL for post links - works on both web and Android
export const getBaseUrl = (): string => {
  // For production web app
  if (window.location.origin.includes("systemadminbd.com")) {
    return "https://feed.systemadminbd.com";
  }
  // For localhost development
  if (window.location.origin.includes("localhost")) {
    return window.location.origin;
  }
  // For Android/Capacitor app
  if (Capacitor.isNativePlatform()) {
    return "https://feed.systemadminbd.com";
  }
  // Fallback
  return window.location.origin;
};

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const normalizedPath =
      pathname.length > 1 && pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;

    const persistentRoutes = new Set([
      "/",
      "/feed",
      "/home",
      "/explore",
      "/notifications",
      "/r",
      "/m",
      "/create",
      "/edit-profile",
    ]);

    const isPersistent = persistentRoutes.has(normalizedPath);

    if (!isPersistent) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

export const isValidUUID = (uuid: unknown): boolean => {
  if (typeof uuid !== "string") return false;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return uuidRegex.test(uuid);
};

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit?: "px" | "%";
}

export const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.reject(new Error("No 2d context"));
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY,
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
      0.95,
    );
  });
};

export const formatTimeAgo = (
  date: string | Date | null | undefined,
): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check for invalid date
  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return dateObj.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const isBangla = (text: unknown): boolean => {
  if (typeof text !== "string") return false;
  return /[\u0980-\u09FF]/.test(text);
};

export const extractUrl = (text: string | null | undefined): string | null => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

/**
 * Returns an optimized image URL. 
 * If the image is a GIF and the user is NOT Pro, it returns a static version
 * using Supabase Image Transformation.
 */
export const getSafeImageUrl = (url: string | null | undefined, isPro: boolean = false): string => {
  if (!url) return "";
  const lowerUrl = url.toLowerCase();
  
  // Only process GIFs
  if (!lowerUrl.includes('.gif')) return url;
  
  // If user is Pro, show the full animated GIF
  if (isPro) return url;
  
  // If not Pro, try to use Supabase Transformation to get a static frame (defaults to static if not specified otherwise)
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    return url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + '?width=400&height=400&quality=80';
  }
  
  return url;
};
