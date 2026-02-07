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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: "lightningcss",
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (/node_modules\/(react|react-dom|react-router-dom|scheduler)/.test(id)) {
              return "framework";
            }
            if (/node_modules\/(@supabase|supabase-js)/.test(id)) {
              return "database";
            }
            if (/node_modules\/@tanstack/.test(id)) {
              return "query";
            }
            if (/node_modules\/(framer-motion|motion-dom|motion-utils)/.test(id)) {
              return "animations";
            }
            if (/node_modules\/(@radix-ui|lucide-react|clsx|tailwind-merge|sonner)/.test(id)) {
              return "ui-libs";
            }
            if (/node_modules\/(plyr|plyr-react|wavesurfer.js|browser-image-compression|wavesurfer)/.test(id)) {
              return "media-libs";
            }
            if (/node_modules\/(linkifyjs|linkify-react)/.test(id)) {
              return "text-processing";
            }
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
      "framer-motion",
      "plyr",
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