import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { PackageFaq } from "@/components/sections/PackageFaq";
import { BlogRecommendedSidebar } from "@/components/sections/BlogRecommendedSidebar";
import { BlogRecommendedDrawer } from "@/components/sections/BlogRecommendedDrawer";
import { getPost, getPostSlugs, formatDate, resolveOptimized } from "@/lib/blog";
import { business, getPackage, type Package } from "@/lib/content";

// Only the known post slugs are valid routes; anything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  // Writer-set overrides (optional, from content/blog/<slug>.md) take
  // priority; otherwise fall back to the existing title/excerpt.
  const description = post.seoDescription ?? post.excerpt;
  const ogTitle = post.seoTitle ?? `${post.title} — ${business.name}`;
  return {
    // `absolute` bypasses the sitewide "%s — {business}" title template
    // (see app/layout.tsx) so a custom seoTitle renders verbatim.
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      siteName: business.name,
      url: `/blog/${post.slug}`,
      title: ogTitle,
      description,
      images: [{ url: post.coverImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Writer-picked "Recommended treks" (optional) — resolve each slug to its
  // Package, dropping any that no longer exist. Empty when the post has none,
  // in which case the sidebar/drawer below render nothing and the body keeps
  // its original single-column layout.
  const recommended = post.relatedPackages
    .map((pkgSlug) => getPackage(pkgSlug))
    .filter((p): p is Package => p !== undefined);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <ArticleJsonLd
        headline={post.title}
        description={post.excerpt}
        image={post.coverImage}
        datePublished={post.date}
        author={post.author}
        path={`/blog/${post.slug}`}
      />
      {post.faqs && post.faqs.length > 0 && <FaqJsonLd faqs={post.faqs} />}
      <Header solid />
      <main className="flex-1">
        {/* Intro band — dark, so the solid navy header sits cleanly on top */}
        <section className="bg-surface-dark pb-12 pt-28 text-on-dark md:pb-16 md:pt-32">
          <div className="container-page">
            <nav aria-label="Breadcrumb" className="type-small mb-5 text-on-dark/70">
              <Link href="/" className="transition-colors hover:text-on-dark">
                Home
              </Link>
              <span className="px-2 text-on-dark/40">/</span>
              <Link href="/blog" className="transition-colors hover:text-on-dark">
                Blog
              </Link>
              <span className="px-2 text-on-dark/40">/</span>
              <span className="text-on-dark/90">{post.title}</span>
            </nav>
            <p className="type-small text-on-dark/70">
              {formatDate(post.date)} · {post.author}
            </p>
            <h1 className="type-h1 mt-4 max-w-3xl text-on-dark">{post.title}</h1>
          </div>
        </section>

        {/* Cover image */}
        <div className="container-page -mt-8 md:-mt-10">
          <img
            src={resolveOptimized(post.coverImage)}
            fetchPriority="high"
            decoding="async"
            alt={post.title}
            className="aspect-[16/9] w-full rounded-card object-cover shadow-card"
          />
        </div>

        {/* Body — a plain centered column when the post has no recommended
            treks (unchanged); a two-column grid with a sticky sidebar from
            `lg` up when it does (BlogRecommendedDrawer covers mobile). */}
        <section className="section-y bg-surface">
          <div className="container-page">
            {recommended.length > 0 ? (
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
                <div className="min-w-0 max-w-[68ch]">
                  <div className="prose-blog">
                    <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                  </div>

                  {/* FAQ — only for posts that supplied faqs (see FaqJsonLd above). */}
                  {post.faqs && post.faqs.length > 0 && (
                    <div className="mt-12">
                      <h2 className="type-h3 text-ink">Frequently asked questions</h2>
                      <PackageFaq faqs={post.faqs} />
                    </div>
                  )}

                  <div className="mt-12 border-t border-border pt-6 text-center">
                    <Link
                      href="/blog"
                      className="type-small font-semibold text-accent-ink underline-offset-4 hover:underline"
                    >
                      ← Back to all posts
                    </Link>
                  </div>
                </div>

                <BlogRecommendedSidebar packages={recommended} />
              </div>
            ) : (
              <>
                <div className="prose-blog mx-auto max-w-[68ch]">
                  <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                </div>

                {/* FAQ — only for posts that supplied faqs (see FaqJsonLd above). */}
                {post.faqs && post.faqs.length > 0 && (
                  <div className="mx-auto mt-12 max-w-[68ch]">
                    <h2 className="type-h3 text-ink">Frequently asked questions</h2>
                    <PackageFaq faqs={post.faqs} />
                  </div>
                )}

                <div className="mx-auto mt-12 max-w-[68ch] border-t border-border pt-6 text-center">
                  <Link
                    href="/blog"
                    className="type-small font-semibold text-accent-ink underline-offset-4 hover:underline"
                  >
                    ← Back to all posts
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {recommended.length > 0 && <BlogRecommendedDrawer packages={recommended} />}
      </main>
      <Footer />
    </>
  );
}
