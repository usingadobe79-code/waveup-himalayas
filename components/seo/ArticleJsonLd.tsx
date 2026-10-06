import { business, siteUrl } from "@/lib/content";

type ArticleJsonLdProps = {
  headline: string;
  description: string;
  /** Site-relative cover image path. */
  image: string;
  /** ISO date string, e.g. "2026-09-20". */
  datePublished: string;
  author: string;
  /** Site-relative path, e.g. "/blog/a-complete-guide-to-trekking-in-nepal". */
  path: string;
};

/**
 * BlogPosting structured data for a blog post page. Every field is read
 * straight from the post's own frontmatter — no invented dates/authors.
 * The real brand mark (public/logo/symbol.png, 800×396) is used as the
 * publisher logo.
 */
export function ArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  author,
  path,
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image: `${siteUrl}${image}`,
    datePublished,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#travelagency`,
      name: business.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo/symbol.png`,
        width: 800,
        height: 396,
      },
    },
    mainEntityOfPage: `${siteUrl}${path}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
