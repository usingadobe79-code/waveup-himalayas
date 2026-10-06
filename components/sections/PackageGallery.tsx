import Image from "next/image";

/**
 * "Photo gallery" grid for a package's detail page — real trip photos
 * supplied via the `gallery` frontmatter field. Rendered only when the
 * package has a non-empty gallery (see app/packages/[slug]/page.tsx); same
 * fixed-ratio frame as the package cards elsewhere on the site.
 *
 * `images` is expected to already be resolved on-page display paths (a
 * package's `galleryDisplay`, not its raw `gallery`) — see lib/content.ts
 * and scripts/generate-packages.mjs.
 */
export function PackageGallery({ images, title }: { images: string[]; title: string }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className="relative aspect-[3/2] overflow-hidden rounded-card">
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
