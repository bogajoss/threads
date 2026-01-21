import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, UserPlus, AtSign, Layers, Loader2 } from 'lucide-react';
import { fetchNotifications } from '../services/api';

const Notifications = () => {
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: fetchNotifications
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen shadow-sm pb-20">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
            </div>
            {notifications.map(notif => (
                <div key={notif.id} className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                    <div className="shrink-0 pt-1">
                        {notif.type === 'like' && <Heart size={20} className="text-rose-500 fill-rose-500" />}
                        {notif.type === 'follow' && <UserPlus size={20} className="text-blue-500" />}
                        {notif.type === 'mention' && <AtSign size={20} className="text-emerald-500" />}
                        {notif.type === 'collect' && <Layers size={20} className="text-violet-500" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm dark:text-white">@{notif.user}</span>
                            <span className="text-zinc-500 text-xs">{notif.time}</span>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[15px]">{notif.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Notifications;
