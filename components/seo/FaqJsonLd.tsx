import type { Faq } from "@/lib/content";

/**
 * FAQPage structured data for a package's FAQ section — mirrors the
 * Question/Answer pairs rendered by components/sections/PackageFaq.tsx.
 * Rendered only when the package has supplied faqs.
 */
export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
