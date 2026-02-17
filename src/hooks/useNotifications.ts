import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUnreadNotificationsCount } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types/index";

export const useNotifications = (currentUser: User | null) => {
  const queryClient = useQueryClient();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread_notifications_count", currentUser?.id],
    queryFn: () => fetchUnreadNotificationsCount(currentUser?.id || ""),
    enabled: !!currentUser?.id,
  });

  useEffect(() => {
    if (!currentUser?.id) return;

    let mounted = true;
    const channel = supabase
      .channel(`unread_count:${currentUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${currentUser.id}`,
        },
        () => {
          if (!mounted) return;
          queryClient.invalidateQueries({
            queryKey: ["unread_notifications_count", currentUser.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["notifications", currentUser.id],
          });
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      setTimeout(() => {
        supabase.removeChannel(channel).catch(() => {
          // Silent catch
        });
      }, 500);
    };
  }, [currentUser?.id, queryClient]);

  return { unreadCount };
};
