import React from "react"
import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { ActionButton } from "@/components/features/post"
import { ShareIcon, ChatIcon } from "@/components/ui"

interface PostActionsProps {
    isComment?: boolean
    liked: boolean
    reposted: boolean
    handleLike: (e?: React.MouseEvent) => void
    handleRepost: (e?: React.MouseEvent) => void
    handleCommentClick: (e?: React.MouseEvent) => void
    handleShareClick?: (e?: React.MouseEvent) => void
    isDetail?: boolean
}

const PostActions: React.FC<PostActionsProps> = ({
    isComment,
    liked,
    reposted,
    handleLike,
    handleRepost,
    handleCommentClick,
    handleShareClick,
    isDetail = false,
}) => {
    if (isDetail) {
        return (
            <div className="mt-4 flex w-full items-center justify-around py-1">
                <ActionButton
                    icon={Heart}
                    label="Like"
                    type="like"
                    onClick={handleLike}
                    active={liked}
                />
                {!isComment && (
                    <ActionButton
                        icon={Repeat2}
                        label="Repost"
                        type="repost"
                        onClick={handleRepost}
                        active={reposted}
                    />
                )}
                <ActionButton
                    icon={ChatIcon}
                    label="Comment"
                    type="comment"
                    onClick={handleCommentClick}
                />
                {!isComment && (
                    <ActionButton
                        icon={ShareIcon}
                        label="Share"
                        type="share"
                        onClick={handleShareClick}
                    />
                )}
            </div>
        )
    }

    return (
        <div className={`flex items-center gap-x-1 ${isComment ? "mt-1.5" : "mt-3"}`}>
            <ActionButton
                icon={Heart}
                size={isComment ? 16 : 18}
                type="like"
                onClick={handleLike}
                active={liked}
            />
            <ActionButton
                icon={MessageCircle}
                size={isComment ? 16 : 18}
                type="comment"
                onClick={handleCommentClick}
            />
            <ActionButton
                icon={Repeat2}
                size={isComment ? 16 : 18}
                type="repost"
                onClick={handleRepost}
                active={reposted}
            />
            {!isComment && handleShareClick && (
                <ActionButton
                    icon={ShareIcon}
                    type="share"
                    onClick={handleShareClick}
                />
            )}
        </div>
    )
}

export default PostActions
