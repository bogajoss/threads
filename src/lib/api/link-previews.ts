import { supabase } from "@/lib/supabase";
import { getLinkPreview as scrapePreview } from "@/lib/utils/link-preview";

export interface LinkPreviewData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  url: string;
}

export const getCachedLinkPreview = async (
  url: string | null,
): Promise<LinkPreviewData | null> => {
  if (!url) return null;

  try {
    const { data: cachedData } = await (supabase.from("link_previews") as any)
      .select("*")
      .eq("url", url)
      .maybeSingle();

    if (cachedData) {
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

    const scrapedData = await scrapePreview(url);
    if (!scrapedData) return null;

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