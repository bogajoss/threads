import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, UserPlus, AtSign, Layers, Loader2, MessageSquare, Zap } from 'lucide-react';
import { fetchNotifications } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
    const { currentUser } = useAuth();
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', currentUser?.id],
        queryFn: () => fetchNotifications(currentUser?.id),
        enabled: !!currentUser?.id
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-violet-500" />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full">
                    <Zap size={40} className="text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">Sign in to see notifications</h3>
                <p className="text-zinc-500 max-w-xs">Join the conversation and keep track of who's engaging with your content.</p>
            </div>
        );
    }

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart size={20} className="text-rose-500 fill-rose-500" />;
            case 'follow': return <UserPlus size={20} className="text-blue-500" />;
            case 'mention': return <AtSign size={20} className="text-emerald-500" />;
            case 'collect': return <Layers size={20} className="text-violet-500" />;
            case 'comment': return <MessageSquare size={20} className="text-violet-500" />;
            case 'repost': return <Layers size={20} className="text-amber-500" />;
            default: return <AtSign size={20} className="text-zinc-500" />;
        }
    };

    return (
        <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen shadow-sm pb-20">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
            </div>

            {notifications.length > 0 ? (
                notifications.map(notif => (
                    <div key={notif.id} className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                        <div className="shrink-0 pt-1">
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm dark:text-white">@{notif.user}</span>
                                <span className="text-zinc-500 text-xs">
                                    {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : 'Recent'}
                                </span>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-[15px]">
                                {notif.type === 'like' && 'liked your post'}
                                {notif.type === 'follow' && 'followed you'}
                                {notif.type === 'mention' && 'mentioned you in a post'}
                                {notif.type === 'collect' && 'collected your post'}
                                {notif.type === 'comment' && 'commented on your post'}
                                {notif.type === 'repost' && 'reposted your post'}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-16 text-center text-zinc-500">
                    <p className="font-medium">No notifications yet.</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;
