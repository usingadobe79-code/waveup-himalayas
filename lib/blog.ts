/**
 * Blog data layer — reads Markdown posts from content/blog/ at build time.
 * Static export has no server at runtime, so all of this only ever runs
 * during `next build` (or `next dev`), never in the browser.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Faq } from "@/lib/content";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

/**
 * The CMS writes images as `![](url "Title")` — no alt text, just a title —
 * which `marked`'s default renderer turns into `<img title="...">` with NO
 * `alt`. Fix it for every post without editing the markdown: when an image
 * has no alt text but does have a title, use the title as the alt text (a
 * real, human-written string — not invented). Images that already have real
 * alt text are untouched. `token.tokens` also has to be replaced with a
 * matching text token: the default renderer re-derives alt text from it when
 * non-empty, which would otherwise override `token.text` back to "" before
 * falling through to it via `return false`.
 */
marked.use({
  renderer: {
    image(token) {
      if (!token.text && token.title) {
        token.text = token.title;
        token.tokens = [{ type: "text", raw: token.title, text: token.title, escaped: false }];
      }
      return false;
    },
  },
});

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO date string, e.g. "2026-09-20"
  excerpt: string;
  coverImage: string;
  author: string;
  draft: boolean;
  /** Writer-picked package slugs for the "Recommended treks" sidebar/drawer
   *  on the post (see components/sections/BlogRecommendedSidebar.tsx and
   *  BlogRecommendedDrawer.tsx). Optional — defaults to [] when absent, in
   *  which case the post renders with no sidebar/drawer at all. */
  relatedPackages: string[];
  /** Writer-set override for the Google results title — renders as an
   *  `absolute` metadata title (bypassing the sitewide "%s — {business}"
   *  template) when set. Undefined when unset, in which case the page falls
   *  back to the post title — see generateMetadata in app/blog/[slug]/page.tsx. */
  seoTitle?: string;
  /** Writer-set override for the Google snippet / meta description. Undefined
   *  when unset, in which case the page falls back to `excerpt`. */
  seoDescription?: string;
  /** Writer-set FAQ pairs — renders the FAQ accordion + FAQPage JSON-LD on the
   *  post when present (see components/sections/PackageFaq.tsx and
   *  components/seo/FaqJsonLd.tsx). Undefined when absent, in which case the
   *  section is omitted entirely. */
  faqs?: Faq[];
  /** Rendered markdown body — only populated by getPost(), not the list. */
  contentHtml: string;
};

type PostFrontmatter = {
  title: string;
  // YAML parses an unquoted `date: 2026-09-28` into a Date, but a quoted
  // `date: "2026-09-28"` stays a string. The CMS writes the unquoted form, so
  // we must accept both and normalise (see toDateString).
  date: string | Date;
  excerpt: string;
  coverImage: string;
  author: string;
  draft?: boolean;
  relatedPackages?: string[];
  seoTitle?: string;
  seoDescription?: string;
  faqs?: Faq[];
};

/**
 * Normalise frontmatter `faqs` into a clean Faq[], or undefined when there's
 * nothing usable — drops any entry missing a non-empty question or answer so
 * a partially-filled CMS row never renders a blank accordion item or an empty
 * FAQPage Question/Answer pair. Mirrors the defensive style of `toDateString`.
 */
function parseFaqs(raw: unknown): Faq[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const faqs = raw.filter(
    (f): f is Faq =>
      typeof f === "object" &&
      f !== null &&
      typeof (f as Faq).question === "string" &&
      (f as Faq).question.trim() !== "" &&
      typeof (f as Faq).answer === "string" &&
      (f as Faq).answer.trim() !== "",
  );
  return faqs.length > 0 ? faqs : undefined;
}

/**
 * Normalise a frontmatter date to a "YYYY-MM-DD" string. gray-matter's YAML
 * turns an unquoted date into a Date object; a quoted one stays a string.
 * Either way we return a plain ISO day string so the rest of the code (sorting,
 * formatDate) has one predictable type and the build never crashes on it.
 */
function toDateString(value: string | Date | undefined): string {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10);
  }
  return typeof value === "string" ? value.trim() : "";
}

/** Filenames (without .md) of every post in content/blog/, draft or not. */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Read + parse one post's frontmatter (and raw body) by slug. */
function readPost(slug: string): { data: PostFrontmatter; content: string } | undefined {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { data: data as PostFrontmatter, content };
}

/**
 * All non-draft posts, newest first. Frontmatter only — the list page
 * doesn't need the rendered HTML body, so it's left empty here.
 */
export function getAllPosts(): BlogPost[] {
  const posts = getPostSlugs()
    .map((slug) => {
      const parsed = readPost(slug);
      if (!parsed) return undefined;
      const { data } = parsed;
      const post: BlogPost = {
        slug,
        title: data.title,
        date: toDateString(data.date),
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        author: data.author,
        draft: data.draft ?? false,
        relatedPackages: data.relatedPackages ?? [],
        seoTitle: data.seoTitle || undefined,
        seoDescription: data.seoDescription || undefined,
        faqs: parseFaqs(data.faqs),
        contentHtml: "",
      };
      return post;
    })
    .filter((p): p is BlogPost => p !== undefined && !p.draft);

  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** One post, with its markdown body rendered to HTML. */
export function getPost(slug: string): BlogPost | undefined {
  const parsed = readPost(slug);
  if (!parsed) return undefined;
  const { data, content } = parsed;
  return {
    slug,
    title: data.title,
    date: toDateString(data.date),
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    author: data.author,
    draft: data.draft ?? false,
    relatedPackages: data.relatedPackages ?? [],
    seoTitle: data.seoTitle || undefined,
    seoDescription: data.seoDescription || undefined,
    faqs: parseFaqs(data.faqs),
    contentHtml: marked.parse(content, { async: false }),
  };
}

/** "2026-09-20" -> "September 20, 2026", parsed as UTC so the date never
 *  shifts a day depending on the server/browser's local timezone. */
export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  // Never let a malformed date throw and take the whole build down — fall back
  // to the raw value instead.
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
