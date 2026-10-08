/**
 * Team data layer — reads content/team/*.md at build time. Mirrors
 * lib/blog.ts's fs/gray-matter pattern: static export has no server at
 * runtime, so this only ever runs during `next build` (or `next dev`), never
 * in the browser. app/about/page.tsx (a server component) is the only
 * consumer — this is NOT routed through content.ts or a generated
 * .data.json, so it's free to use `fs` directly without risking a client
 * component import.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const TEAM_DIR = path.join(process.cwd(), "content", "team");

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** Raw uploaded photo path, or undefined when no photo was set — renders a
   *  branded placeholder avatar instead (see components/sections/OurTeam.tsx). */
  photo?: string;
  bio?: string;
  /** Sort key — lower shows first. Defaults to last when unset. */
  order: number;
};

type TeamFrontmatter = {
  name?: string;
  role?: string;
  photo?: string;
  order?: number;
  bio?: string;
};

/** Filenames (without .md) of every member file in content/team/. */
function getMemberSlugs(): string[] {
  if (!fs.existsSync(TEAM_DIR)) return [];
  return fs
    .readdirSync(TEAM_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Read + parse one member's frontmatter by slug. Skips (returns undefined)
 *  a row missing its required name/role — never render a blank team card. */
function readMember(slug: string): TeamMember | undefined {
  const filePath = path.join(TEAM_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const fm = data as TeamFrontmatter;

  if (!fm.name || !fm.name.trim() || !fm.role || !fm.role.trim()) return undefined;

  return {
    slug,
    name: fm.name.trim(),
    role: fm.role.trim(),
    photo: fm.photo || undefined,
    bio: fm.bio || undefined,
    order: typeof fm.order === "number" && Number.isFinite(fm.order) ? fm.order : Number.MAX_SAFE_INTEGER,
  };
}

/**
 * All team members for the /about page, sorted by `order` (lower first),
 * then by name. Malformed entries (missing name/role) are silently skipped.
 */
export function getTeam(): TeamMember[] {
  const members = getMemberSlugs()
    .map(readMember)
    .filter((m): m is TeamMember => m !== undefined);

  return members.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });
}
