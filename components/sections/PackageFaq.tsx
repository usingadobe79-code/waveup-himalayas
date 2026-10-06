import type { Faq } from "@/lib/content";

/**
 * FAQ accordion for a package's detail page — plain `<details>/<summary>`,
 * so it needs no JS and works unchanged in the static export. Rendered only
 * when the package has supplied faqs; pair with FaqJsonLd for the matching
 * FAQPage structured data.
 */
export function PackageFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mt-5 space-y-3">
      {faqs.map((faq, i) => (
        <details
          key={i}
          className="rounded-card border border-border bg-surface-alt p-5"
        >
          <summary className="type-body cursor-pointer font-semibold text-ink marker:text-accent">
            {faq.question}
          </summary>
          <p className="type-small mt-3 text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
