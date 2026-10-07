"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Client-side "wishlist" of saved package slugs — no server/db in this
 * static export, so the whole feature lives in localStorage. Every read/write
 * is wrapped in try/catch: private browsing / blocked storage must degrade to
 * "nothing saved", never crash the page.
 */
const STORAGE_KEY = "waveup:wishlist";

/** Fired on `window` after every `toggle()` so every mounted instance of this
 *  hook (header count, every card's heart, the /wishlist page) re-reads
 *  localStorage and stays in sync — the native `storage` event alone doesn't
 *  fire in the tab that made the change, only in *other* tabs. */
const CHANGE_EVENT = "wishlist:change";

function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function writeWishlist(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Private mode / blocked storage — the toggle just won't persist.
  }
}

/**
 * Backs the wishlist feature (heart buttons, header count, /wishlist page).
 *
 * SSR/hydration safety: this is a static export, so this component's first
 * render happens with no localStorage available at all. `saved` therefore
 * always STARTS empty and is only populated from localStorage in a
 * post-mount effect — the prerendered HTML and the first client paint match
 * exactly (every heart renders "not saved" until mount, then corrects
 * itself), so there's no hydration mismatch.
 */
export function useWishlist() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(readWishlist());

    const onChange = () => setSaved(readWishlist());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    // Re-read from localStorage (the source of truth) rather than trusting
    // possibly-stale React state, so two components toggling in quick
    // succession never clobber each other.
    const current = readWishlist();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    writeWishlist(next);
    setSaved(next);
    try {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    } catch {
      // Ignore — worst case, other mounted instances miss this one update.
    }
  }, []);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return { saved, isSaved, toggle, count: saved.length };
}
