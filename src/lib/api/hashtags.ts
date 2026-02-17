import { supabase } from "@/lib/supabase";

export interface Hashtag {
  id: string;
  tag: string;
  usage_count: number;
}

export const fetchTrendingHashtags = async (
  limit: number = 5,
): Promise<Hashtag[]> => {
  // Try materialized view first (trending = last 24h), fall back to hashtags table
  const { data, error } = await (supabase
    .from("trending_hashtags" as any) as any)
    .select("*")
    .limit(limit);

  if (error || !data || data.length === 0) {
    // Fallback to the full hashtags table if materialized view is empty or not refreshed
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("hashtags")
      .select("*")
      .order("usage_count", { ascending: false })
      .limit(limit);

    if (fallbackError) throw fallbackError;
    return (fallbackData || []).map((h: any) => ({
      id: h.id || h.name,
      tag: h.name,
      usage_count: h.usage_count || 0,
    }));
  }

  return (data || []).map((h: any) => ({
    id: h.name,  // materialized view has no id column, use name
    tag: h.name,
    usage_count: h.usage_count || 0,
  }));
};
