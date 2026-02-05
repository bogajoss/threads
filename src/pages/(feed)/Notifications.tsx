import React from "react";
import { Heart, AtSign, Layers, Loader2, MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { FollowingIcon } from "@/components/ui/custom-icons";
// @ts-ignore
import { useNotificationsPage } from "@/hooks";
import type { Notification } from "@/types";
// @ts-ignore
import { PullToRefresh } from "@/components/ui";

const Notifications: React.FC = () => {
  const {
    notifications,
    isLoading,
    isFetchingMore,
    hasMore,
    loadNotifications,
    refreshNotifications,
    handleNotificationClick,
  } = useNotificationsPage();

  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 fill-red-500 text-red-500" />;
      case "mention":
        return <AtSign className="h-4 w-4 text-violet-500" />;
      case "repost":
        return <Layers className="h-4 w-4 text-green-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "follow":
        return <FollowingIcon className="h-4 w-4 text-zinc-500" />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notif: Notification) => {
    switch (notif.type) {
      case "like":
        return "liked your post";
      case "mention":
        return "mentioned you in a post";
      case "repost":
        return "reposted your post";
      case "comment":
        return "replied to your post";
      case "follow":
        return "started following you";
      default:
        return "interacted with you";
    }
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden rounded-none border-y border-zinc-100 bg-white pb-20 shadow-sm dark:bg-black dark:border-zinc-800 md:rounded-xl md:border">
      <PullToRefresh onRefresh={async () => await refreshNotifications()}>
        <div className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 p-4 backdrop-blur-md dark:bg-black/80 dark:border-zinc-800">
          <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
        </div>

        {notifications.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {notifications.map((notif: Notification) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex cursor-pointer gap-4 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${
                  !notif.is_read ? "bg-violet-50/30 dark:bg-violet-900/10" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border border-zinc-100 dark:border-zinc-800">
                    <AvatarImage src={notif.avatar} />
                    <AvatarFallback>
                      {notif.user?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-sm dark:bg-zinc-900">
                    {renderNotificationIcon(notif.type)}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm dark:text-zinc-100">
                      <span className="font-bold">@{notif.user}</span>{" "}
                      {renderNotificationContent(notif)}
                    </div>
                    <span className="text-xs text-zinc-500">
                      {formatTimeAgo(notif.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-zinc-500">
            <p className="font-medium">No notifications yet.</p>
          </div>
        )}

        {notifications.length > 0 && hasMore && (
          <div className="flex justify-center p-4">
            <Button
              variant="ghost"
              onClick={() => loadNotifications()}
              disabled={isFetchingMore}
              className="text-sm"
            >
              {isFetchingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load more"
              )}
            </Button>
          </div>
        )}

        {notifications.length > 0 && !hasMore && (
          <div className="p-8 text-center text-sm text-zinc-500">
            You've caught up with everything!
          </div>
        )}
      </PullToRefresh>
    </div>
  );
};

export default Notifications;
