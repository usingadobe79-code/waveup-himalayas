import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroRise } from "@/components/sections/HeroRise";
import { Services } from "@/components/sections/Services";
import { FeaturedPackages } from "@/components/sections/FeaturedPackages";
import { Offers } from "@/components/sections/Offers";
import { Regions } from "@/components/sections/Regions";
import { WhyUs } from "@/components/sections/WhyUs";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { business } from "@/lib/content";

// Keyword-targeted title/description for the landing page (the root layout's
// default is a brand tagline, not search-targeted). NOTE: `title.template`
// from app/layout.tsx does NOT apply here — this page.tsx is the *same*
// route segment as that root layout, and per Next.js docs a layout's
// template never applies to a title in a page.js of the same segment (it
// only augments child segments, which is why /packages/[slug] and
// /blog/[slug] do get the " — WaveUp Himalayas" suffix). So the brand name
// is spelled out once here via `absolute`, matching every other page's single
// brand mention. openGraph is restated in full (Next.js replaces, not
// merges, a segment's openGraph object) so the existing hero OG image is kept.
const title = "Nepal Trekking Tours — Everest, Annapurna & Manaslu — WaveUp Himalayas";
const description =
  "Guided treks, tours and helicopter adventures across Nepal — Everest Base Camp, Annapurna, Manaslu, Langtang and more. Local experts, tailored departures.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    type: "website",
    siteName: business.name,
    url: "/",
    title,
    description,
    locale: "en_US",
    images: [{ url: "/images/hero.jpg", alt: `${business.name} — Rise Above the Ordinary` }],
  },
};

/**
 * Landing page composition.
 * Header → HeroRise (hero that scroll-scrubs into the rise) → Services →
 * FeaturedPackages → Offers → Regions → [why-us → gallery → testimonials]
 * → EnquiryForm (the closing "Plan Your Trip" contact moment) → Footer.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="flex-1">
        <HeroRise />
        <Services />
        <FeaturedPackages />
        <Offers />
        <Regions />
        <WhyUs />
        <Gallery />
        <Testimonials />
        <EnquiryForm />
      </main>
      <Footer />
    </>
  );
}
