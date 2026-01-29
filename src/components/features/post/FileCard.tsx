import React from "react"
import { FileText, Download } from "lucide-react"
import type { Media } from "@/types"

interface FileCardProps {
    file: Media
}

const FileCard: React.FC<FileCardProps> = ({ file }) => (
    <div className="group mt-3 flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:border-violet-500/30 dark:border-zinc-800 dark:bg-zinc-900/10">
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30">
            <FileText size={20} />
        </div>
        <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold dark:text-white">
                {file.name}
            </div>
            {(file.size !== undefined) && (
                <div className="text-xs uppercase text-zinc-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
            )}
        </div>
        <a
            href={file.url}
            download={file.name}
            className="p-2 text-zinc-400 transition-colors hover:text-violet-600"
            onClick={(e) => e.stopPropagation()}
        >
            <Download size={18} />
        </a>
    </div>
)

export default FileCard
