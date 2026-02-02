import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler"]],
            },
        }),
        tailwindcss(),
        visualizer({
            open: false,
            filename: "dist/stats.html",
            gzipSize: true,
            brotliSize: true,
        }),
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
                advancedChunks: {
                    groups: [
                        {
                            name: "framework",
                            test: /node_modules\/(react|react-dom|react-router-dom|scheduler)/,
                            priority: 40,
                        },
                        {
                            name: "database",
                            test: /node_modules\/(@supabase|supabase-js)/,
                            priority: 30,
                        },
                        {
                            name: "query",
                            test: /node_modules\/@tanstack/,
                            priority: 30,
                        },
                        {
                            name: "ui-libs",
                            test: /node_modules\/(@radix-ui|lucide-react|clsx|tailwind-merge|sonner)/,
                            priority: 20,
                        },
                        {
                            name: "animations",
                            test: /node_modules\/(framer-motion|motion-dom|motion-utils)/,
                            priority: 25,
                        },
                        {
                            name: "media-libs",
                            test: /node_modules\/(plyr|plyr-react|wavesurfer.js|browser-image-compression|wavesurfer)/,
                            priority: 15,
                        },
                        {
                            name: "text-processing",
                            test: /node_modules\/(linkifyjs|linkify-react)/,
                            priority: 10,
                        },
                    ],
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