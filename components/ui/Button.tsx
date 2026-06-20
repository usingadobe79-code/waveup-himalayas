import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "gold" | "outline" | "outline-dark";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-300 " +
  "ease-[var(--ease-out-expo)] will-change-transform " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  // Gold fill, subtle scale + glow on hover (spec §1).
  gold:
    "bg-gold text-navy-deep hover:bg-gold-light hover:scale-[1.03] " +
    "hover:shadow-[0_0_28px_-6px_var(--color-gold)]",
  // White outline on dark backgrounds.
  outline:
    "border border-white/40 text-white hover:border-white hover:bg-white/10 hover:scale-[1.02]",
  // Navy outline on light backgrounds.
  "outline-dark":
    "border border-navy/30 text-navy hover:border-navy hover:bg-navy/5 hover:scale-[1.02]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
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
