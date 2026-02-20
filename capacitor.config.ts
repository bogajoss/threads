import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mysys.app",
  appName: "mysys",
  webDir: "dist",
  server: {
    // Allow loading from your domain
    url: "https://feed.systemadminbd.com",
    // Fallback to local files if offline
    cleartext: true,
  },
  plugins: {
    App: {
      // Deep link configuration
      appId: "com.mysys.app",
      appName: "mysys",
      // URL schemes to handle
      url: "mysys://",
      // Associated domains for iOS
      iosUniversalLinkDomains: ["feed.systemadminbd.com"],
      // Android App Links
      androidAppLinks: {
        enabled: true,
        host: "feed.systemadminbd.com",
        pathPrefix: "/",
        scheme: "https",
      },
    },
  },
};

export default config;
