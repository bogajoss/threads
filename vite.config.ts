import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

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
    ],
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
                            test: /node_modules\/(plyr|lucide-react|@radix-ui|framer-motion|clsx|tailwind-merge)/,
                            priority: 20,
                        },
                        {
                            name: "utils",
                            test: /node_modules\/(date-fns|dayjs)/,
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
        ],
    },
});
