import React from 'react';

const QuotedPost = ({ user, time, content }) => (
    <div className="p-4">
        <div className="flex items-center gap-x-2 mb-2">
            <img src={user.avatar} className="size-6 rounded-full" alt={user.handle} />
            <span className="font-semibold text-sm">{user.handle}</span>
            <span className="text-zinc-500 text-sm">• {time}</span>
        </div>
        <p className="text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-line">
            {content}
        </p>
    </div>
);

export default QuotedPost;
