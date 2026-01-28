import { supabase } from "@/lib/supabase";
import { transformPost, transformCommunity } from "@/lib/transformers";

/**
 * Fetches all communities.
 */
export const fetchCommunities = async (lastTimestamp = null, limit = 10) => {
  let query = supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data.map(transformCommunity);
};

/**
 * Fetches a single community by handle.
 */
export const fetchCommunityByHandle = async (handle) => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("handle", handle)
    .single();

  if (error) throw error;
  return transformCommunity(data);
};

/**
 * Fetches posts for a specific community.
 */
export const fetchCommunityPosts = async (communityId, lastTimestamp = null, limit = 10) => {
  let query = supabase
    .from("unified_posts")
    .select("*")
    .eq("community_id", communityId)
    .is("reposter_id", null)
    .order("sort_timestamp", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("sort_timestamp", lastTimestamp);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data.map(transformPost);
};

/**
 * Joins or leaves a community.
 */
export const toggleCommunityMembership = async (communityId, userId) => {
  const { data: existing } = await supabase
    .from("community_members")
    .select("*")
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", userId);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("community_members")
      .insert([{ community_id: communityId, user_id: userId }]);
    if (error) throw error;
    return true;
  }
};

/**
 * Checks if a user is a member of a community and returns their membership data.
 */
export const checkIfMember = async (communityId, userId) => {
  if (!userId) return null;
  const { data } = await supabase
    .from("community_members")
    .select("*")
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .maybeSingle();
  return data; // Returns { community_id, user_id, role, created_at } or null
};

/**
 * Fetches all communities a user is a member of, including their role.
 */
export const fetchUserCommunities = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("community_members")
    .select(`
      role,
      communities (*)
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return data.map(item => ({
    ...transformCommunity(item.communities),
    myRole: item.role
  }));
};

/**
 * Creates a new community.
 */
export const createCommunity = async (communityData) => {
  const { data, error } = await supabase
    .from("communities")
    .insert([communityData])
    .select()
    .single();

  if (error) throw error;
  return transformCommunity(data);
};

/**
 * Updates an existing community.
 */
export const updateCommunity = async (id, communityData) => {
  const { data, error } = await supabase
    .from("communities")
    .update(communityData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return transformCommunity(data);
};

/**
 * Fetches members of a community with user details.
 */
export const fetchCommunityMembers = async (communityId, searchQuery = "") => {
  let query = supabase
    .from("community_members")
    .select(`
      role,
      user_id,
      users:user_id!inner (
        id,
        username,
        display_name,
        avatar_url,
        is_verified
      )
    `)
    .eq("community_id", communityId);

  if (searchQuery) {
    query = query.or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`, { foreignTable: 'users' });
  }

  const { data, error } = await query.limit(20);

  if (error) throw error;
  return data.map(m => ({
    role: m.role,
    userId: m.user_id,
    user: m.users
  }));
};

/**
 * Updates a member's role in a community.
 */
export const updateMemberRole = async (communityId, userId, role) => {
  const { data, error } = await supabase
    .from("community_members")
    .update({ role })
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
