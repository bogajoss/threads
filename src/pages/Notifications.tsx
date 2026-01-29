import React from "react"
import { Heart, AtSign, Layers, Loader2, MessageSquare } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatTimeAgo } from "@/lib/utils"
import Button from "@/components/ui/Button"
import { FollowingIcon } from "@/components/ui/CustomIcons"
// @ts-ignore
import { useNotificationsPage } from "@/hooks"
import type { Notification } from "@/types"

const Notifications: React.FC = () => {
    const {
        currentUser,
        notifications,
        isLoading,
        isFetchingMore,
        hasMore,
        loadNotifications,
        handleNotificationClick,
    } = useNotificationsPage()

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 size={32} className="animate-spin text-violet-500" />
            </div>
        )
    }

    if (!currentUser) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                    <AtSign size={40} className="text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">
                    Sign in to see notifications
                </h3>
                <p className="max-w-xs text-zinc-500">
                    Join the conversation and keep track of who's engaging with your
                    content.
                </p>
            </div>
        )
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "like":
                return <Heart size={20} className="text-rose-500 fill-rose-500" />
            case "follow":
                return <FollowingIcon size={20} className="text-blue-500" />
            case "mention":
                return <AtSign size={20} className="text-emerald-500" />
            case "comment":
                return <MessageSquare size={20} className="text-violet-500" />
            case "repost":
                return <Layers size={20} className="text-amber-500" />
            default:
                return <AtSign size={20} className="text-zinc-500" />
        }
    }

    return (
        <div className="min-h-screen overflow-hidden rounded-none border-y border-zinc-100 bg-white pb-20 shadow-sm dark:bg-black dark:border-zinc-800 md:rounded-xl md:border">
            <div className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 p-4 backdrop-blur-md dark:bg-black/80 dark:border-zinc-800">
                <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
            </div>

            {notifications.length > 0 ? (
                notifications.map((notif: Notification) => (
                    <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`flex cursor-pointer items-start gap-4 border-b border-zinc-100 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 ${!notif.is_read ? "bg-violet-50/30 dark:bg-violet-500/5" : ""}`}
                    >
                        <div className="shrink-0 pt-1">{getIcon(notif.type)}</div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-3">
                                <Avatar className="size-8">
                                    <AvatarImage src={notif.avatar} />
                                    <AvatarFallback>
                                        {notif.user?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-1 items-center justify-between">
                                    <span className="truncate text-sm font-bold dark:text-white">
                                        @{notif.user}
                                    </span>
                                    <span className="whitespace-nowrap text-xs text-zinc-500">
                                        {formatTimeAgo(notif.created_at)}
                                    </span>
                                </div>
                            </div>
                            <p className="ml-11 text-[15px] text-zinc-600 dark:text-zinc-400">
                                {notif.type === "like" && "liked your post"}
                                {notif.type === "follow" && "followed you"}
                                {notif.type === "mention" && "mentioned you in a post"}
                                {notif.type === "comment" && "commented on your post"}
                                {notif.type === "repost" && "reposted your post"}
                            </p>
                        </div>
                        {!notif.is_read && (
                            <div className="mt-2 size-2 shrink-0 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                        )}
                    </div>
                ))
            ) : (
                <div className="p-16 text-center text-zinc-500">
                    <p className="font-medium">No notifications yet.</p>
                </div>
            )}

            {notifications.length > 0 && hasMore && (
                <div className="flex justify-center border-t border-zinc-100 p-6 dark:border-zinc-800">
                    <Button
                        variant="secondary"
                        className="w-full max-w-xs"
                        onClick={() => loadNotifications(true)}
                        disabled={isFetchingMore}
                    >
                        {isFetchingMore ? (
                            <Loader2 size={18} className="mr-2 animate-spin" />
                        ) : null}
                        Load more
                    </Button>
                </div>
            )}

            {notifications.length > 0 && !hasMore && (
                <div className="p-8 text-center text-sm text-zinc-500">
                    You've caught up with everything!
                </div>
            )}
        </div>
    )
}

export default Notifications
