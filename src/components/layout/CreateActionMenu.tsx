import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Image, Film, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateActionMenuProps {
  triggerClassName?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

const CreateActionMenu: React.FC<CreateActionMenuProps> = ({
  triggerClassName,
  side = "right",
  align = "start",
}) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Create Menu"
          className={cn(
            "flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg",
            triggerClassName
          )}
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={12}
        className="w-56 rounded-2xl border-[--border] bg-[--card] p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <DropdownMenuItem
          onClick={() => navigate("/create")}
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-bold text-[--foreground] transition-colors focus:bg-zinc-50 dark:focus:bg-zinc-900"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
            <Layout size={18} />
          </div>
          <div className="flex flex-col">
            <span>Create Post</span>
            <span className="text-[11px] font-medium text-zinc-500">Share your thoughts</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/create", { state: { isStory: true } })}
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-bold text-[--foreground] transition-colors focus:bg-zinc-50 dark:focus:bg-zinc-900"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Image size={18} />
          </div>
          <div className="flex flex-col">
            <span>Add Story</span>
            <span className="text-[11px] font-medium text-zinc-500">Disappears in 24h</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/create", { state: { isReel: true } })}
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-bold text-[--foreground] transition-colors focus:bg-zinc-50 dark:focus:bg-zinc-900"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
            <Film size={18} />
          </div>
          <div className="flex flex-col">
            <span>Create Reel</span>
            <span className="text-[11px] font-medium text-zinc-500">Post a short video</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateActionMenu;
