import React from "react";
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "👍"];

interface MessageReactionPickerProps {
  onSelect: (emoji: string) => void;
  currentReaction?: string;
}

const MessageReactionPicker: React.FC<MessageReactionPickerProps> = ({
  onSelect,
  currentReaction,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="rounded-full p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          onClick={(e) => e.stopPropagation()}
        >
          <Smile size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-fit border border-zinc-100 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className={`rounded-full p-2 text-xl transition-all hover:bg-zinc-100 active:scale-125 dark:hover:bg-zinc-800 ${
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
