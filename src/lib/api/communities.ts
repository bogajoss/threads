import { supabase } from "@/lib/supabase";
import { transformPost, transformCommunity } from "@/lib/transformers";
import type { Community, Post } from "@/types/index";
import { deleteFileFromUrl } from "./storage";

/**
 * Fetches all communities.
 */
export const fetchCommunities = async (lastTimestamp: string | null = null, limit: number = 10): Promise<Community[]> => {
    let query = (supabase.from("communities") as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (lastTimestamp) {
        query = query.lt("created_at", lastTimestamp);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(transformCommunity).filter((c: Community | null): c is Community => c !== null);
};

/**
 * Fetches a single community by handle.
 */
export const fetchCommunityByHandle = async (handle: string): Promise<Community | null> => {
    const { data, error } = await (supabase.from("communities") as any)
        .select("*")
        .eq("handle", handle)
        .single();

    if (error) throw error;
    return transformCommunity(data);
};

/**
 * Fetches posts for a specific community.
 */
export const fetchCommunityPosts = async (
    communityId: string,
    lastTimestamp: string | null = null,
    limit: number = 10,
): Promise<Post[]> => {
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
    return (data || []).map(transformPost).filter((p): p is Post => p !== null);
};

/**
 * Joins or leaves a community.
 */
export const toggleCommunityMembership = async (communityId: string, userId: string): Promise<boolean> => {
    const { data: existing } = await (supabase.from("community_members") as any)
        .select("*")
        .eq("community_id", communityId)
        .eq("user_id", userId)
        .maybeSingle();

    if (existing) {
        const { error } = await (supabase
            .from("community_members") as any)
            .delete()
            .eq("community_id", communityId)
            .eq("user_id", userId);
        if (error) throw error;
        return false;
    } else {
        const { error } = await (supabase
            .from("community_members") as any)
            .insert([{ community_id: communityId, user_id: userId }]);
        if (error) throw error;
        return true;
    }
};

/**
 * Checks if a user is a member of a community and returns their membership data.
 */
export const checkIfMember = async (communityId: string, userId: string): Promise<any> => {
    if (!userId) return null;
    const { data } = await (supabase.from("community_members") as any)
        .select("*")
        .eq("community_id", communityId)
        .eq("user_id", userId)
        .maybeSingle();
    return data; // Returns { community_id, user_id, role, created_at } or null
};

interface CommunityWithRole extends Community {
    myRole: string;
}

/**
 * Fetches all communities a user is a member of, including their role.
 */
export const fetchUserCommunities = async (userId: string): Promise<CommunityWithRole[]> => {
    if (!userId) return [];
    const { data, error } = await (supabase.from("community_members") as any)
        .select(
            `
      role,
      communities (*)
    `,
        )
        .eq("user_id", userId);

    if (error) throw error;
    return (data || []).map((item: any) => ({
        ...transformCommunity(item.communities)!,
        myRole: item.role,
    }));
};

/**
 * Creates a new community.
 */
export const createCommunity = async (communityData: any): Promise<Community | null> => {
    const { data: community, error } = await (supabase.from("communities") as any)
        .insert([communityData])
        .select()
        .single();

    if (error) throw error;

    // Automatically make creator an ADMIN
    const { error: memberError } = await (supabase
        .from("community_members") as any)
        .insert([
            {
                community_id: community.id,
                user_id: communityData.creator_id,
                role: "admin",
            },
        ]);

    if (memberError) throw memberError;

    return transformCommunity(community);
};

/**
 * Updates an existing community.
 */
export const updateCommunity = async (id: string, communityData: any): Promise<Community | null> => {
    // 1. If updating avatar or cover, fetch old ones to delete
    if (communityData.avatar_url || communityData.cover_url) {
        const { data: oldCommunity } = await (supabase.from("communities") as any)
            .select("avatar_url, cover_url")
            .eq("id", id)
            .single() as any;

        if (oldCommunity) {
            // Delete old avatar if it's a Supabase URL and different from new one
            if (communityData.avatar_url && oldCommunity.avatar_url && oldCommunity.avatar_url !== communityData.avatar_url) {
                if (oldCommunity.avatar_url.includes(supabase.storage.from('media').getPublicUrl('').data.publicUrl)) {
                    await deleteFileFromUrl(oldCommunity.avatar_url);
                }
            }
            // Delete old cover if it's a Supabase URL and different from new one
            if (communityData.cover_url && oldCommunity.cover_url && oldCommunity.cover_url !== communityData.cover_url) {
                if (oldCommunity.cover_url.includes(supabase.storage.from('media').getPublicUrl('').data.publicUrl)) {
                    await deleteFileFromUrl(oldCommunity.cover_url);
                }
            }
        }
    }

    const { data, error } = await (supabase.from("communities") as any)
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
export const fetchCommunityMembers = async (communityId: string, searchQuery: string = ""): Promise<any[]> => {
    let query = (supabase.from("community_members") as any)
        .select(
            `
      role,
      user_id,
      users:user_id!inner (
        id,
        username,
        display_name,
        avatar_url,
        is_verified
      )
    `,
        )
        .eq("community_id", communityId);

    if (searchQuery) {
        query = query.or(
            `username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`,
            { foreignTable: "users" },
        );
    }

    const { data, error } = await query.limit(20);

    if (error) throw error;
    return (data || []).map((m: any) => ({
        role: m.role,
        userId: m.user_id,
        user: m.users,
    }));
};

/**
 * Updates a member's role in a community.
 */
export const updateMemberRole = async (communityId: string, userId: string, role: string): Promise<any> => {
    const { data, error } = await (supabase.from("community_members") as any)
        .update({ role })
        .eq("community_id", communityId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
