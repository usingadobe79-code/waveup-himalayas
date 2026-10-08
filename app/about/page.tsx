import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { OurTeam } from "@/components/sections/OurTeam";
import { getAbout } from "@/lib/about";
import { getTeam } from "@/lib/team";

const ABOUT_DESC =
  "WaveUp Himalayas is a locally-owned trekking and travel agency based in Thamel, Kathmandu — treks, tours and helicopter trips across the Nepal Himalayas, run by local guides.";

export const metadata: Metadata = {
  // Title template in the root layout appends " — WaveUp Himalayas".
  title: "About WaveUp Himalayas",
  description: ABOUT_DESC,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    siteName: "WaveUp Himalayas",
    url: "/about",
    title: "About WaveUp Himalayas",
    description: ABOUT_DESC,
    images: [{ url: "/images/hero.jpg", alt: "WaveUp Himalayas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About WaveUp Himalayas",
    description: ABOUT_DESC,
    images: ["/images/hero.jpg"],
  },
};

export default function AboutPage() {
  const about = getAbout();
  const team = getTeam();

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
              <span className="text-on-dark/90">About</span>
            </nav>
            {about.eyebrow && <p className="type-eyebrow mb-4 text-accent">{about.eyebrow}</p>}
            <h1 className="type-h1 max-w-3xl text-on-dark">{about.title}</h1>
          </div>
        </section>

        {/* Company intro + mission */}
        <section className="section-y bg-surface">
          <div className="container-page">
            {about.introHtml && (
              <div className="prose-blog mx-auto max-w-[68ch]">
                <div dangerouslySetInnerHTML={{ __html: about.introHtml }} />
              </div>
            )}

            {about.mission.length > 0 && (
              <div className="mx-auto mt-16 grid max-w-5xl gap-10 border-t border-border pt-14 sm:grid-cols-3 md:mt-20">
                {about.mission.map((point, i) => (
                  <div key={point.title}>
                    <span className="type-eyebrow text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="type-h3 mt-3 text-ink">{point.title}</h3>
                    <p className="type-body mt-2 text-muted">{point.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <WhyChooseUs items={about.whyUs} />
        <OurTeam members={team} />
      </main>
      <Footer />
    </>
  );
}
