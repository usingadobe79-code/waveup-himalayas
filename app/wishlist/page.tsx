import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WishlistSection } from "@/components/sections/WishlistSection";
import { business } from "@/lib/content";

const WISHLIST_DESC =
  "The treks and tours you've saved on this device — pick up right where you left off.";

// A server component (metadata needs one) that renders the "use client"
// WishlistSection for the actual localStorage-backed list — see
// lib/useWishlist.ts. Personal, device-only content, so it's kept out of
// search results rather than competing with the real package pages.
export const metadata: Metadata = {
  title: "Saved Treks",
  description: WISHLIST_DESC,
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    siteName: business.name,
    url: "/wishlist",
    title: `Saved Treks — ${business.name}`,
    description: WISHLIST_DESC,
    images: [{ url: "/images/hero.jpg", alt: business.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Saved Treks — ${business.name}`,
    description: WISHLIST_DESC,
    images: ["/images/hero.jpg"],
  },
};

export default function WishlistPage() {
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
              <span className="text-on-dark/90">Saved Treks</span>
            </nav>
            <p className="type-eyebrow mb-4 text-accent">Your Wishlist</p>
            <h1 className="type-h1 max-w-3xl text-on-dark">Saved Treks</h1>
            <p className="type-body-lg mt-5 max-w-2xl text-on-dark/75">
              Every trek you&rsquo;ve tapped the heart on, kept right here on this device.
            </p>
          </div>
        </section>

        <WishlistSection />
      </main>
      <Footer />
    </>
  );
}
