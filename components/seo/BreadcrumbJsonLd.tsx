import { siteUrl } from "@/lib/content";

export type BreadcrumbItem = {
  name: string;
  /** Site-relative path, e.g. "/packages/everest-base-camp-trek". */
  path: string;
};

/**
 * BreadcrumbList structured data — mirrors the HTML breadcrumb trail shown on
 * the package/blog detail pages (Home › Packages › <Trek>, Home › Blog ›
 * <Post>). Every `item` is resolved to an absolute URL via siteUrl.
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
