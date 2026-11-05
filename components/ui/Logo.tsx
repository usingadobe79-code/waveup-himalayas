import { cn } from "@/lib/cn";

/**
 * WaveUp Himalayas logo — the "type 2" brand lockup: the mountain-wave symbol
 * (navy wave + gold peak) beside the two-line "WAVE UP / — HIMALAYAS —" wordmark.
 * The web files are composited from the symbol + the type-2 wordmark, keeping the
 * symbol:wordmark proportions of the original lockup. Source art lives in /logo;
 * the web-optimized, transparent-background lockups are in /public/logo. (The
 * standalone symbol also ships as symbol.png for the reviews mark and the SEO
 * publisher logo.)
 *
 * Two colour variants:
 *  - default        → navy + gold, for light surfaces.
 *  - onDark (true)  → white + gold, for the dark navy header / footer.
 *
 * Sized in `em` so callers can scale it with a font-size utility (text-lg / text-xl
 * / text-2xl) exactly as before; the intrinsic width/height keep layout shift out.
 */
/**
 * Intrinsic px of the lockup PNGs. These must track the actual files: the
 * browser uses the ratio to reserve space before the image arrives, so a stale
 * value here reintroduces the layout shift the attributes exist to prevent.
 * The composite is built at ~2593px wide and downsampled to 1000px (still ~4x
 * the ~250px it ever renders at), which keeps retina crisp. The symbol and the
 * two-line wordmark are matched in height, giving the 1000×164 ratio.
 */
const LOCKUP = { width: 1000, height: 164 } as const;

export function Logo({
  className,
  onDark = false,
  priority = false,
}: {
  className?: string;
  onDark?: boolean;
  /**
   * The header logo is the measured LCP element on mobile. Left at the browser's
   * default low priority, its bytes queue behind the fonts/CSS/JS and it does not
   * paint until ~4s on a throttled connection. `priority` marks it high so it
   * downloads alongside the hero and paints early. Only the header passes it; the
   * footer logo stays default (it is below the fold).
   */
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={onDark ? "/logo/lockup-type2-light.png" : "/logo/lockup-type2.png"}
      alt="WaveUp Himalayas"
      width={LOCKUP.width}
      height={LOCKUP.height}
      fetchPriority={priority ? "high" : undefined}
      /**
       * max-w-none matters: the CSS reset applies `max-width: 100%` to images,
       * which in a narrow container (the footer's grid column) clamps the width
       * while `h-[1.6em]` holds the height — rendering the lockup horizontally
       * squashed. Opting out keeps width derived from the height and the real
       * aspect ratio, wherever it is placed.
       */
      className={cn("inline-block h-[1.6em] w-auto max-w-none select-none", className)}
    />
  );
}
