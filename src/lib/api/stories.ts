import { supabase } from "@/lib/supabase";
import { transformStory } from "@/lib/transformers";
import type { Story } from "@/types/index";

export const fetchRandomStories = async (limit: number = 9): Promise<Story[]> => {
  const { data, error } = await (supabase.rpc as any)("get_random_stories", {
    limit_count: limit,
  });

  if (error) {
    console.error("Error fetching random stories:", error);
    throw error;
  }

  return (data || [])
    .map((story: any) =>
      transformStory({
        ...story,
        user: story.user_data,
      }),
    )
    .filter((s: Story | null): s is Story => s !== null);
};

export const fetchStories = async (
  lastTimestamp: string | null = null,
  limit: number = 10,
): Promise<Story[]> => {
  let query = supabase
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
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map(transformStory).filter((s: Story | null): s is Story => s !== null);
};

export const addStory = async (
  userId: string,
  mediaUrl: string,
  type: string = "image",
  content?: string,
): Promise<Story | null> => {
  const { data, error } = await (supabase.from("stories") as any).insert([
    {
      user_id: userId,
      media_url: mediaUrl,
      type,
      content,
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

export const incrementStoryViews = async (storyId: string) => {
  const { data, error } = await (supabase.rpc as any)("increment_story_views", {
    s_id: storyId,
  });

  if (error) {
    console.error("RPC increment_story_views failed:", error);
    return null;
  }
  return data;
};
