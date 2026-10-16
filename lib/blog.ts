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
/**
 * Returns the build-time optimized derivative (`X.opt.webp`, made by
 * scripts/optimize-images.mjs) of a public image path when it exists on
 * disk, else the path unchanged. Decodes `%20` before the fs check and
 * re-encodes the emitted URL when the input was encoded.
 */
export function resolveOptimized(src: string): string {
  if (!src || !src.startsWith("/")) return src;
  let decoded = src;
  try {
    decoded = decodeURIComponent(src);
  } catch {
    return src;
  }
  const opt = decoded.replace(/\.(jpe?g|png|webp)$/i, ".opt.webp");
  if (opt === decoded) return src;
  if (!fs.existsSync(path.join(process.cwd(), "public", opt))) return src;
  return decoded !== src ? encodeURI(opt) : opt;
}

marked.use({
  hooks: {
    postprocess(html) {
      return html
        .replace(/<img /g, '<img loading="lazy" decoding="async" ')
        .replace(/<table[^>]*>/g, '<div class="prose-table-wrap">$&')
        .replace(/<\/table>/g, '</table></div>');
    },
  },
  renderer: {
    image(token) {
      token.href = resolveOptimized(token.href);
      if (!token.text && token.title) {
        token.text = token.title;
        token.tokens = [{ type: "text", raw: token.title, text: token.title, escaped: false }];
      }
      return false;
    },
  },
});

export type BlogTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

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
  /** Writer-set tables (fill-in-the-boxes in the CMS). Rendered into
   *  `contentHtml` by getPost(); kept here for reference. */
  tables?: BlogTable[];
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
  tables?: BlogTable[];
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
 * Normalise frontmatter `tables` (CMS shape:
 * `[{caption, headers: [..], rows: [{cells: [..]}]}]`) into a clean
 * BlogTable[], or undefined when nothing usable. Never throws; tables with no
 * headers AND no rows are dropped.
 */
function parseTables(raw: unknown): BlogTable[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const str = (v: unknown): string =>
    typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
  const tables: BlogTable[] = [];
  for (const t of raw) {
    if (typeof t !== "object" || t === null) continue;
    const { caption, headers, rows } = t as Record<string, unknown>;
    const h = Array.isArray(headers) ? headers.map(str) : [];
    const r = (Array.isArray(rows) ? rows : [])
      .map((row) => {
        const cells =
          Array.isArray(row) ? row : (row as { cells?: unknown } | null)?.cells;
        return Array.isArray(cells) ? cells.map(str) : [];
      })
      .filter((cells) => cells.some((c) => c !== ""));
    if (h.every((x) => x === "") && r.length === 0) continue;
    tables.push({ caption: str(caption) || undefined, headers: h, rows: r });
  }
  return tables.length > 0 ? tables : undefined;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Table -> HTML matching the Markdown-table DOM so `.prose-blog table` CSS
 *  applies. Rows are padded/truncated to the header count. All text escaped. */
function renderTable(t: BlogTable): string {
  const cols = t.headers.length || Math.max(0, ...t.rows.map((r) => r.length));
  const fit = (cells: string[]) =>
    Array.from({ length: cols }, (_, i) => cells[i] ?? "");
  const head = t.headers.length
    ? `<thead><tr>${fit(t.headers)
        .map((c) => `<th>${escapeHtml(c)}</th>`)
        .join("")}</tr></thead>`
    : "";
  const body = `<tbody>${t.rows
    .map(
      (r) =>
        `<tr>${fit(r)
          .map((c) => `<td>${escapeHtml(c)}</td>`)
          .join("")}</tr>`,
    )
    .join("")}</tbody>`;
  const caption = t.caption ? `<caption>${escapeHtml(t.caption)}</caption>` : "";
  return `<div class="prose-table-wrap"><table>${caption}${head}${body}</table></div>`;
}

/** Replace `{{tableN}}` tokens (1-indexed) with rendered tables, drop tokens
 *  for missing tables, and append any table never referenced, in order. */
function injectTables(html: string, tables: BlogTable[] | undefined): string {
  const list = tables ?? [];
  const used = new Set<number>();
  const sub = (_m: string, n: string) => {
    const i = Number(n) - 1;
    if (!list[i]) return "";
    used.add(i);
    return renderTable(list[i]);
  };
  let out = html
    .replace(/<p>\s*\{\{\s*table(\d+)\s*\}\}\s*<\/p>/gi, sub)
    .replace(/\{\{\s*table(\d+)\s*\}\}/gi, sub);
  list.forEach((t, i) => {
    if (!used.has(i)) out += renderTable(t);
  });
  return out;
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
        tables: parseTables(data.tables),
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
  const tables = parseTables(data.tables);
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
    tables,
    contentHtml: injectTables(marked.parse(content, { async: false }), tables),
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
