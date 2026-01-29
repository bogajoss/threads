import React from "react"
import type { LucideIcon, LucideProps } from "lucide-react"

interface ActionButtonProps {
    icon: React.ComponentType<LucideProps> | LucideIcon
    count?: number
    label?: string
    onClick?: (e: React.MouseEvent) => void
    active?: boolean
    activeColorClass?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({
    icon: Icon,
    count,
    label,
    onClick,
    active,
    activeColorClass = "text-violet-600",
}) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                onClick && onClick(e)
            }}
            aria-label={`${label} ${count !== undefined ? `(${count})` : ""}`}
            className={`group -ml-2 flex items-center gap-x-1 rounded-xl px-2 py-1.5 text-[12px] font-bold transition-all active:scale-95 sm:gap-x-1.5 sm:text-[13px] ${active ? activeColorClass : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
        >
            <div
                className={`rounded-full p-2 transition-colors ${active ? "" : "group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"}`}
            >
                <Icon
                    size={18}
                    strokeWidth={active ? 2.5 : 2}
                    className={active ? "fill-current" : ""}
                />
            </div>
            {label && <span className="hidden xs:inline">{label}</span>}
            {count !== undefined && count !== null && (
                <span className={active ? "font-bold" : ""}>{count || 0}</span>
            )}
        </button>
    )
}

export default ActionButton
