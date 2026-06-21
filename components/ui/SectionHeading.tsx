import { cn } from "@/lib/cn";

/**
 * Reusable section heading: gold eyebrow + display title + optional intro.
 * Uses the central type scale (type-eyebrow / type-h1 / type-body-lg) and
 * semantic color tokens. Presentational only — parents wrap it for motion.
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
        <p className={cn("type-eyebrow mb-4", onDark && "text-accent")}>{eyebrow}</p>
      )}
      <h2 className={cn("type-h1", onDark ? "text-on-dark" : "text-ink")}>{title}</h2>
      {intro && (
        <p className={cn("type-body-lg mt-5", onDark ? "text-on-dark/70" : "text-muted")}>
          {intro}
        </p>
      )}
    </div>
  );
}
