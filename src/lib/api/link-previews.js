import { supabase } from "@/lib/supabase";
import { getLinkPreview as scrapePreview } from "@/lib/utils/link-preview";

/**
 * Fetches link preview data from database cache or scrapes it if missing.
 */
export const getCachedLinkPreview = async (url) => {
  if (!url) return null;

  try {
    // 1. Try to get from database cache
    const { data: cachedData } = await supabase
      .from("link_previews")
      .select("*")
      .eq("url", url)
      .maybeSingle();

    if (cachedData) {
      // Background update of last_used_at
      supabase
        .from("link_previews")
        .update({ last_used_at: new Date().toISOString() })
        .eq("url", url)
        .then(() => {});

      return {
        title: cachedData.title,
        description: cachedData.description,
        image: cachedData.image,
        siteName: cachedData.site_name,
        url: cachedData.url
      };
    }

    // 2. If not in cache, scrape it
    const scrapedData = await scrapePreview(url);
    if (!scrapedData) return null;

    // 3. Save to database cache for next time
    // We do this asynchronously (don't wait for it) to keep the UI snappy
    supabase
      .from("link_previews")
      .insert([{
        url: scrapedData.url,
        title: scrapedData.title,
        description: scrapedData.description,
        image: scrapedData.image,
        site_name: scrapedData.siteName
      }])
      .then(({ error }) => {
        if (error) console.error("Cache save error:", error);
      });

    return scrapedData;
  } catch (error) {
    console.error("Link preview cache error:", error);
    return null;
  }
};
