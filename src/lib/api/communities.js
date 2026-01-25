import { supabase } from "@/lib/supabase";
import { transformPost } from "@/lib/transformers";

/**
 * Transforms a Supabase community object.
 */
export const transformCommunity = (c) => {
  if (!c) return null;
  return {
    id: c.id,
    handle: c.handle,
    name: c.name,
    description: c.description,
    avatar: c.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=community',
    cover: c.cover_url || 'https://systemadminbd.com/uploads/675346dd55e0c7.43939630.png',
    membersCount: c.members_count || 0,
    postsCount: c.posts_count || 0,
    isPrivate: c.is_private,
    createdAt: c.created_at,
    type: 'community'
  };
};

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
