import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export const useDeepLinks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Only run on native platforms (Android/iOS)
    if (!Capacitor.isNativePlatform()) return;

    // Handle initial deep link (when app is launched from a link)
    const handleInitialDeepLink = async () => {
      try {
        const data = await App.getLaunchUrl();
        if (data && data.url) {
          handleDeepLink(data.url);
        }
      } catch (err) {
        console.error("Error getting launch URL:", err);
      }
    };

    // Parse and navigate based on the deep link
    const handleDeepLink = (url: string) => {
      console.log("Deep link received:", url);

      try {
        // Remove protocol and domain
        const urlObj = new URL(url);
        const path = urlObj.pathname;

        // Navigate to the appropriate page
        if (path) {
          // Handle different route patterns
          if (path.startsWith("/p/")) {
            // Post link
            navigate(path);
          } else if (path.startsWith("/r/")) {
            // Reel link
            navigate(path);
          } else if (path.startsWith("/profile/")) {
            // Profile link
            navigate(path);
          } else if (path.startsWith("/m/")) {
            // Message link
            navigate(path);
          } else if (path.startsWith("/c/")) {
            // Community link
            navigate(path);
          } else {
            // Default to home
            navigate("/");
          }
        }
      } catch (err) {
        console.error("Error parsing deep link:", err);
      }
    };

    // Initialize deep link handling
    handleInitialDeepLink();

    // Note: For handling URLs while app is running, you may need to use
    // the App Launcher plugin or handle it in MainActivity
  }, [navigate]);
};
