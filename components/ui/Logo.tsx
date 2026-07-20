import { cn } from "@/lib/cn";

/**
 * WaveUp Himalayas logo — the real brand lockup (flowing wave "W" in navy with a
 * gold mountain peak, beside the "WAVE UP" wordmark). Source art lives in /logo;
 * the web-optimized, transparent-background lockups are in /public/logo.
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
 * The source art was 3660px wide — roughly 14x the ~250px it ever renders at —
 * so it was downsampled to 1000px, which still covers 4x retina.
 */
const LOCKUP = { width: 1000, height: 139 } as const;

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={onDark ? "/logo/lockup-light.png" : "/logo/lockup.png"}
      alt="WaveUp Himalayas"
      width={LOCKUP.width}
      height={LOCKUP.height}
      className={cn("inline-block h-[1.5em] w-auto select-none", className)}
    />
  );
}
