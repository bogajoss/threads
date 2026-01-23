import React from "react";
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "👍"];

const MessageReactionPicker = ({ onSelect, currentReaction }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90"
          onClick={(e) => e.stopPropagation()}
        >
          <Smile size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-fit p-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className={`text-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-125 ${
                currentReaction === emoji ? "bg-zinc-100 dark:bg-zinc-800" : ""
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MessageReactionPicker;
