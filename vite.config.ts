import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { compression } from "vite-plugin-compression2";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    compression({
      algorithms: ["brotliCompress"],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  server: {
    host: true,
  },
  clearScreen: false,
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    // Targeting Chrome 100+ ensures compatibility with modern Android WebViews 
    // while allowing for modern JS features and smaller polyfills.
    target: ["chrome100", "safari15"],
    minify: "esbuild",
    cssMinify: "lightningcss",
    cssCodeSplit: true,
    sourcemap: false, // Ensure sourcemaps are off for production to reduce bundle size
    reportCompressedSize: false, // Speed up build time
    chunkSizeWarningLimit: 2000,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        // Grouping into fewer, larger chunks is often faster for local file:// loading in Capacitor
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (/(react|react-dom|react-router-dom|scheduler)/.test(id)) return "vendor-core";
            if (/(@supabase|supabase-js)/.test(id)) return "vendor-db";
            if (/(@tanstack|video\.js|wavesurfer\.js|motion)/.test(id)) return "vendor-heavy";
            if (/(@radix-ui|lucide-react|framer-motion)/.test(id)) return "vendor-ui";
            return "vendor-others";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "@tanstack/react-query",
      "lucide-react",
      "motion",
      "video.js",
      "wavesurfer.js",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "sonner",
      "react-virtuoso",
      "frimousse",
      "next-themes",
      "browser-image-compression",
      "react-image-crop",
      "linkifyjs",
      "linkify-react",
    ],
  },
});
