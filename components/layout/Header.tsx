"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { contact } from "@/lib/content";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "Regions", href: "#regions" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

/**
 * Sticky header. Transparent over the hero; frosts + shrinks once scrolled past
 * the hero (docs/01 §1). Inline nav from `xl` up; below `xl` the nav collapses
 * into a hamburger that opens a slide-in drawer (logo left, hamburger right).
 *
 * `solid` forces the frosted state — used on sub-pages (e.g. /packages) whose
 * heroes aren't full-height, so the nav never sits transparent over light copy.
 * Off the homepage, section anchors resolve to "/#section" so they navigate
 * home first; the home smooth-scroll/pin handling lives in SmoothScroll.
 */
export function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const frosted = scrolled || open || solid;

  // Off-home, prefix section anchors so they route back to the homepage section.
  const resolve = (hash: string) => (onHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const drawerMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { duration: 0.4, ease: EASE_OUT_EXPO },
      };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[height,background-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]",
        frosted
          ? "h-[60px] bg-navy/85 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md"
          : "h-[72px] bg-transparent",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6">
        <a
          href={onHome ? "#top" : "/"}
          aria-label="WaveUp Himalayas — home"
          className="shrink-0"
        >
          <Logo
            onDark
            className={cn(
              "origin-left transition-transform duration-500 ease-[var(--ease-out-expo)]",
              // Smaller base size so the lockup never crowds the controls on a
              // narrow phone; it steps back up once there is room for it.
              scrolled || solid ? "scale-90 text-base sm:text-lg" : "scale-100 text-lg sm:text-xl",
            )}
          />
        </a>

        <div className="flex items-center gap-4 xl:gap-5">
          {/*
            Inline nav appears at xl, not lg. At lg the six links, their 2rem
            gaps and the Book Now pill totalled roughly the full 1024px, leaving
            the button pressed up against the lockup. Below xl this all lives in
            the drawer, which has room to present it properly.
          */}
          <nav className="hidden items-center gap-7 xl:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={resolve(link.href)}
                className="group relative text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <Button
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            className="hidden xl:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            Book Now
          </Button>

          {/*
            Hamburger — everything below xl. The old -mr-1 pulled it into the
            screen edge, which both looked jammed and put half the tap target
            where thumbs tend to miss. It now sits inside the padding at a full
            44px, the minimum comfortable touch size.
          */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 xl:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Slide-in drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40 xl:hidden">
            <motion.div
              className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            />
            <motion.aside
              {...drawerMotion}
              className="absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col gap-2 bg-navy px-6 pb-8 pt-24"
            >
              <nav className="flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={resolve(link.href)}
                    onClick={() => setOpen(false)}
                    className="border-b border-white/10 py-4 text-lg font-medium text-white/90 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <Button
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-6 w-full"
              >
                <MessageCircle className="h-4 w-4" />
                Book Now
              </Button>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
