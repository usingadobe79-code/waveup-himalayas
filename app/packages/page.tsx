import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PackagesBrowser } from "@/components/sections/PackagesBrowser";
import { totalPackages } from "@/lib/content";

const PACKAGES_DESC =
  "Browse all of WaveUp Himalayas' treks, tours, helicopter adventures and experiences across the Nepal Himalayas. Every trip is fully customizable.";

export const metadata: Metadata = {
  // Title template in the root layout appends " — WaveUp Himalayas".
  title: "All Packages",
  description: PACKAGES_DESC,
  alternates: { canonical: "/packages" },
  openGraph: {
    type: "website",
    siteName: "WaveUp Himalayas",
    url: "/packages",
    title: "All Packages — WaveUp Himalayas",
    description: PACKAGES_DESC,
    images: [{ url: "/images/hero.jpg", alt: "WaveUp Himalayas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Packages — WaveUp Himalayas",
    description: PACKAGES_DESC,
    images: ["/images/hero.jpg"],
  },
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
            <p className="type-eyebrow mb-4 text-accent">Every Trip We Run</p>
            <h1 className="type-h1 max-w-3xl text-on-dark">All Packages</h1>
            <p className="type-body-lg mt-5 max-w-2xl text-on-dark/75">
              {totalPackages} journeys across the Nepal Himalayas — treks, tours, helicopter
              adventures and experiences. Every trip is fully customizable; prices are shared
              on enquiry.
            </p>
          </div>
        </section>

        {/* All packages, filterable by service, grouped by region */}
        <PackagesBrowser />
      </main>
      <Footer />
    </>
  );
}
