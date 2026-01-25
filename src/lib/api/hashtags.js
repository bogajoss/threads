import { supabase } from "@/lib/supabase";

/**
 * Fetches the most popular hashtags.
 */
export const fetchTrendingHashtags = async (limit = 5) => {
  const { data, error } = await supabase
    .from("hashtags")
    .select("*")
    .order("usage_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
