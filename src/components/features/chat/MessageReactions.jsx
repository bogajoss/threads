import React, { useMemo } from "react";

const MessageReactions = ({ reactions = [], currentUser, onToggle }) => {
  const reactionGroups = useMemo(() => {
    const groups = {};
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
    <div className="flex flex-wrap gap-1 mt-1 px-2">
      {Object.entries(reactionGroups).map(([emoji, data]) => (
        <button
          key={emoji}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(emoji);
          }}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-all active:scale-90 ${
            data.me
              ? "bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-900/30 dark:border-violet-800 dark:text-violet-400"
              : "bg-white border-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
          }`}
        >
          <span>{emoji}</span>
          {data.count > 1 && <span>{data.count}</span>}
        </button>
      ))}
    </div>
  );
};

export default MessageReactions;
