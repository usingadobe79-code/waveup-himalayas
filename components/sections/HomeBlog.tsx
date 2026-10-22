"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { staggerContainer, fadeRise, REVEAL } from "@/lib/motion";

export type HomeBlogPost = {
  slug: string;
  title: string;
  /** Pre-formatted date, e.g. "September 20, 2026". */
  date: string;
  excerpt: string;
  /** Already-resolved (optimized) cover image src. */
  coverImage: string;
};

/**
 * "From the blog" — the 3 most recent posts + a link to the full blog.
 * Blog data is fs-based (build-time only), so app/page.tsx fetches it and
 * passes plain serializable props; this client component only animates.
 */
export function HomeBlog({ posts }: { posts: HomeBlogPost[] }) {
  const reduced = useReducedMotion();

  if (posts.length === 0) return null;

  const groupProps = reduced
    ? { variants: staggerContainer, initial: false as const, animate: "show" as const }
    : {
        variants: staggerContainer,
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: REVEAL.viewport,
      };

  return (
    <section id="blog" className="section-y bg-surface-alt">
      <div className="container-page">
        <m.div {...groupProps}>
          <m.div variants={fadeRise}>
            <SectionHeading
              eyebrow="From The Blog"
              title="Trekking Tips & Stories"
              intro="Practical guides and notes from the trail to help you plan your journey through the Nepal Himalayas."
            />
          </m.div>

          <div className="mt-12 grid gap-6 md:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <m.div key={post.slug} variants={fadeRise} className="min-w-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="card card-hover group flex h-full flex-col overflow-hidden"
                >
                  <img
                    src={post.coverImage}
                    loading="lazy"
                    decoding="async"
                    alt={post.title}
                    className="aspect-[16/10] w-full rounded-t-card object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col p-6">
                    <p className="type-small text-muted">{post.date}</p>
                    <h3 className="type-h3 mt-2 text-ink">{post.title}</h3>
                    <p className="type-small mt-3 line-clamp-2 text-muted">{post.excerpt}</p>
                    <span className="type-small mt-4 font-semibold text-ink transition-colors group-hover:text-accent">
                      Read more <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </m.div>
            ))}
          </div>

          <m.div variants={fadeRise} className="mt-12 flex justify-center md:mt-16">
            <Button href="/blog" variant="outline-dark">
              Read our blog
            </Button>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
