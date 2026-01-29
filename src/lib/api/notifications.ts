import { supabase } from "@/lib/supabase";
import { transformNotification } from "@/lib/transformers";
import type { Notification } from "@/types/index";

/**
 * Fetches notifications for the recipient_id with pagination.
 */
export const fetchNotifications = async (
    userId: string,
    lastTimestamp: string | null = null,
    limit: number = 10,
): Promise<Notification[]> => {
    if (!userId) return [];

    let query = supabase
        .from("notifications")
        .select(
            `
            *,
            actor:users!actor_id (
                username,
                avatar_url
            )
        `,
        )
        .eq("recipient_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (lastTimestamp) {
        query = query.lt("created_at", lastTimestamp);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformNotification).filter((n): n is Notification => n !== null);
};

/**
 * Marks all notifications as read for a user.
 */
export const markNotificationsAsRead = async (userId: string): Promise<void> => {
    const { error } = await (supabase
        .from("notifications") as any)
        .update({ is_read: true })
        .eq("recipient_id", userId)
        .eq("is_read", false);

    if (error) throw error;
};

/**
 * Fetches the count of unread notifications for a user.
 */
export const fetchUnreadNotificationsCount = async (userId: string): Promise<number> => {
    if (!userId) return 0;
    const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", userId)
        .eq("is_read", false);

    if (error) throw error;
    return count || 0;
};
