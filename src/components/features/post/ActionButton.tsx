import React from "react"
import type { LucideIcon, LucideProps } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionButtonProps {
    icon: React.ComponentType<LucideProps> | LucideIcon
    count?: number
    label?: string
    onClick?: (e: React.MouseEvent) => void
    active?: boolean
    activeColorClass?: string
    size?: number
    type?: "like" | "repost" | "comment" | "share" | "default"
}

const ActionButton: React.FC<ActionButtonProps> = ({
    icon: Icon,
    count,
    label,
    onClick,
    active,
    activeColorClass,
    size = 18,
    type = "default",
}) => {
    const typeConfigs = {
        like: {
            hoverBg: "group-hover:bg-rose-500/10",
            hoverText: "group-hover:text-rose-500",
            activeText: "text-rose-500",
            activeFill: "fill-rose-500",
        },
        repost: {
            hoverBg: "group-hover:bg-emerald-500/10",
            hoverText: "group-hover:text-emerald-500",
            activeText: "text-emerald-500",
            activeFill: "fill-emerald-500",
        },
        comment: {
            hoverBg: "group-hover:bg-sky-500/10",
            hoverText: "group-hover:text-sky-500",
            activeText: "text-sky-500",
            activeFill: "fill-sky-500",
        },
        share: {
            hoverBg: "group-hover:bg-violet-500/10",
            hoverText: "group-hover:text-violet-500",
            activeText: "text-violet-500",
            activeFill: "fill-violet-500",
        },
        default: {
            hoverBg: "group-hover:bg-zinc-500/10",
            hoverText: "group-hover:text-zinc-500",
            activeText: "text-zinc-900 dark:text-white",
            activeFill: "fill-current",
        }
    };

    const config = typeConfigs[type] || typeConfigs.default;
    const activeColor = activeColorClass || config.activeText;

    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                if (onClick) {
                    onClick(e)
                }
            }}
            aria-label={`${label} ${count !== undefined ? `(${count})` : ""}`}
            className={cn(
                "group -ml-2 flex items-center gap-x-0.5 rounded-xl px-2 py-1.5 text-[12px] font-bold transition-all sm:gap-x-1 sm:text-[13px]",
                active ? activeColor : "text-zinc-500",
                !active && config.hoverText
            )}
        >
            <div
                className={cn(
                    "rounded-full p-2 transition-all duration-200",
                    !active && config.hoverBg
                )}
            >
                <Icon
                    size={size}
                    strokeWidth={active ? 2.5 : 2}
                    className={cn("transition-colors duration-200", active && config.activeFill)}
                />
            </div>
            {label && <span className="hidden xs:inline">{label}</span>}
            {count !== undefined && count !== null && (
                <span className={cn("transition-all", active ? "font-black" : "font-bold")}>
                    {count || 0}
                </span>
            )}
        </button>
    )
}

export default ActionButton
