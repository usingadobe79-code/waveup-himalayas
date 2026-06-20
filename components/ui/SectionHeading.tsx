import { cn } from "@/lib/cn";

/**
 * Reusable section heading: small gold eyebrow + display title + optional intro.
 * Presentational only — parent sections wrap it for scroll-reveal motion.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-4xl font-light leading-tight tracking-tight md:text-5xl",
          onDark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-base md:text-lg", onDark ? "text-white/70" : "text-ink/70")}>
          {intro}
        </p>
      )}
    </div>
  );
}
