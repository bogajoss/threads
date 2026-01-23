import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUnreadNotificationsCount } from '@/services/api';
import { supabase } from '@/lib/supabase';

export const useNotifications = (currentUser) => {
    const queryClient = useQueryClient();

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['unread_notifications_count', currentUser?.id],
        queryFn: () => fetchUnreadNotificationsCount(currentUser?.id),
        enabled: !!currentUser?.id
    });

    useEffect(() => {
        if (!currentUser?.id) return;

        const channel = supabase
            .channel(`unread_count:${currentUser.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_id=eq.${currentUser.id}`
            }, () => {
                queryClient.invalidateQueries({ queryKey: ['unread_notifications_count', currentUser.id] });
                queryClient.invalidateQueries({ queryKey: ['notifications', currentUser.id] });
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [currentUser?.id, queryClient]);

    return { unreadCount };
};
