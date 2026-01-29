import { supabase } from "@/lib/supabase";
import { transformStory } from "@/lib/transformers";
import type { Story } from "@/types/index";

/**
 * Fetches recent stories.
 */
export const fetchStories = async (): Promise<Story[]> => {
    const { data, error } = await supabase
        .from("stories")
        .select(
            `
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `,
        )
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(transformStory).filter((s): s is Story => s !== null);
};

/**
 * Adds a new story.
 */
export const addStory = async (userId: string, mediaUrl: string, type: string = "image"): Promise<Story | null> => {
    const { data, error } = await (supabase.from("stories") as any).insert([
        {
            user_id: userId,
            media_url: mediaUrl,
            type,
        },
    ]).select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `);

    if (error) throw error;
    return transformStory(data?.[0]);
};
