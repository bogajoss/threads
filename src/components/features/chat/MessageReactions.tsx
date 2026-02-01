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
        <div className="relative -mt-2.5 z-10 flex flex-wrap gap-1 px-2 pointer-events-none">
            {Object.entries(reactionGroups).map(([emoji, data]) => (
                <button
                    key={emoji}
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle(emoji)
                    }}
                    className={`pointer-events-auto flex items-center gap-1 rounded-[14px] border-[2px] px-2 py-1 text-sm font-medium shadow-sm transition-all hover:scale-110 active:scale-90 ${data.me
                        ? "border-white bg-violet-100 text-violet-700 shadow-violet-200/50 dark:border-zinc-900 dark:bg-violet-900 dark:text-violet-300 dark:shadow-none"
                        : "border-white bg-zinc-100 text-zinc-700 shadow-zinc-200/50 dark:border-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-none"
                        }`}
                >
                    <span className="leading-none">{emoji}</span>
                    {data.count > 1 && <span className="text-[10px] leading-none opacity-80">{data.count}</span>}
                </button>
            ))}
        </div>
    )
}

export default MessageReactions
