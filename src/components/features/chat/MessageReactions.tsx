import React, { useMemo } from "react";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

interface Reaction {
  emoji: string;
  user_id: string;
}

interface MessageReactionsProps {
  reactions?: Reaction[];
  currentUser: User | null;
  onToggle: (emoji: string) => void;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions = [],
  currentUser,
  onToggle,
}) => {
  const reactionGroups = useMemo(() => {
    const groups: Record<string, { count: number; me: boolean }> = {};
    reactions.forEach((r) => {
      if (!groups[r.emoji]) {
        groups[r.emoji] = {
          count: 0,
          me: false,
        };
      }
      groups[r.emoji].count += 1;
      if (r.user_id === currentUser?.id) {
        groups[r.emoji].me = true;
      }
    });
    return groups;
  }, [reactions, currentUser]);

  if (reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {Object.entries(reactionGroups).map(([emoji, data]) => (
        <button
          key={emoji}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(emoji);
          }}
          className={cn(
            "pointer-events-auto flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] font-bold shadow-sm transition-all hover:scale-110 active:scale-90",
            data.me
              ? "bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-900/30 dark:border-violet-800 dark:text-violet-400"
              : "bg-white border-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300",
          )}
        >
          <span className="leading-none">{emoji}</span>
          {data.count > 1 && (
            <span className="text-[10px] leading-none opacity-80">
              {data.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default MessageReactions;
