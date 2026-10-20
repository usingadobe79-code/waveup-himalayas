import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export: `next build` emits a plain HTML/CSS/JS site into `out/`,
   * which is uploaded to cPanel shared hosting. No Node server runs in
   * production, so anything server-only (route handlers, server actions,
   * ISR/revalidate, middleware) would break the build — the site uses none.
   */
  output: "export",

  /**
   * Apache (what cPanel runs) serves a directory by looking for index.html
   * inside it. With this on, the export emits `out/packages/<slug>/index.html`
   * instead of `out/packages/<slug>.html`, so deep links resolve natively.
   * Without it, /packages/everest-base-camp-trek only works if the host
   * happens to have MultiViews enabled — which is not guaranteed.
   */
  trailingSlash: true,

  /**
   * `lucide-react` is already optimized by Next's defaults, so only
   * `framer-motion` needs listing here.
   */
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },

  images: {
    /**
     * The Next.js image optimizer is a server feature and cannot run on a
     * static host, so images are served as-is from `public/`. (This replaces
     * the previous `qualities: [75, 82]`, which only affected optimizer URLs
     * and is inert once optimization is off.) Keep source images reasonably
     * sized — nothing resizes them at request time any more.
     */
    unoptimized: true,
  },
};

export default nextConfig;
