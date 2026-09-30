"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { contact, services, regions, serviceCount } from "@/lib/content";

type NavItem = { label: string; href: string; count?: number };
type NavGroup = { key: string; label: string; items: NavItem[]; viewAll?: NavItem };

/**
 * Packages dropdown — the 6 services from content.ts, each pre-filtering
 * /packages via hash (PackagesBrowser reads the hash and opens on the
 * matching pill). Trailing slash before the hash matches Footer's plain-<a>
 * convention for this route (avoids an extra redirect hop under trailingSlash).
 */
const packagesMenu: NavItem[] = services.map((s) => ({
  label: s.title,
  href: `/packages/#${s.key}`,
  count: serviceCount(s.key),
}));

/**
 * Regions dropdown — the region buckets from content.ts. Each links to
 * /packages/#<regionKey>; PackagesBrowser tags every region group with a
 * matching id, so the browser (via SmoothScroll's global arrival-hash effect)
 * lands right on that region's trips instead of the flat top of the page.
 */
const regionsMenu: NavItem[] = regions.map((r) => ({
  label: r.label,
  href: `/packages/#${r.key}`,
  count: r.packages.length,
}));

/** About dropdown — section anchors, resolved off-home via resolve(). */
const aboutMenu: NavItem[] = [
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const navGroups: NavGroup[] = [
  { key: "packages", label: "Packages", items: packagesMenu, viewAll: { label: "View all packages", href: "/packages" } },
  { key: "regions", label: "Regions", items: regionsMenu },
  { key: "about", label: "About", items: aboutMenu },
];

const blogLink: NavItem = { label: "Blog", href: "/blog" };

/**
 * Sticky header. Transparent over the hero; frosts + shrinks once scrolled past
 * the hero (docs/01 §1). Inline nav from `xl` up; below `xl` the nav collapses
 * into a hamburger that opens a slide-in drawer (logo left, hamburger right).
 *
 * `solid` forces the frosted state — used on sub-pages (e.g. /packages) whose
 * heroes aren't full-height, so the nav never sits transparent over light copy.
 * Off the homepage, section anchors resolve to "/#section" so they navigate
 * home first; the home smooth-scroll/pin handling lives in SmoothScroll.
 *
 * Desktop nav is grouped into three hover/focus dropdowns (Packages, Regions,
 * About) plus a plain Blog link — a mega-menu in miniature, matching how
 * higher-end trekking sites organize a large catalog without a busy top bar.
 */
export function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const frosted = scrolled || open || solid;

  // The drawer renders through a portal (see below); portals need document.body,
  // which only exists after mount.
  useEffect(() => setMounted(true), []);

  // Off-home, prefix section anchors so they route back to the homepage section.
  // Full paths (e.g. "/blog", "/packages/#trekking") already resolve on their
  // own — don't double-prefix them.
  const resolve = (hash: string) => (hash.startsWith("/") ? hash : onHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the drawer is open (also drops
  // any open desktop dropdown, in case both somehow ended up open together).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close a desktop dropdown on an outside click.
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [openMenu]);

  // Clear any pending close timer on unmount.
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openNow = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  // Small delay so moving from the trigger down into the panel (or briefly off
  // it) doesn't snap the menu shut — the hover equivalent of a debounce.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 180);
  };
  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(null);
  };

  const toggleSection = (key: string) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const drawerMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { duration: 0.4, ease: EASE_OUT_EXPO },
      };

  return (
    <>
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
            Inline nav appears at xl, not lg. At lg the four groups, their 2rem
            gaps and the Book Now pill totalled roughly the full 1024px, leaving
            the button pressed up against the lockup. Below xl this all lives in
            the drawer, which has room to present it properly.

            Packages / Regions / About open on hover (with a close delay, see
            scheduleClose) AND on keyboard focus — focusing into the group (the
            trigger or any of its panel links) opens it; moving focus out closes
            it. An outside click and Escape both close whatever is open.
          */}
          <nav ref={navRef} className="hidden items-center gap-7 xl:flex">
            {navGroups.map((group) => {
              const isOpen = openMenu === group.key;
              return (
                <div
                  key={group.key}
                  className="relative"
                  onMouseEnter={() => openNow(group.key)}
                  onMouseLeave={scheduleClose}
                  onFocus={() => openNow(group.key)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) closeNow();
                  }}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => setOpenMenu((k) => (k === group.key ? null : group.key))}
                    className="group relative flex items-center gap-1 text-sm font-medium text-white/85 transition-colors hover:text-white"
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)]",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
                  </button>

                  {/*
                    Always rendered (not mount/unmount via AnimatePresence) so
                    every sub-link is real, crawlable markup in the static
                    export — same as the flat nav it replaces, which was only
                    ever CSS-hidden below `xl`, never conditionally mounted.
                    Visibility + the reveal animation are driven by `isOpen`;
                    `tabIndex={-1}` while closed keeps keyboard users from
                    tabbing into an invisible panel.
                  */}
                  <motion.div
                    initial={false}
                    animate={isOpen ? "open" : "closed"}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: reduced ? 0 : 8 },
                    }}
                    transition={{ duration: reduced ? 0 : 0.2, ease: EASE_OUT_EXPO }}
                    aria-hidden={!isOpen}
                    className={cn(
                      "absolute left-0 top-full mt-3 w-64 overflow-hidden rounded-card border border-border bg-surface-alt py-2 shadow-card-hover",
                      isOpen ? "pointer-events-auto" : "pointer-events-none",
                    )}
                  >
                    {group.items.map((item) => (
                      <a
                        key={item.href}
                        href={resolve(item.href)}
                        tabIndex={isOpen ? undefined : -1}
                        onClick={closeNow}
                        className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface hover:text-accent-ink"
                      >
                        <span>{item.label}</span>
                        {item.count !== undefined && (
                          <span className="text-xs font-normal text-muted">{item.count}</span>
                        )}
                      </a>
                    ))}
                    {group.viewAll && (
                      <a
                        href={resolve(group.viewAll.href)}
                        tabIndex={isOpen ? undefined : -1}
                        onClick={closeNow}
                        className="mt-1 block border-t border-border px-4 pt-3 pb-1.5 text-sm font-semibold text-accent-ink transition-colors hover:text-accent"
                      >
                        {group.viewAll.label}
                      </a>
                    )}
                  </motion.div>
                </div>
              );
            })}

            <a
              href={resolve(blogLink.href)}
              className="group relative text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {blogLink.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
            </a>
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
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 xl:hidden"
          >
            {/* Always the hamburger: the drawer covers this button once open,
                so closing is handled by the X inside the drawer itself. */}
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      </header>

      {/*
        Mobile drawer — portaled to <body>, NOT nested in <header>.

        The header gains `backdrop-blur` while the menu is open, and
        backdrop-filter makes an element the containing block for its
        position:fixed descendants. A drawer nested in the 60px-tall header was
        therefore clamped to 60px: its background painted only in that top strip
        while the links overflowed over the hero, which read as a see-through
        menu. Rendering on document.body escapes that ancestor so the fixed
        overlay fills the whole viewport and the panel background covers it.

        Packages / Regions / About become expandable accordion sections here
        (tap the row to reveal its sub-links); Blog stays a direct link.
      */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[60] xl:hidden">
                <motion.div
                  className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                />
                {/* Site navy at 60% + heavy blur: the hero behind softens to an
                    unreadable wash while the menu text stays legible. Height is
                    content-sized (no h-full) so the panel hangs from the top like
                    a card; the full-screen scrim behind still dims the rest and
                    closes on tap. Rounded bottom-left finishes the hanging edge. */}
                <motion.aside
                  {...drawerMotion}
                  className="absolute right-0 top-0 flex max-h-full w-[82%] max-w-sm flex-col overflow-y-auto rounded-bl-2xl bg-navy/60 px-6 pb-8 pt-5 shadow-[-8px_0_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                >
                  {/* Close control lives in the drawer — the header's toggle is
                      covered while open. Labelled, 44px. */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="type-eyebrow text-accent">Menu</span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                      className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <nav className="flex flex-col">
                    {navGroups.map((group) => {
                      const expanded = !!openSections[group.key];
                      return (
                        <div key={group.key} className="border-b border-white/10">
                          <button
                            type="button"
                            onClick={() => toggleSection(group.key)}
                            aria-expanded={expanded}
                            className="flex w-full items-center justify-between py-4 text-lg font-medium text-white/90 transition-colors hover:text-gold"
                          >
                            {group.label}
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 shrink-0 transition-transform duration-300 ease-[var(--ease-out-expo)]",
                                expanded && "rotate-180",
                              )}
                              aria-hidden="true"
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT_EXPO }}
                                className="overflow-hidden"
                              >
                                <div className="flex flex-col pb-3 pl-1">
                                  {group.items.map((item) => (
                                    <a
                                      key={item.href}
                                      href={resolve(item.href)}
                                      onClick={() => setOpen(false)}
                                      className="flex items-center justify-between gap-3 py-2.5 text-base text-white/75 transition-colors hover:text-gold"
                                    >
                                      <span>{item.label}</span>
                                      {item.count !== undefined && (
                                        <span className="text-xs text-white/45">{item.count}</span>
                                      )}
                                    </a>
                                  ))}
                                  {group.viewAll && (
                                    <a
                                      href={resolve(group.viewAll.href)}
                                      onClick={() => setOpen(false)}
                                      className="mt-1 py-2.5 text-base font-semibold text-gold"
                                    >
                                      {group.viewAll.label}
                                    </a>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                    <a
                      href={resolve(blogLink.href)}
                      onClick={() => setOpen(false)}
                      className="border-b border-white/10 py-4 text-lg font-medium text-white/90 transition-colors hover:text-gold"
                    >
                      {blogLink.label}
                    </a>
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
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
