import { supabase } from "@/lib/supabase";
import { transformUser } from "@/lib/transformers";

/**
 * Searches for users by username or display name.
 */
export const searchUsers = async (query, limit = 10) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(limit);

  if (error) throw error;
  return data.map(transformUser);
};

/**
 * Fetches all user profiles with pagination.
 */
export const fetchProfiles = async (lastTimestamp = null, limit = 10) => {
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

  return data.map(transformUser);
};

/**
 * Fetches a user profile by ID or handle.
 */
export const fetchUserProfile = async (identifier, type = "id") => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq(type === "id" ? "id" : "username", identifier)
    .maybeSingle();

  if (error) throw error;
  return data ? transformUser(data) : null;
};

/**
 * Fetches a single profile by handle.
 */
export const fetchProfileByHandle = (handle) => fetchUserProfile(handle, "username");

/**
 * Updates the user's last seen timestamp.
 */
export const updateLastSeen = async (userId) => {
  if (!userId) return;
  const { error } = await supabase
    .from("users")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) console.error("Error updating last seen:", error);
};

/**
 * Updates a user profile.
 */
export const updateProfile = async (userId, fields) => {
  const dbFields = {
    display_name: fields.name,
    username: fields.handle,
    avatar_url: fields.avatar,
    bio: fields.bio,
    cover_url: fields.cover,
    website: fields.website,
    location: fields.location,
  };

  Object.keys(dbFields).forEach(key => dbFields[key] === undefined && delete dbFields[key]);

  const { error } = await supabase
    .from("users")
    .update(dbFields)
    .eq("id", userId);

  if (error) throw error;
};

/**
 * Toggles a follow on a user.
 */
export const toggleFollow = async (followerId, followingId) => {
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
    await supabase
      .from("follows")
      .insert([{ follower_id: followerId, following_id: followingId }]);
    return true;
  }
};

/**
 * Checks if a user is following another user.
 */
export const checkIfFollowing = async (followerId, followingId) => {
  if (!followerId) return false;
  const { data } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();
  return !!data;
};

/**
 * Fetches followers of a user with pagination.
 */
export const fetchFollowers = async (userId, lastTimestamp = null, limit = 10) => {
  let query = supabase
    .from("follows")
    .select(`
      created_at,
      user:users!follower_id (
        id,
        username,
        display_name,
        avatar_url,
        is_verified,
        bio
      )
    `)
    .eq("following_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.map((item) => ({
    ...transformUser(item.user),
    followed_at: item.created_at
  }));
};

/**
 * Fetches users followed by a user with pagination.
 */
export const fetchFollowing = async (userId, lastTimestamp = null, limit = 10) => {
  let query = supabase
    .from("follows")
    .select(`
      created_at,
      user:users!following_id (
        id,
        username,
        display_name,
        avatar_url,
        is_verified,
        bio
      )
    `)
    .eq("follower_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.map((item) => ({
    ...transformUser(item.user),
    followed_at: item.created_at
  }));
};

/**
 * Fetches follow stats.
 */
export const fetchFollowStats = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("follower_count, following_count")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return { followers: 0, following: 0 };
  return {
    followers: data.follower_count || 0,
    following: data.following_count || 0,
  };
};
