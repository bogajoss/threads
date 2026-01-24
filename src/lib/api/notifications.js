import { supabase } from "@/lib/supabase";
import { transformNotification } from "@/lib/transformers";

/**
 * Fetches notifications for the recipient_id with pagination.
 */
export const fetchNotifications = async (userId, lastTimestamp = null, limit = 10) => {
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
  return data.map(transformNotification);
};

/**
 * Marks all notifications as read for a user.
 */
export const markNotificationsAsRead = async (userId) => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("recipient_id", userId)
    .eq("is_read", false);

  if (error) throw error;
};

/**
 * Fetches the count of unread notifications for a user.
 */
export const fetchUnreadNotificationsCount = async (userId) => {
  if (!userId) return 0;
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("is_read", false);

  if (error) throw error;
  return count || 0;
};
