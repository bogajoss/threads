// App configuration
export const APP_CONFIG = {
  // Production base URL - change this for production
  BASE_URL: 'https://feed.systemadminbd.com',
  
  // App ID
  APP_ID: 'com.mysys.app',
  
  // Custom URL scheme
  CUSTOM_SCHEME: 'mysys',
};

/**
 * Get the base URL for generating links
 * In production APK, this returns the configured BASE_URL
 * In development, you can override with environment variable
 */
export const getBaseUrl = (): string => {
  // Check if running in Capacitor/Android
  if (window.hasOwnProperty('Capacitor')) {
    // For APK, always use production URL
    return APP_CONFIG.BASE_URL;
  }
  
  // For web development, use environment variable or default
  return import.meta.env.VITE_BASE_URL || APP_CONFIG.BASE_URL;
};

/**
 * Generate a full URL for a path
 * @param path - The path (e.g., '/p/123', '/r/456')
 * @returns Full URL (e.g., 'https://feed.systemadminbd.com/p/123')
 */
export const generateUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generate a post URL
 * @param postId - The post ID
 * @returns Full post URL
 */
export const generatePostUrl = (postId: string): string => {
  return generateUrl(`/p/${postId}`);
};

/**
 * Generate a reel URL
 * @param reelId - The reel ID
 * @returns Full reel URL
 */
export const generateReelUrl = (reelId: string): string => {
  return generateUrl(`/r/${reelId}`);
};

/**
 * Generate a profile URL
 * @param handle - The user handle
 * @returns Full profile URL
 */
export const generateProfileUrl = (handle: string): string => {
  return generateUrl(`/u/${handle}`);
};

/**
 * Generate a community URL
 * @param handle - The community handle
 * @returns Full community URL
 */
export const generateCommunityUrl = (handle: string): string => {
  return generateUrl(`/c/${handle}`);
};

/**
 * Generate a message URL
 * @param conversationId - The conversation ID
 * @returns Full message URL
 */
export const generateMessageUrl = (conversationId: string): string => {
  return generateUrl(`/m/${conversationId}`);
};
