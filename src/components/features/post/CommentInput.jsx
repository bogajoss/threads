import React from 'react';
import { Plus, MapPin, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

const CommentInput = ({ currentUser, newComment, setNewComment, handleSubmitComment, loading }) => (
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
                        <Button className="!w-auto px-5 py-1.5 text-sm font-bold min-w-[70px]" onClick={handleSubmitComment} disabled={!newComment.trim() || loading}>
                            {loading ? <Loader2 size={16} className="animate-spin text-white mx-auto" /> : "Reply"}
                        </Button>
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

export default CommentInput;
