import React from "react";
import { FileText, Download } from "lucide-react";

const FileCard = ({ file }) => (
  <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 group hover:border-violet-500/30 transition-colors">
    <div className="size-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
      <FileText size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-bold truncate dark:text-white">
        {file.name}
      </div>
      <div className="text-xs text-zinc-500 uppercase">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </div>
    </div>
    <a
      href={file.url}
      download={file.name}
      className="p-2 text-zinc-400 hover:text-violet-600 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      <Download size={18} />
    </a>
  </div>
);

export default FileCard;
