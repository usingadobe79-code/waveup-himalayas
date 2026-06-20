import { cn } from "@/lib/cn";

/**
 * WaveUp Himalayas wordmark.
 *
 * The real logo has a distinctive flowing WAVE-shaped "W" mark in navy with a
 * gold mountain peak (upper right). We do NOT approximate it — instead we show
 * a clear placeholder box until the real asset lands.
 *
 * TO WIRE THE REAL LOGO: drop the file at public/images/logo.svg (or .png),
 * then set MARK_SRC below to that path. The placeholder is replaced automatically.
 */
const MARK_SRC: string | null = null; // e.g. "/images/logo.svg" once provided

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display font-semibold tracking-tight",
        className,
      )}
      aria-label="WaveUp Himalayas"
    >
      {MARK_SRC ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={MARK_SRC} alt="" aria-hidden="true" className="h-[1.2em] w-auto shrink-0" />
      ) : (
        // Clear placeholder — intentionally NOT the real wave mark.
        <span
          aria-hidden="true"
          title="Logo mark placeholder — real asset pending"
          className="grid h-[1.2em] w-[1.2em] shrink-0 place-items-center rounded-[4px] border border-dashed border-gold/70 text-[0.5em] font-bold leading-none text-gold"
        >
          ▲
        </span>
      )}
      <span className="leading-none">
        <span className={onDark ? "text-white" : "text-navy"}>WAVE</span>
        <span className="text-gold">UP</span>
      </span>
    </span>
  );
}
