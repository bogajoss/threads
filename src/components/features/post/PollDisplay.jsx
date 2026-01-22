import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const PollDisplay = ({ poll, onVote }) => {
    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
    const [votedOption, setVotedOption] = useState(null);

    const handleVote = (optionId) => {
        if (votedOption) return;
        setVotedOption(optionId);
        onVote && onVote(optionId);
    };

    return (
        <div className="mt-3 space-y-2">
            {poll.options.map((option, idx) => {
                const percentage = totalVotes > 0 ? Math.round(((option.votes + (votedOption === option.id ? 1 : 0)) / (totalVotes + (votedOption ? 1 : 0))) * 100) : 0;
                const isSelected = votedOption === option.id;

                return (
                    <div
                        key={option.id || idx}
                        onClick={(e) => { e.stopPropagation(); handleVote(option.id); }}
                        className={`relative h-10 w-full rounded-xl overflow-hidden cursor-pointer border ${isSelected ? 'border-violet-500 dark:border-violet-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                    >
                        {/* Background Bar */}
                        {votedOption && (
                            <div
                                className="absolute top-0 left-0 h-full bg-zinc-200 dark:bg-zinc-800 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        )}

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                            <span className={`font-medium text-sm ${isSelected ? 'text-violet-600 font-bold' : 'text-zinc-700 dark:text-zinc-200'}`}>
                                {option.text} {isSelected && <CheckCircle2 size={14} className="inline ml-1 mb-0.5" />}
                            </span>
                            {votedOption && (
                                <span className="text-sm font-bold text-zinc-900 dark:text-white">{percentage}%</span>
                            )}
                        </div>
                    </div>
                );
            })}
            <div className="text-xs text-zinc-500 dark:text-zinc-400 pl-1">
                {totalVotes + (votedOption ? 1 : 0)} votes • {votedOption ? '6 days left' : 'Click to vote'}
            </div>
        </div>
    );
};

export default PollDisplay;
