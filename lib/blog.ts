/**
 * Blog data layer — reads Markdown posts from content/blog/ at build time.
 * Static export has no server at runtime, so all of this only ever runs
 * during `next build` (or `next dev`), never in the browser.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO date string, e.g. "2026-09-20"
  excerpt: string;
  coverImage: string;
  author: string;
  draft: boolean;
  /** Rendered markdown body — only populated by getPost(), not the list. */
  contentHtml: string;
};

type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  author: string;
  draft?: boolean;
};

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
        date: data.date,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        author: data.author,
        draft: data.draft ?? false,
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
    date: data.date,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    author: data.author,
    draft: data.draft ?? false,
    contentHtml: marked.parse(content, { async: false }),
  };
}

/** "2026-09-20" -> "September 20, 2026", parsed as UTC so the date never
 *  shifts a day depending on the server/browser's local timezone. */
export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
