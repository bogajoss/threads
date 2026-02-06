import { supabase } from "@/lib/supabase";

export interface Hashtag {
  id: string;
  tag: string;
  usage_count: number;
  created_at: string;
}

export const fetchTrendingHashtags = async (
  limit: number = 5,
): Promise<Hashtag[]> => {
  const { data, error } = await supabase
    .from("hashtags")
    .select("*")
    .order("usage_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Hashtag[];
};