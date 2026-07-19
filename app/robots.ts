import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

/**
 * Required by `output: "export"` — without it the build fails, since Next has
 * to know this route can be rendered once at build time rather than per request.
 */
export const dynamic = "force-static";

/** robots.txt — allow full crawl and point at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
