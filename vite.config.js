import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dependenciesToChunk = {
  react: [
    "react",
    "react-dom",
    "react-router-dom"
  ],
  supabase: ["@supabase/supabase-js"],
  query: ["@tanstack/react-query"],
  ui: [
    "lucide-react",
    "framer-motion"
  ]
};

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: dependenciesToChunk
      }
    },
    sourcemap: true,
    target: "esnext"
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})