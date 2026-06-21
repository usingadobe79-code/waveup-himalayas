import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroRise } from "@/components/sections/HeroRise";
import { Services } from "@/components/sections/Services";
import { FeaturedPackages } from "@/components/sections/FeaturedPackages";
import { Offers } from "@/components/sections/Offers";

/**
 * Landing page composition.
 * Header → HeroRise (hero that scroll-scrubs into the rise) → Services →
 * FeaturedPackages → [offers → regions → why-us → gallery → testimonials → CTA]
 * → Footer.
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
      </main>
      <Footer />
    </>
  );
}
