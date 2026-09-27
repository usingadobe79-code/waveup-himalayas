import type { MetadataRoute } from "next";
import { packages, siteUrl } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";

/**
 * sitemap.xml — home, the packages index, all 25 detail pages, the blog
 * index, and every published post. URLs derive from the real package slugs
 * and the real post slugs (see content.ts / lib/blog.ts); origin from
 * `siteUrl` (see content.ts). lastModified is intentionally omitted (no real
 * per-page change dates to report).
 *
 * URLs carry a trailing slash to match `trailingSlash: true` in next.config.ts —
 * that is the form the export actually serves, so listing the bare path here
 * would point crawlers at a redirect instead of the page itself.
 */
export const dynamic = "force-static"; // required by `output: "export"`

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/packages/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/`, changeFrequency: "monthly", priority: 0.8 },
  ];
  for (const p of packages) {
    routes.push({
      url: `${siteUrl}/packages/${p.slug}/`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  for (const post of getAllPosts()) {
    routes.push({
      url: `${siteUrl}/blog/${post.slug}/`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  return routes;
}
