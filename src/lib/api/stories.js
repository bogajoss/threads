import { supabase } from "@/lib/supabase";
import { transformStory } from "@/lib/transformers";

/**
 * Fetches recent stories.
 */
export const fetchStories = async () => {
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
  return data.map(transformStory);
};

/**
 * Adds a new story.
 */
export const addStory = async (userId, mediaUrl, type = "image") => {
  const { data, error } = await supabase.from("stories").insert([
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
  return transformStory(data[0]);
};
