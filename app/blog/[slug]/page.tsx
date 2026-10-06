import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { getPost, getPostSlugs, formatDate } from "@/lib/blog";
import { business } from "@/lib/content";

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
  const ogTitle = `${post.title} — ${business.name}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      siteName: business.name,
      url: `/blog/${post.slug}`,
      title: ogTitle,
      description: post.excerpt,
      images: [{ url: post.coverImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: post.excerpt,
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
            src={post.coverImage}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-card object-cover shadow-card"
          />
        </div>

        {/* Body */}
        <section className="section-y bg-surface">
          <div className="container-page">
            <div className="prose-blog mx-auto max-w-[68ch]">
              <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            </div>

            <div className="mx-auto mt-12 max-w-[68ch] border-t border-border pt-6 text-center">
              <Link
                href="/blog"
                className="type-small font-semibold text-accent-ink underline-offset-4 hover:underline"
              >
                ← Back to all posts
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
