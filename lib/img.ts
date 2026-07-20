/**
 * On-page images are served as WebP; the .jpg original stays on disk beside it.
 *
 * The split exists because these same photos are the og:image for the home page
 * and each package page, and Facebook/WhatsApp link-preview crawlers are
 * unreliable with WebP. WhatsApp is this business's main enquiry channel, so a
 * preview that renders matters more than the last few kilobytes. Metadata keeps
 * pointing at the .jpg; only what the browser paints goes through here.
 *
 * Anything that is not a .jpg/.jpeg passes through untouched, so callers can
 * hand this a PNG or an already-WebP path without special-casing.
 */
export function displaySrc(src: string): string {
  return src.replace(/\.jpe?g$/i, ".webp");
}
