import React from "react"

interface PostStatsProps {
    views: number
    likes: number
    comments: number
    isDetail?: boolean
    isComment?: boolean
    onRepliesClick?: (e: React.MouseEvent) => void
}

const PostStats: React.FC<PostStatsProps> = ({
    views,
    likes,
    comments,
    isDetail = false,
    isComment = false,
    onRepliesClick,
}) => {
    if (isDetail) {
        return (
            <div className="mt-4 flex items-center gap-x-6 border-b border-zinc-100 pb-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <div className="flex items-center gap-x-1">
                    <span className="font-bold text-black dark:text-white">
                        {views || 0}
                    </span>{" "}
                    <span className="opacity-70">Views</span>
                </div>
                <div className="flex items-center gap-x-1">
                    <span className="font-bold text-black dark:text-white">
                        {likes || 0}
                    </span>{" "}
                    <span className="opacity-70">Likes</span>
                </div>
                <div className="flex items-center gap-x-1">
                    <span className="font-bold text-black dark:text-white">
                        {comments || 0}
                    </span>{" "}
                    <span className="opacity-70">Comments</span>
                </div>
            </div>
        )
    }

    if (comments === 0 && likes === 0 && (views === 0 || isComment)) {
        return null
    }

    return (
        <div className={`mt-1 flex items-center gap-x-1.5 px-0.5 ${isComment ? "text-[12px]" : "text-[14px]"} font-medium text-zinc-500 dark:text-zinc-400`}>
            {views > 0 && !isComment && (
                <>
                    <span className="hover:underline">
                        {views} {views === 1 ? "view" : "views"}
                    </span>
                    {(comments > 0 || likes > 0) && (
                        <span className="opacity-50">·</span>
                    )}
                </>
            )}
            {comments > 0 && (
                <button 
                    className="hover:underline"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onRepliesClick) {
                            onRepliesClick(e)
                        }
                    }}
                >
                    {comments} {comments === 1 ? "reply" : "replies"}
                </button>
            )}
            {comments > 0 && likes > 0 && (
                <span className="opacity-50">·</span>
            )}
            {likes > 0 && (
                <button className="hover:underline">
                    {likes} {likes === 1 ? "like" : "likes"}
                </button>
            )}
        </div>
    )
}

export default PostStats
