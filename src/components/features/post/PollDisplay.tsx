import React, { useState } from "react"
import { CheckCircle2 } from "lucide-react"

interface PollOption {
    id: string
    text: string
    votes: number
}

interface Poll {
    id: string
    options: PollOption[]
}

interface PollDisplayProps {
    poll: Poll
    onVote?: (optionId: string) => void
}

const PollDisplay: React.FC<PollDisplayProps> = ({ poll, onVote }) => {
    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0)
    const [votedOption, setVotedOption] = useState<string | null>(null)

    const handleVote = (optionId: string) => {
        if (votedOption) return
        setVotedOption(optionId)
        onVote && onVote(optionId)
    }

    return (
        <div className="mt-3 space-y-2">
            {poll.options.map((option, idx) => {
                const percentage =
                    totalVotes > 0
                        ? Math.round(
                            ((option.votes + (votedOption === option.id ? 1 : 0)) /
                                (totalVotes + (votedOption ? 1 : 0))) *
                            100
                        )
                        : 0
                const isSelected = votedOption === option.id

                return (
                    <div
                        key={option.id || idx}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleVote(option.id)
                        }}
                        className={`relative h-10 w-full overflow-hidden rounded-xl border cursor-pointer ${isSelected ? "border-violet-500 dark:border-violet-500" : "border-zinc-200 dark:border-zinc-700"}`}
                    >
                        {/* Background Bar */}
                        {votedOption && (
                            <div
                                className="absolute left-0 top-0 h-full bg-zinc-200 transition-all duration-500 dark:bg-zinc-800"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        )}

                        {/* Content */}
                        <div className="absolute inset-0 z-10 flex items-center justify-between px-4">
                            <span
                                className={`text-sm font-medium ${isSelected ? "font-bold text-violet-600" : "text-zinc-700 dark:text-zinc-200"}`}
                            >
                                {option.text}{" "}
                                {isSelected && (
                                    <CheckCircle2 size={14} className="mb-0.5 inline ml-1" />
                                )}
                            </span>
                            {votedOption && (
                                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                                    {percentage}%
                                </span>
                            )}
                        </div>
                    </div>
                )
            })}
            <div className="pl-1 text-xs text-zinc-500 dark:text-zinc-400">
                {totalVotes + (votedOption ? 1 : 0)} votes •{" "}
                {votedOption ? "6 days left" : "Click to vote"}
            </div>
        </div>
    )
}

export default PollDisplay
