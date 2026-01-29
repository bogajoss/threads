import React, { useMemo } from "react"
import type { User } from "@/types"

interface Reaction {
    emoji: string
    user_id: string
}

interface MessageReactionsProps {
    reactions?: Reaction[]
    currentUser: User | null
    onToggle: (emoji: string) => void
}

const MessageReactions: React.FC<MessageReactionsProps> = ({
    reactions = [],
    currentUser,
    onToggle,
}) => {
    const reactionGroups = useMemo(() => {
        const groups: Record<string, { count: number; me: boolean }> = {}
        reactions.forEach((r) => {
            if (!groups[r.emoji]) {
                groups[r.emoji] = {
                    count: 0,
                    me: false,
                }
            }
            groups[r.emoji].count += 1
            if (r.user_id === currentUser?.id) {
                groups[r.emoji].me = true
            }
        })
        return groups
    }, [reactions, currentUser])

    if (reactions.length === 0) return null

    return (
        <div className="mt-1 flex flex-wrap gap-1 px-2">
            {Object.entries(reactionGroups).map(([emoji, data]) => (
                <button
                    key={emoji}
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle(emoji)
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium transition-all active:scale-90 ${data.me
                            ? "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-400"
                            : "border-zinc-100 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                        }`}
                >
                    <span>{emoji}</span>
                    {data.count > 1 && <span>{data.count}</span>}
                </button>
            ))}
        </div>
    )
}

export default MessageReactions
