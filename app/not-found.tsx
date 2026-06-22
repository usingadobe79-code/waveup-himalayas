import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Trail not found",
};

/**
 * Branded 404 — on-brand UI microcopy only (no fabricated business content).
 * Solid header + footer for consistency; routes back home and to /packages.
 */
export default function NotFound() {
  return (
    <>
      <Header solid />
      <main className="flex flex-1 items-center justify-center bg-surface">
        <section className="container-page py-28 text-center md:py-36">
          {/* Gold peak mark — the brand element */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 40"
            className="mx-auto mb-8 h-12 w-28"
            fill="none"
          >
            <path
              d="M10 34 L42 8 L58 24 L74 6 L110 34"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="type-eyebrow mb-4">Error 404</p>
          <h1 className="type-h1 text-ink">Trail not found</h1>
          <p className="type-body-lg mx-auto mt-5 max-w-xl text-muted">
            The page you&rsquo;re looking for isn&rsquo;t on the map. Let&rsquo;s get you
            back on the route.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button href="/" variant="gold" className="w-full sm:w-auto">
              Back home
            </Button>
            <Button href="/packages" variant="outline-dark" className="w-full sm:w-auto">
              Browse all packages
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
