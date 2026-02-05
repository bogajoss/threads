import { supabase } from "@/lib/supabase";
import { getLinkPreview as scrapePreview } from "@/lib/utils/link-preview";

export interface LinkPreviewData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  url: string;
}

/**
 * Fetches link preview data from database cache or scrapes it if missing.
 */
export const getCachedLinkPreview = async (
  url: string | null,
): Promise<LinkPreviewData | null> => {
  if (!url) return null;

  try {
    // 1. Try to get from database cache
    const { data: cachedData } = await (supabase.from("link_previews") as any)
      .select("*")
      .eq("url", url)
      .maybeSingle();

    if (cachedData) {
      // Background update of last_used_at
      (supabase.from("link_previews") as any)
        .update({ last_used_at: new Date().toISOString() })
        .eq("url", url)
        .then(() => {});

      return {
        title: (cachedData as any).title,
        description: (cachedData as any).description,
        image: (cachedData as any).image,
        siteName: (cachedData as any).site_name,
        url: (cachedData as any).url,
      };
    }

    // 2. If not in cache, scrape it
    const scrapedData = await scrapePreview(url);
    if (!scrapedData) return null;

    // 3. Save to database cache for next time
    // We do this asynchronously (don't wait for it) to keep the UI snappy
    (supabase.from("link_previews") as any)
      .insert([
        {
          url: scrapedData.url,
          title: scrapedData.title,
          description: scrapedData.description,
          image: scrapedData.image,
          site_name: scrapedData.siteName,
        },
      ])
      .then(({ error }: { error: any }) => {
        if (error) console.error("Cache save error:", error);
      });

    return scrapedData;
  } catch (error) {
    console.error("Link preview cache error:", error);
    return null;
  }
};
