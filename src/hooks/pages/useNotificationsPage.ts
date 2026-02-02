import { useEffect, useMemo } from "react"
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
// @ts-ignore
import { fetchNotifications, markNotificationsAsRead } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"

export const useNotificationsPage = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // 1. Fetch Notifications using useInfiniteQuery
    const {
        data: notificationsData,
        fetchNextPage,
        hasNextPage: hasMore,
        isFetchingNextPage: isFetchingMore,
        isLoading,
        refetch
    } = useInfiniteQuery({
        queryKey: ["notifications", currentUser?.id],
        queryFn: ({ pageParam }) => fetchNotifications(currentUser?.id!, pageParam, 10),
        enabled: !!currentUser?.id,
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 10) return undefined;
            return lastPage[lastPage.length - 1].created_at;
        }
    });

    const notifications = useMemo(() => {
        return notificationsData?.pages.flatMap(page => page) || [];
    }, [notificationsData]);

    // Realtime subscription for notifications
    useEffect(() => {
        if (!currentUser?.id) return

        const channel = supabase
            .channel(`user_notifications:${currentUser.id}`)
            .on(
                // @ts-ignore
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `recipient_id=eq.${currentUser.id}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["notifications", currentUser.id] });
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentUser?.id, queryClient])

    const markReadMutation = useMutation({
        mutationFn: () => {
            if (!currentUser) return Promise.resolve()
            return markNotificationsAsRead(currentUser.id)
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["notifications", currentUser?.id] });
            const previousNotifications = queryClient.getQueryData(["notifications", currentUser?.id]);

            // Optimistically mark all as read
            queryClient.setQueryData(["notifications", currentUser?.id], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any[]) => 
                        page.map(n => ({ ...n, is_read: true }))
                    )
                };
            });

            return { previousNotifications };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(["notifications", currentUser?.id], context.previousNotifications);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", currentUser?.id] });
        },
    })

    const handleNotificationClick = (notif: any) => {
        if (notif.type === "follow") {
            navigate(`/u/${notif.user}`)
        } else if (notif.post_id) {
            navigate(`/post/${notif.post_id}`)
        }
    }

    // Mark notifications as read when the component mounts or updates
    useEffect(() => {
        if (currentUser?.id && notifications.some((n) => !n.is_read)) {
            markReadMutation.mutate()
        }
    }, [currentUser?.id, notifications.length, markReadMutation]) // notifications.length as proxy for changes

    return {
        currentUser,
        notifications,
        isLoading,
        isFetchingMore,
        hasMore,
        loadNotifications: fetchNextPage, // Maintain interface name
        refreshNotifications: refetch,
        handleNotificationClick,
        navigate,
    }
}