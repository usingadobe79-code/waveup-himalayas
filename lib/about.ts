/**
 * About page data layer — reads content/about.md at build time. Mirrors
 * lib/blog.ts's fs/gray-matter pattern: static export has no server at
 * runtime, so this only ever runs during `next build` (or `next dev`), never
 * in the browser. app/about/page.tsx (a server component) is the only
 * consumer — unlike packages/offers, this is NOT routed through content.ts
 * or a generated .data.json, so it's free to use `fs` directly without
 * risking a client-component import.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const ABOUT_FILE = path.join(process.cwd(), "content", "about.md");

/** One "Our Mission" point (title + supporting text). */
export type MissionPoint = { title: string; text: string };

/** One "Why Choose Us" feature card. `icon` is an optional lucide icon key —
 *  see the `icon` select options in public/admin/config.yml and the icon map
 *  in components/sections/WhyChooseUs.tsx. Omitted/unrecognised → that
 *  component falls back to a default icon rather than rendering nothing. */
export type WhyUsFeature = { title: string; description: string; icon?: string };

export type AboutContent = {
  eyebrow: string;
  title: string;
  /** Rendered HTML of the markdown `intro` frontmatter field. */
  introHtml: string;
  mission: MissionPoint[];
  whyUs: WhyUsFeature[];
};

type AboutFrontmatter = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  mission?: { title?: string; text?: string }[];
  whyUs?: { title?: string; description?: string; icon?: string }[];
};

/** Drop list rows missing a required field — never render a blank mission
 *  block from a partially-filled CMS row. */
function parseMission(raw: unknown): MissionPoint[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (m): m is MissionPoint =>
      typeof m === "object" &&
      m !== null &&
      typeof (m as MissionPoint).title === "string" &&
      (m as MissionPoint).title.trim() !== "" &&
      typeof (m as MissionPoint).text === "string" &&
      (m as MissionPoint).text.trim() !== "",
  );
}

/** Same defensive filtering as parseMission, for the whyUs list — `icon` is
 *  optional and normalised to undefined when blank. */
function parseWhyUs(raw: unknown): WhyUsFeature[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (w): w is { title: string; description: string; icon?: string } =>
        typeof w === "object" &&
        w !== null &&
        typeof (w as WhyUsFeature).title === "string" &&
        (w as WhyUsFeature).title.trim() !== "" &&
        typeof (w as WhyUsFeature).description === "string" &&
        (w as WhyUsFeature).description.trim() !== "",
    )
    .map((w) => ({
      title: w.title,
      description: w.description,
      icon: w.icon && w.icon.trim() !== "" ? w.icon : undefined,
    }));
}

/**
 * The /about page's editorial content — company intro, mission points and
 * Why Choose Us features. Falls back to an empty-but-valid shape when
 * content/about.md is missing, so a misconfigured build never crashes (the
 * page itself decides how to render an empty state).
 */
export function getAbout(): AboutContent {
  if (!fs.existsSync(ABOUT_FILE)) {
    return { eyebrow: "", title: "About WaveUp Himalayas", introHtml: "", mission: [], whyUs: [] };
  }
  const raw = fs.readFileSync(ABOUT_FILE, "utf8");
  const { data } = matter(raw);
  const fm = data as AboutFrontmatter;

  return {
    eyebrow: fm.eyebrow ?? "",
    title: fm.title ?? "About WaveUp Himalayas",
    introHtml: fm.intro ? (marked.parse(fm.intro, { async: false }) as string) : "",
    mission: parseMission(fm.mission),
    whyUs: parseWhyUs(fm.whyUs),
  };
}
