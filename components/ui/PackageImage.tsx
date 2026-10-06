import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Image with a branded fallback. When `src` is null/empty we render a navy block
 * with the gold WaveUp peak mark instead of a broken image (hard rule: never a
 * broken image). Designed to fill a positioned parent — wrap it in a relative,
 * aspect-ratio'd container exactly like a `next/image` `fill` usage.
 *
 * `src` is expected to already be a resolved on-page display path (a
 * package's `imageDisplay`, not its raw `image`) — see lib/content.ts and
 * scripts/generate-packages.mjs.
 */
export function PackageImage({
  src,
  alt,
  sizes,
  priority = false,
  quality = 82,
  className,
}: {
  src: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }
  return <BrandedPlaceholder label={alt} />;
}

/**
 * Standalone branded placeholder (navy gradient + gold peak mark + wordmark).
 * Fills its positioned parent. Exported so other missing-image spots can reuse it.
 */
export function BrandedPlaceholder({ label }: { label?: string }) {
  return (
    <div
      role="img"
      aria-label={label ? `${label} (image coming soon)` : "Image coming soon"}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-dark to-surface-darker"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 120 40"
        className="h-9 w-24 opacity-90"
        fill="none"
      >
        <path
          d="M10 34 L42 8 L58 24 L74 6 L110 34"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="type-eyebrow !text-on-dark/55">WaveUp Himalayas</span>
    </div>
  );
}
