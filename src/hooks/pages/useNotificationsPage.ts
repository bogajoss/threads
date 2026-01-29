import { useEffect, useState, useCallback, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
// @ts-ignore
import { fetchNotifications, markNotificationsAsRead } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"

export const useNotificationsPage = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFetchingMore, setIsFetchingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const notificationsRef = useRef(notifications)

    useEffect(() => {
        notificationsRef.current = notifications
    }, [notifications])

    const loadNotifications = useCallback(
        async (isLoadMore = false) => {
            if (!currentUser?.id) return

            if (isLoadMore) setIsFetchingMore(true)
            else setIsLoading(true)

            try {
                const currentNotifications = notificationsRef.current
                const lastTimestamp =
                    isLoadMore && currentNotifications.length > 0
                        ? currentNotifications[currentNotifications.length - 1].created_at
                        : null

                const data = await fetchNotifications(
                    currentUser.id,
                    lastTimestamp,
                    10
                )

                if (data.length < 10) setHasMore(false)
                else setHasMore(true)

                if (isLoadMore) {
                    setNotifications((prev) => [...prev, ...data])
                } else {
                    setNotifications(data)
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err)
            } finally {
                setIsLoading(false)
                setIsFetchingMore(false)
            }
        },
        [currentUser?.id]
    )

    useEffect(() => {
        loadNotifications()
    }, [loadNotifications])

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
                    loadNotifications()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentUser?.id, loadNotifications])

    const markReadMutation = useMutation({
        mutationFn: () => {
            if (!currentUser) return Promise.resolve()
            return markNotificationsAsRead(currentUser.id)
        },
        onSuccess: () => {
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
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
    }, [currentUser?.id, notifications, markReadMutation])

    return {
        currentUser,
        notifications,
        isLoading,
        isFetchingMore,
        hasMore,
        loadNotifications,
        handleNotificationClick,
        navigate,
    }
}
