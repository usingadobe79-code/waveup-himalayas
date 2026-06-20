# KICKOFF — paste this as your first message to Claude Code

You are building the production landing page for **WaveUp Himalayas**, a Nepal-based
travel company. This is a heavy-3D, motion-rich modern marketing site.

## First, read the brief
Before writing any code, read these files in full and treat them as the source of truth:
- `docs/01-interaction-spec.md` — all motion & 3D behavior
- `docs/02-architecture.md` — stack, file structure, performance budget
- `docs/03-content.md` — ALL real business content (use exact values)
- `docs/04-brand.md` — colors, type, voice

## Then propose, don't sprint
After reading, give me a short build plan and confirm the file structure before
scaffolding. Wait for my OK on the plan. Then build incrementally, section by section,
running the dev server so we can verify each piece.

## Hard rules
- **Scope = landing page only** for v1. No other pages yet.
- **Do not invent** prices, itineraries, day-counts, reviews, or contact details.
  Use only what's in `docs/03-content.md`. Bookings route to WhatsApp/email — no checkout.
- Build the **three hero variants (A/B/C)** with a `?hero=a|b|c` toggle so I can compare.
  Default = A. (See spec §2.)
- **No Higgsfield 3D assets yet** — use procedural geometry + placeholder images.
  Keep `public/models/` ready for real assets later.
- Respect `prefers-reduced-motion` everywhere; lazy-load all 3D with a static fallback.
- Brand hex values in `docs/04-brand.md` are eyeball-matched from the logo, not final —
  centralize them as tokens so they're trivial to swap before launch.

## Stack (already decided — see architecture doc)
Next.js 15 (App Router, TS) · Tailwind · Framer Motion · React Three Fiber + drei ·
GSAP ScrollTrigger · Lenis · lucide-react.

## Start
1. Read the four docs.
2. Confirm Node is fine (v24.15.0 is installed).
3. Give me the build plan + the exact `create-next-app` command you'll run.
4. Wait for my go-ahead.
