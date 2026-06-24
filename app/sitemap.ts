import type { MetadataRoute } from "next";
import { getAllPages } from "../lib/pages";
import { SITE_URL } from "../lib/site";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/`,
    changeFrequency: "weekly",
    priority: 1,
  };

  const detailPages = getAllPages().map((page) => ({
    url: `${SITE_URL}/${page.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [home, ...detailPages];
}
