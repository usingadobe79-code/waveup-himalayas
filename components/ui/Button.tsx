import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "gold" | "outline" | "outline-dark";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-300 " +
  "ease-[var(--ease-out-expo)] will-change-transform " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  // Gold fill, subtle scale + glow on hover (spec §1).
  gold:
    "bg-accent text-surface-darker hover:bg-accent-hover hover:scale-[1.03] " +
    "hover:shadow-[0_0_28px_-6px_var(--color-accent)]",
  // Light outline on dark backgrounds.
  outline:
    "border border-on-dark/40 text-on-dark hover:border-on-dark hover:bg-on-dark/10 hover:scale-[1.02]",
  // Ink outline on light backgrounds.
  "outline-dark":
    "border border-ink/30 text-ink hover:border-ink hover:bg-ink/5 hover:scale-[1.02]",
};

// Same 52px height for primary CTAs (design system). sm = compact (header).
const sizes: Record<Size, string> = {
  sm: "h-11 px-5 text-sm",
  md: "h-[52px] px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, "className" | "children"> & { href: string };
type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & { href?: undefined };

/**
 * Polymorphic CTA. Renders an <a> when `href` is set (bookings route to
 * WhatsApp / email / anchors — no in-app checkout), otherwise a <button>.
 */
export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "gold", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
