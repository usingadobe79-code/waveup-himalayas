"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { PackageImage } from "@/components/ui/PackageImage";
import { cn } from "@/lib/cn";
import { packages, priceLabel, services, type Package } from "@/lib/content";

const DEFAULT_CAP = 24;

const serviceTitle = new Map<string, string>(services.map((s) => [s.key, s.title]));

/** Featured first, then the rest, preserving canonical order within each group. */
const ordered: Package[] = [
  ...packages.filter((p) => p.featured),
  ...packages.filter((p) => !p.featured),
];

/**
 * Live, fully client-side search over the bundled packages, with a dropdown of
 * results and service category chips. Self-contained so it can be mounted in the
 * hero now and the header later. The panel is absolutely positioned (z-40, under
 * the z-50 header); ancestors must not clip it.
 */
export function TrekSearch({ className }: { className?: string }) {
  const router = useRouter();
  const uid = useId();
  const listId = `${uid}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = ordered.filter((p) => {
      if (category !== "all" && p.serviceKey !== category) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.region} ${serviceTitle.get(p.serviceKey) ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
    return q || category !== "all" ? filtered : filtered.slice(0, DEFAULT_CAP);
  }, [query, category]);

  // Click-away closes.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted row visible during keyboard navigation.
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${uid}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, uid]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      const hit = results[active];
      if (open && hit) {
        e.preventDefault();
        setOpen(false);
        router.push(`/packages/${hit.slug}`);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const chips = [{ key: "all", title: "All" }, ...services.map((s) => ({ key: s.key, title: s.title }))];

  return (
    <div ref={rootRef} className={cn("relative w-full max-w-2xl text-left", className)}>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/60"
        />
        <input
          type="search"
          role="combobox"
          aria-label="Search treks"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${uid}-opt-${active}` : undefined}
          autoComplete="off"
          value={query}
          placeholder="Search treks, tours, regions…"
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-full bg-white py-4 pl-13 pr-5 text-base text-navy-deep shadow-lg shadow-navy-deep/30 outline-none ring-1 ring-white/40 placeholder:text-navy/50 focus:ring-2 focus:ring-accent"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-3xl bg-white text-navy-deep shadow-2xl shadow-navy-deep/40 ring-1 ring-black/5">
          <div
            role="tablist"
            aria-label="Filter by category"
            className="flex gap-2 overflow-x-auto border-b border-navy/10 px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {chips.map((c) => {
              const on = category === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setCategory(c.key);
                    setActive(0);
                  }}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    on
                      ? "bg-accent text-navy-deep"
                      : "bg-navy/5 text-navy hover:bg-navy/10",
                  )}
                >
                  {c.title}
                </button>
              );
            })}
          </div>

          {results.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-navy/70">
              No treks found — try another word.
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search results" className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
              {results.map((p, i) => {
                const meta = [p.region, p.tripFacts?.duration, priceLabel(p.price)]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li
                    key={p.slug}
                    id={`${uid}-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                  >
                    <Link
                      href={`/packages/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl p-2 transition-colors",
                        i === active ? "bg-navy/5" : "hover:bg-navy/5",
                      )}
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-navy/10">
                        <PackageImage src={p.imageDisplay ?? null} alt="" sizes="56px" quality={60} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-navy-deep">{p.title}</span>
                        <span className="block truncate text-sm text-navy/65">{meta}</span>
                      </span>
                      <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-navy/40" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
