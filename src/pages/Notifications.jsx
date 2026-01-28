import React from "react";
import {
  Heart,
  AtSign,
  Layers,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { FollowingIcon } from "@/components/ui/CustomIcons";
import { useNotificationsPage } from "@/hooks";

const Notifications = () => {
  const {
    currentUser,
    notifications,
    isLoading,
    isFetchingMore,
    hasMore,
    loadNotifications,
    handleNotificationClick,
  } = useNotificationsPage();

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
          <AtSign size={40} className="text-zinc-400" />
        </div>
        <h3 className="text-xl font-bold dark:text-white">
          Sign in to see notifications
        </h3>
        <p className="text-zinc-500 max-w-xs">
          Join the conversation and keep track of who's engaging with your
          content.
        </p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={20} className="text-rose-500 fill-rose-500" />;
      case "follow":
        return <FollowingIcon size={20} className="text-blue-500" />;
      case "mention":
        return <AtSign size={20} className="text-emerald-500" />;
      case "comment":
        return <MessageSquare size={20} className="text-violet-500" />;
      case "repost":
        return <Layers size={20} className="text-amber-500" />;
      default:
        return <AtSign size={20} className="text-zinc-500" />;
    }
  };

  return (
    <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen pb-20 shadow-sm">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
        <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
      </div>

      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleNotificationClick(notif)}
            className={`p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${!notif.is_read ? "bg-violet-50/30 dark:bg-violet-500/5" : ""}`}
          >
            <div className="shrink-0 pt-1">{getIcon(notif.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <Avatar className="size-8">
                  <AvatarImage src={notif.avatar} />
                  <AvatarFallback>
                    {notif.user?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex justify-between items-center">
                  <span className="font-bold text-sm dark:text-white truncate">
                    @{notif.user}
                  </span>
                  <span className="text-zinc-500 text-xs whitespace-nowrap">
                    {formatTimeAgo(notif.created_at)}
                  </span>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-[15px] ml-11">
                {notif.type === "like" && "liked your post"}
                {notif.type === "follow" && "followed you"}
                {notif.type === "mention" && "mentioned you in a post"}
                {notif.type === "comment" && "commented on your post"}
                {notif.type === "repost" && "reposted your post"}
              </p>
            </div>
            {!notif.is_read && (
              <div className="size-2 rounded-full bg-violet-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
            )}
          </div>
        ))
      ) : (
        <div className="p-16 text-center text-zinc-500">
          <p className="font-medium">No notifications yet.</p>
        </div>
      )}

      {notifications.length > 0 && hasMore && (
        <div className="p-6 flex justify-center border-t border-zinc-100 dark:border-zinc-800">
          <Button
            variant="secondary"
            className="w-full max-w-xs"
            onClick={() => loadNotifications(true)}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : null}
            Load more
          </Button>
        </div>
      )}

      {notifications.length > 0 && !hasMore && (
        <div className="p-8 text-center text-zinc-500 text-sm">
          You've caught up with everything!
        </div>
      )}
    </div>
  );
};

export default Notifications;