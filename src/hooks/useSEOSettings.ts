
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SEOSettings {
  site_title: string;
  site_description: string;
  og_image_url: string;
  twitter_handle: string;
}

export const useSEOSettings = () => {
  return useQuery({
    queryKey: ['seo-settings'],
    queryFn: async (): Promise<SEOSettings> => {
      const { data } = await supabase
        .from('admin_settings')
        .select('key, value')
        .in('key', ['site_title', 'site_description', 'og_image_url', 'twitter_handle']);
      
      const settingsMap: Record<string, string> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });
      
      return {
        site_title: settingsMap.site_title || "Provaa - Meet the Makers, Taste the Passion",
        site_description: settingsMap.site_description || "From natural wine cellars to secret supper clubs. Provaa connects food lovers with unique tastings, workshops, and dining experiences hosted by local experts.",
        og_image_url: settingsMap.og_image_url || "https://lovable.dev/opengraph-image-p98pqg.png",
        twitter_handle: settingsMap.twitter_handle || "@provaa",
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
