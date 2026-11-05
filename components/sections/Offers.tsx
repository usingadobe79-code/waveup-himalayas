import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { offers, offersSection, whatsappEnquiry } from "@/lib/content";

/**
 * Offers — 2 promo cards (docs/01 §6). The cards slide in from opposite sides;
 * Navy section so the gold offers pop. Reduced
 * motion → instant opacity, no slide, no overshoot.
 */

export function Offers() {
  // overflow-x-clip on the section: the Reveal cards start offset ±64px; while this
  // section is still below the fold that pre-state would push page-level
  // horizontal scroll. Clipping X (not hidden — keeps Y/sticky/Lenis intact)
  // contains it without changing the visible result.
  return (
    <section
      id="offers"
      className="section-y overflow-x-clip bg-surface-dark text-on-dark"
    >
      <div className="container-page">
        <SectionHeading
          onDark
          eyebrow={offersSection.eyebrow}
          title={offersSection.title}
          intro={offersSection.intro}
        />

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          {offers.map((offer, i) => {
            const fromLeft = i === 0;
            return (
              <Reveal
                key={offer.title}
                className={fromLeft ? "reveal-left" : "reveal-right"}
              >
                <article className="group relative overflow-hidden rounded-card border border-on-dark/10 bg-gradient-to-br from-on-dark/[0.08] to-on-dark/[0.02] p-8 backdrop-blur-sm transition-transform duration-[400ms] ease-[var(--ease-out-expo)] hover:-translate-y-1 sm:p-10">
                  {/* Soft gold corner glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
                  />

                  <div className="relative flex h-full flex-col items-start">
                    {offer.imageDisplay && (
                      <div className="relative mb-6 h-40 w-full overflow-hidden rounded-xl">
                        <Image
                          src={offer.imageDisplay}
                          alt={offer.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <span className="type-h2 inline-flex items-baseline gap-1 rounded-badge bg-accent px-4 py-2 font-semibold text-surface-darker shadow-[0_8px_24px_-8px_rgba(184,146,62,0.6)]">
                      {offer.badge}
                      <span className="type-small font-medium">off</span>
                    </span>

                    <h3 className="type-h3 mt-6 text-on-dark">{offer.title}</h3>
                    <p className="type-body mt-3 flex-1 text-on-dark/65">
                      {offer.detail}
                    </p>
                    {offer.validUntil && (
                      <p className="type-small mt-2 text-on-dark/50">
                        {offer.validUntil}
                      </p>
                    )}

                    <Button
                      href={offer.customUrl || whatsappEnquiry(offer.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="gold"
                      className="mt-8"
                      /**
                       * Every offer's button reads the same buttonText (default
                       * "Claim This Offer"), so anyone navigating by link —
                       * screen reader users especially — hears the same phrase
                       * repeatedly with no way to tell which offer is which. The
                       * visible label stays short; the accessible name names the
                       * offer.
                       */
                      aria-label={`${offer.buttonText} — ${offer.title}`}
                    >
                      {offer.buttonText}
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
