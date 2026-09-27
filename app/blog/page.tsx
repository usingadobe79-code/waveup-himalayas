import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getAllPosts, formatDate } from "@/lib/blog";
import { displaySrc } from "@/lib/img";

const BLOG_DESC =
  "Trekking tips, packing guides and travel notes from WaveUp Himalayas — practical reading for planning your trip to the Nepal Himalayas.";

export const metadata: Metadata = {
  // Title template in the root layout appends " — WaveUp Himalayas".
  title: "Blog",
  description: BLOG_DESC,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    siteName: "WaveUp Himalayas",
    url: "/blog",
    title: "Blog — WaveUp Himalayas",
    description: BLOG_DESC,
    images: [{ url: "/images/hero.jpg", alt: "WaveUp Himalayas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — WaveUp Himalayas",
    description: BLOG_DESC,
    images: ["/images/hero.jpg"],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

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
              <span className="text-on-dark/90">Blog</span>
            </nav>
            <p className="type-eyebrow mb-4 text-accent">Notes From The Trail</p>
            <h1 className="type-h1 max-w-3xl text-on-dark">Blog</h1>
            <p className="type-body-lg mt-5 max-w-2xl text-on-dark/75">
              Trekking tips, packing guides and travel notes to help you plan your trip to the
              Nepal Himalayas.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="section-y bg-surface">
          <div className="container-page">
            {posts.length === 0 ? (
              <p className="type-body-lg text-center text-muted">
                No posts yet — check back soon.
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="card card-hover group flex flex-col overflow-hidden"
                  >
                    <img
                      src={displaySrc(post.coverImage)}
                      alt={post.title}
                      className="aspect-[16/10] w-full rounded-t-card object-cover"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="type-small text-muted">{formatDate(post.date)}</p>
                      <h2 className="type-h3 mt-2 text-ink">{post.title}</h2>
                      <p className="type-small mt-3 text-muted">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
