import { supabase } from "@/lib/supabase";
import { transformUser, transformPost } from "@/lib/transformers";

export const adminApi = {
  // User Management
  async getAllUsers(limit = 50) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(transformUser);
  },

  async updateUserRole(userId: string, role: "user" | "admin" | "moderator") {
    if (role === "user") {
      // Remove from admins table — sync_admin_role trigger auto-sets users.role = 'user'
      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;
    } else {
      // Upsert into admins table — sync_admin_role trigger auto-sets users.role
      const { error } = await supabase.from("admins").upsert({
        user_id: userId,
        role: role,
      });
      if (error) throw error;
    }
  },

  async toggleUserVerification(userId: string, isVerified: boolean) {
    const { error } = await (supabase.from("users") as any)
      .update({ is_verified: isVerified })
      .eq("id", userId);
    if (error) throw error;
  },

  async toggleUserBan(userId: string, isBanned: boolean) {
    const { error } = await (supabase as any).rpc("toggle_user_ban", {
      target_user_id: userId,
      ban_status: isBanned,
    });
    if (error) throw error;
  },

  // Content Moderation
  async getLatestPosts(limit = 50) {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user:users(*)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;

    return (data || []).map((post: any) =>
      transformPost({
        ...post,
        author_data: post.user,
      }),
    );
  },

  async deletePost(postId: string) {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) throw error;
  },

  // System Stats
  async getSystemStats() {
    const [users, posts, communities] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("communities").select("id", { count: "exact", head: true }),
    ]);

    return {
      totalUsers: users.count || 0,
      totalPosts: posts.count || 0,
      totalCommunities: communities.count || 0,
    };
  },

  // Reports Management
  async getReports(limit = 50) {
    const { data, error } = await supabase
      .from("reports")
      .select("*, reporter:users!reporter_id(*)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async updateReportStatus(
    reportId: string,
    status: "pending" | "resolved" | "dismissed",
  ) {
    const { error } = await (supabase.from("reports") as any)
      .update({ status })
      .eq("id", reportId);
    if (error) throw error;
  },

  async deleteReportTarget(targetType: string, targetId: string) {
    if (targetType === "user") {
      return this.toggleUserBan(targetId, true);
    }

    let table = "posts";
    if (targetType === "community") table = "communities";

    // Explicitly cast to any to bypass strict type check for dynamic table name
    // The previous error was because 'string' type of 'table' variable
    // doesn't match the specific string literals expected by supabase.from()
    const { error } = await (supabase.from(table as any) as any)
      .delete()
      .eq("id", targetId);
    if (error) throw error;
  },

  // Analytics
  async getAnalytics() {
    const { data: usersData } = await supabase
      .from("users")
      .select("created_at");
    const { data: postsData } = await supabase
      .from("posts")
      .select("created_at");

    return {
      usersByDay: usersData || [],
      postsByDay: postsData || [],
    };
  },

  // System Settings
  async getSettings() {
    const { data, error } = await supabase
      .from("system_settings" as any)
      .select("*")
      .single();
    if (error) return { maintenance_mode: false, allow_signups: true };
    return data;
  },

  async updateSettings(settings: any) {
    const { error } = await (
      supabase.from("system_settings" as any) as any
    ).upsert(settings);
    if (error) throw error;
  },
};
