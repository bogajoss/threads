import React, { useState } from 'react';
import {
    MessageCircle,
    Repeat2,
    Heart,
    Layers,
    CircleDollarSign,
    MoreHorizontal,
    Plus,
    MapPin
} from 'lucide-react';
import Button from '../../ui/Button';
import VerifiedBadge from '../../ui/VerifiedBadge';
import VideoPlayer from './VideoPlayer';
import ImageAttachment from './ImageAttachment';
import PollDisplay from './PollDisplay';
import QuotedPost from './QuotedPost';
import { usePostInteraction } from '../../../hooks/usePostInteraction';

const ActionButton = ({ icon, count, onClick, active, activeColorClass = "text-violet-600" }) => {
    const Icon = icon;
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}
            className={`group flex items-center gap-x-2 text-[13px] font-medium transition-all ${active ? activeColorClass : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
            <div className={`rounded-full p-2 transition-colors ${active ? 'bg-current/10' : 'group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800'}`}>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? 'fill-current' : ''} />
            </div>
            {count !== undefined && count !== null && <span className={active ? 'font-bold' : ''}>{count || 0}</span>}
        </button>
    );
};

const CommentInput = ({ currentUser, newComment, setNewComment, handleSubmitComment }) => (
    currentUser ? (
        <div className="p-4 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
            <div className="flex gap-3">
                <img src={currentUser.avatar} className="size-9 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700" alt="" />
                <div className="flex-1">
                    <textarea
                        id="comment-input"
                        className="w-full bg-transparent outline-none text-base min-h-[60px] resize-none dark:text-white placeholder:text-zinc-500"
                        placeholder="Post your reply..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex text-violet-600 gap-1">
                            <button className="text-violet-600 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full p-2"><Plus size={20} /></button>
                            <button className="text-violet-600 hover:bg-violet-50 dark:hover:bg-zinc-800 rounded-full p-2"><MapPin size={20} /></button>
                        </div>
                        <Button className="!w-auto px-5 py-1.5 text-sm font-bold" onClick={handleSubmitComment} disabled={!newComment.trim()}>Reply</Button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="p-6 text-center border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
            <p className="text-zinc-500 text-sm">Please login to join the conversation.</p>
        </div>
    )
);

const Post = ({
    user,
    timeAgo,
    content,
    contentClass,
    media,
    quotedPost,
    stats,
    onClick,
    repostedBy,
    onUserClick,
    currentUser,
    showToast,
    poll,
    isDetail,
    initialComments
}) => {
    const { liked, reposted, localStats, setLocalStats, handleLike, handleRepost } = usePostInteraction(stats, currentUser, showToast);
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState("");

    const renderMedia = (m) => {
        if (!m) return null;
        if (React.isValidElement(m)) return m;
        if (m.type === 'video') return <VideoPlayer poster={m.poster} duration={m.duration} />;
        if (m.type === 'image') return <ImageAttachment src={m.src} />;
        return null;
    };

    const renderContent = (c, className) => {
        if (typeof c === 'string') {
            return <p className={`whitespace-pre-line ${className || ''}`}>{c}</p>;
        }
        return c;
    };

    const renderQuotedPost = (q) => {
        if (!q) return null;
        if (React.isValidElement(q)) return q;
        return <QuotedPost {...q} />;
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const commentObj = {
            id: Date.now().toString(),
            user: {
                ...currentUser,
                verified: currentUser.verified
            },
            timeAgo: 'Just now',
            content: newComment,
            stats: { comments: 0, likes: 0, collects: 0 },
        };

        setComments([commentObj, ...comments]);
        setNewComment("");
        setLocalStats(prev => ({ ...prev, comments: (prev.comments || 0) + 1 }));
        if (showToast) showToast("Reply posted!");
    };

    if (isDetail) {
        return (
            <div className="flex flex-col">
                <article className="p-5 dark:bg-black">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-x-3">
                            <button className="shrink-0" onClick={() => onUserClick && onUserClick(user.handle)}>
                                <img src={user.avatar} alt={user.handle} className="size-12 rounded-full border border-zinc-200 bg-zinc-200 object-cover dark:border-zinc-700 dark:bg-zinc-800" />
                            </button>
                            <div className="flex flex-col">
                                <div className="flex flex-wrap items-center gap-x-1">
                                    <button className="font-bold hover:underline text-zinc-900 dark:text-white flex items-center gap-1 text-base" onClick={() => onUserClick && onUserClick(user.handle)}>
                                        {user.handle}
                                        {user.verified && <VerifiedBadge />}
                                    </button>
                                </div>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">@{user.handle}</span>
                            </div>
                        </div>
                        <button className="text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2"><MoreHorizontal size={20} /></button>
                    </div>
                    <div className={`break-words text-zinc-900 dark:text-zinc-100 mt-4 text-xl leading-8 whitespace-pre-line`}>{renderContent(content, contentClass)}</div>
                    {renderMedia(media)}
                    {poll && <PollDisplay poll={poll} />}
                    {quotedPost && (
                        <div className="mt-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm">
                            {renderQuotedPost(quotedPost)}
                        </div>
                    )}
                    <div className="my-4 flex items-center text-zinc-500 dark:text-zinc-400 text-sm border-b border-zinc-100 dark:border-zinc-800 pb-4">{timeAgo}</div>

                    <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex items-center gap-x-6 text-zinc-500 dark:text-zinc-400 text-sm">
                        <div className="flex items-center gap-x-1"><span className="font-bold text-black dark:text-white">{localStats.comments || 0}</span> <span className="opacity-70">Comments</span></div>
                        <div className="flex items-center gap-x-1"><span className="font-bold text-black dark:text-white">{localStats.likes || 0}</span> <span className="opacity-70">Likes</span></div>
                        <div className="flex items-center gap-x-1"><span className="font-bold text-black dark:text-white">{localStats.collects || 0}</span> <span className="opacity-70">Collects</span></div>
                    </div>

                    <div className="mt-4 flex w-full items-center justify-around py-1">
                        <ActionButton icon={MessageCircle} onClick={() => document.getElementById('comment-input')?.focus()} />
                        <ActionButton icon={Repeat2} onClick={handleRepost} active={reposted} activeColorClass="text-emerald-500" />
                        <ActionButton icon={Heart} onClick={handleLike} active={liked} activeColorClass="text-rose-500" />
                        <ActionButton icon={Layers} />
                        <ActionButton icon={CircleDollarSign} />
                    </div>
                </article>

                <CommentInput
                    currentUser={currentUser}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleSubmitComment={handleSubmitComment}
                />

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {comments.map(c => (
                        <Post
                            key={c.id}
                            {...c}
                            onUserClick={onUserClick}
                            currentUser={currentUser}
                            showToast={showToast}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <article
            onClick={onClick}
            className={`px-5 pt-4 pb-3 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${onClick ? 'cursor-pointer' : ''}`}
        >
            {repostedBy && (
                <div className="mb-2 flex items-center space-x-1.5 text-[13px] text-zinc-500 font-semibold ml-1">
                    <Repeat2 size={14} className="text-zinc-400" />
                    <span className="hover:underline cursor-pointer flex items-center text-zinc-600 dark:text-zinc-400" onClick={(e) => { e.stopPropagation(); onUserClick && onUserClick(repostedBy.handle || 'kolin'); }}>
                        <span className="truncate max-w-[150px]">{typeof repostedBy === 'object' ? repostedBy.name : repostedBy}</span>
                    </span>
                    <span className="text-zinc-400">reposted</span>
                </div>
            )}
            <div className="flex items-start gap-x-3">
                <button className="shrink-0 group" onClick={(e) => { e.stopPropagation(); onUserClick && onUserClick(user.handle); }}>
                    <img src={user.avatar} alt={user.handle} className="size-11 rounded-full border border-zinc-200 bg-zinc-200 object-cover dark:border-zinc-700 dark:bg-zinc-800 group-hover:brightness-95 transition-all" />
                </button>
                <div className="min-w-0 flex-1">
                    <div className="flex w-full items-start justify-between">
                        <div className="flex flex-col min-w-0">
                            <div className="flex flex-wrap items-center gap-x-1">
                                <button className="font-bold hover:underline text-zinc-900 dark:text-white flex items-center gap-1 truncate text-[15px]" onClick={(e) => { e.stopPropagation(); onUserClick && onUserClick(user.handle); }}>
                                    <span className="truncate">{user.handle}</span>
                                    {user.verified && <VerifiedBadge />}
                                </button>
                                {user.context && (
                                    <>
                                        <span className="text-zinc-400 text-xs px-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </span>
                                        <button className="flex items-center gap-x-1 hover:underline text-zinc-900 dark:text-zinc-200 truncate max-w-[120px]" onClick={(e) => { e.stopPropagation(); onUserClick && onUserClick(user.context.name); }}>
                                            {user.context.icon && <img src={user.context.icon} className="size-4 rounded-sm" alt="" />}
                                            <span className="truncate text-sm font-semibold">{user.context.name}</span>
                                        </button>
                                    </>
                                )}
                                <span className="text-zinc-400 text-sm ml-1 whitespace-nowrap">• {timeAgo}</span>
                            </div>
                        </div>
                        <button className="text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 rounded-full p-2 -mr-2 transition-colors" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    <div className="break-words text-zinc-900 dark:text-zinc-100 mt-1 whitespace-pre-line text-[15px] leading-relaxed">
                        {renderContent(content, contentClass)}
                        {renderMedia(media)}
                        {poll && <PollDisplay poll={poll} onVote={() => showToast && showToast("Voted!")} />}
                        {quotedPost && (
                            <div className="mt-3 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                {renderQuotedPost(quotedPost)}
                            </div>
                        )}
                    </div>

                    <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-3 pr-4">
                        <div className="flex items-center gap-x-6">
                            <ActionButton
                                icon={MessageCircle}
                                count={localStats.comments}
                                onClick={onClick}
                            />
                            <ActionButton
                                icon={Repeat2}
                                count={localStats.mirrors}
                                active={reposted}
                                onClick={handleRepost}
                                activeColorClass="text-emerald-500"
                            />
                            <ActionButton
                                icon={Heart}
                                count={localStats.likes}
                                active={liked}
                                onClick={handleLike}
                                activeColorClass="text-rose-500"
                            />
                            <ActionButton icon={Layers} count={localStats.collects} />
                            <ActionButton icon={CircleDollarSign} />
                        </div>
                        {stats && stats.showCollect !== false && (
                            <button
                                className="rounded-full font-bold inline-flex items-center justify-center px-3 py-1 text-xs text-zinc-900 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Collect
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Post;
