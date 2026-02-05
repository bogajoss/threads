import { supabase } from "@/lib/supabase";
import { transformUser } from "@/lib/transformers";
import type { User } from "@/types/index";
import { deleteFileFromUrl } from "./storage";

/**
 * Searches for users by username or display name.
 */
export const searchUsers = async (
  query: string,
  limit: number = 10,
): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(limit);

  if (error) throw error;
  return (data || []).map(transformUser).filter((u): u is User => u !== null);
};

/**
 * Fetches all user profiles with pagination.
 */
export const fetchProfiles = async (
  lastTimestamp: string | null = null,
  limit: number = 10,
): Promise<User[]> => {
  let query = supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map(transformUser).filter((u): u is User => u !== null);
};

/**
 * Fetches a user profile by ID or handle.
 */
export const fetchUserProfile = async (
  identifier: string,
  type: "id" | "username" = "id",
): Promise<User | null> => {
  let query = supabase.from("users").select("*");

  if (type === "id") {
    query = query.eq("id", identifier);
  } else {
    query = query.ilike("username", identifier);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data ? transformUser(data) : null;
};

/**
 * Fetches a single profile by handle.
 */
export const fetchProfileByHandle = (handle: string): Promise<User | null> =>
  fetchUserProfile(handle, "username");

/**
 * Updates the user's last seen timestamp.
 */
export const updateLastSeen = async (userId: string): Promise<void> => {
  if (!userId) return;
  const { error } = await (supabase.from("users") as any)
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
};

interface ProfileUpdateFields {
  name?: string;
  handle?: string;
  avatar?: string;
  bio?: string;
  cover?: string;
  website?: string;
  location?: string;
}

/**
 * Updates a user profile.
 */
export const updateProfile = async (
  userId: string,
  fields: ProfileUpdateFields,
): Promise<void> => {
  // 1. If updating avatar or cover, fetch old ones to delete
  if (fields.avatar || fields.cover) {
    const { data: oldProfile } = await (supabase
      .from("users")
      .select("avatar_url, cover_url")
      .eq("id", userId)
      .single() as any);

    if (oldProfile) {
      // Delete old avatar if it's a Supabase URL and different from new one
      if (
        fields.avatar &&
        oldProfile.avatar_url &&
        oldProfile.avatar_url !== fields.avatar
      ) {
        if (
          oldProfile.avatar_url.includes(
            supabase.storage.from("media").getPublicUrl("").data.publicUrl,
          )
        ) {
          await deleteFileFromUrl(oldProfile.avatar_url);
        }
      }
      // Delete old cover if it's a Supabase URL and different from new one
      if (
        fields.cover &&
        oldProfile.cover_url &&
        oldProfile.cover_url !== fields.cover
      ) {
        if (
          oldProfile.cover_url.includes(
            supabase.storage.from("media").getPublicUrl("").data.publicUrl,
          )
        ) {
          await deleteFileFromUrl(oldProfile.cover_url);
        }
      }
    }
  }

  const dbFields: any = {
    display_name: fields.name,
    username: fields.handle,
    avatar_url: fields.avatar,
    bio: fields.bio,
    cover_url: fields.cover,
    website: fields.website,
    location: fields.location,
  };

  // Remove undefined fields
  Object.keys(dbFields).forEach(
    (key) => dbFields[key] === undefined && delete dbFields[key],
  );

  const { error } = await (supabase.from("users") as any)
    .update(dbFields)
    .eq("id", userId);

  if (error) throw error;
};

/**
 * Toggles a follow on a user.
 */
export const toggleFollow = async (
  followerId: string,
  followingId: string,
): Promise<boolean> => {
  const { data: existingFollow } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  if (existingFollow) {
    await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);
    return false;
  } else {
    await (supabase.from("follows") as any).insert([
      { follower_id: followerId, following_id: followingId },
    ]);
    return true;
  }
};

/**
 * Checks if a user is following another user.
 */
export const checkIfFollowing = async (
  followerId: string,
  followingId: string,
): Promise<boolean> => {
  if (!followerId) return false;
  const { data } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();
  return !!data;
};

interface UserWithFollowDate extends User {
  followed_at: string;
}

/**
 * Fetches followers of a user with pagination.
 */
export const fetchFollowers = async (
  userId: string,
  lastTimestamp: string | null = null,
  limit: number = 10,
): Promise<UserWithFollowDate[]> => {
  let query = supabase
    .from("follows")
    .select(
      `
      created_at,
      user:users!follower_id (
        id,
        username,
        display_name,
        avatar_url,
        is_verified,
        bio
      )
    `,
    )
    .eq("following_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map((item: any) => ({
    ...transformUser(item.user)!,
    followed_at: item.created_at,
  }));
};

/**
 * Fetches users followed by a user with pagination.
 */
export const fetchFollowing = async (
  userId: string,
  lastTimestamp: string | null = null,
  limit: number = 10,
): Promise<UserWithFollowDate[]> => {
  let query = supabase
    .from("follows")
    .select(
      `
      created_at,
      user:users!following_id (
        id,
        username,
        display_name,
        avatar_url,
        is_verified,
        bio
      )
    `,
    )
    .eq("follower_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map((item: any) => ({
    ...transformUser(item.user)!,
    followed_at: item.created_at,
  }));
};

/**
 * Fetches follow stats.
 */
export const fetchFollowStats = async (
  userId: string,
): Promise<{ followers: number; following: number }> => {
  const { data, error } = await (supabase.from("users") as any)
    .select("follower_count, following_count")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return { followers: 0, following: 0 };
  return {
    followers: (data as any).follower_count || 0,
    following: (data as any).following_count || 0,
  };
};
