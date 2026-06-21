import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PackageImage } from "@/components/ui/PackageImage";
import { regions, totalPackages, priceLabel } from "@/lib/content";

export const metadata: Metadata = {
  title: "All Packages — WaveUp Himalayas",
  description:
    "Browse all of WaveUp Himalayas' treks, tours, helicopter adventures and experiences across the Nepal Himalayas. Every trip is fully customizable.",
};

export default function PackagesIndexPage() {
  return (
    <>
      <Header solid />
      <main className="flex-1">
        {/* Intro band — dark, so the solid navy header sits cleanly on top */}
        <section className="bg-surface-dark pb-16 pt-28 text-on-dark md:pb-20 md:pt-32">
          <div className="container-page">
            <nav aria-label="Breadcrumb" className="type-small mb-5 text-on-dark/70">
              <Link href="/" className="transition-colors hover:text-on-dark">
                Home
              </Link>
              <span className="px-2 text-on-dark/40">/</span>
              <span className="text-on-dark/90">Packages</span>
            </nav>
            <p className="type-eyebrow mb-4">Every Trip We Run</p>
            <h1 className="type-h1 max-w-3xl text-on-dark">All Packages</h1>
            <p className="type-body-lg mt-5 max-w-2xl text-on-dark/75">
              {totalPackages} journeys across the Nepal Himalayas — treks, tours, helicopter
              adventures and experiences. Every trip is fully customizable; prices are shared
              on enquiry.
            </p>
          </div>
        </section>

        {/* All packages, grouped by region */}
        <section className="section-y bg-surface">
          <div className="container-page space-y-16 md:space-y-20">
            {regions.map((region) => (
              <div key={region.key}>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="type-h3 text-ink">{region.label}</h2>
                  <span className="type-small shrink-0 text-muted">
                    {region.packages.length}{" "}
                    {region.packages.length === 1 ? "trip" : "trips"}
                  </span>
                </div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {region.packages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/packages/${p.slug}`}
                      className="card card-hover group flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <PackageImage
                          src={p.image}
                          alt={p.title}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-darker/55 to-transparent" />
                        <span className="type-small absolute left-4 top-4 rounded-badge bg-surface-darker/70 px-3 py-1 font-medium text-accent-hover backdrop-blur-sm">
                          {p.region}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="type-h3 text-ink">{p.title}</h3>
                        {p.blurb && (
                          <p className="type-small mt-2 flex-1 text-muted">{p.blurb}</p>
                        )}
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="type-small font-medium text-muted">
                            {priceLabel(p.price)}
                          </span>
                          <span className="type-small inline-flex items-center gap-1.5 font-semibold text-accent">
                            View Details
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
