import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

/** robots.txt — allow full crawl and point at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
