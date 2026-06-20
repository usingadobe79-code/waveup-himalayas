# 02 — Architecture & Tech Decisions

## Stack
| Layer            | Choice                            | Why                                            |
|------------------|-----------------------------------|------------------------------------------------|
| Framework        | **Next.js 15 (App Router) + TS**  | Modern React, SSR/SSG, great DX                |
| Styling          | **Tailwind CSS**                  | Fast, consistent, easy to theme brand tokens   |
| UI motion        | **Framer Motion** (`motion`)      | Scroll reveals, stagger, layout, transitions   |
| 3D               | **React Three Fiber** + **drei**  | Three.js in React; drei = camera/loaders/env   |
| Scroll control   | **GSAP + ScrollTrigger**          | Precise scroll-timeline for the 3D rise        |
| Smooth scroll    | **Lenis**                         | Smooth inertia scroll, pairs with heavy motion |
| Icons            | **lucide-react**                  | Clean line icons for service cards             |
| 3D assets        | **Higgsfield** (LATER)            | Generated mountain/heli assets, added post-v1  |

## v1 scope
**Landing page only.** Sections per the wireframe (header → hero → scroll-rise →
services → featured packages → offers → regions → why-us → gallery → testimonials
→ CTA band → footer).

## Proposed structure
```
waveup-himalayas/
├── app/
│   ├── layout.tsx            # fonts, metadata, Lenis provider
│   ├── page.tsx              # landing page composition
│   └── globals.css           # tailwind + brand tokens
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── sections/Hero.tsx
│   ├── sections/ScrollRise.tsx
│   ├── sections/Services.tsx
│   ├── sections/FeaturedPackages.tsx
│   ├── sections/Offers.tsx
│   ├── sections/Regions.tsx
│   ├── sections/WhyUs.tsx
│   ├── sections/Gallery.tsx
│   ├── sections/Testimonials.tsx
│   └── sections/CtaBand.tsx
├── components/three/
│   ├── HeroSceneA.tsx        # real 3D range, mouse-reactive (default)
│   ├── HeroSceneB.tsx        # layered depth planes + fog + particles
│   ├── HeroSceneC.tsx        # floating 3D model over styled bg
│   ├── Mountains.tsx         # procedural terrain (placeholder until Higgsfield)
│   └── RiseSequence.tsx      # the scroll-driven camera-up-the-mountain
├── components/ui/            # Button, Card, SectionHeading, etc.
├── lib/
│   ├── content.ts            # all content from docs/03-content.md as typed data
│   ├── motion.ts             # shared variants, eases, durations
│   └── useReducedMotion.ts
├── public/images/            # photos (placeholders v1)
├── public/models/            # 3D assets (Higgsfield, later)
└── docs/                     # these prep docs
```

## Hero variants (mock-test all three)
Build a tiny toggle (e.g. `?hero=a|b|c` query param, or a dev-only switcher) so
Sandip can compare A/B/C live without code edits.
- **A** (default): real 3D Himalayan range, orbits subtly with mouse, drifting
  clouds + sun. Heaviest.
- **B**: layered parallax depth planes + volumetric fog + particle snow. Lighter.
- **C**: a single 3D model (helicopter or peak) slow-rotating over a styled
  navy→sunset gradient background.

## Performance budget
- Target 60fps desktop on the hero and rise sequence.
- Lazy-load 3D (`dynamic(() => ..., { ssr:false })`), suspense fallback = static
  brand-colored poster image.
- Cap pixel ratio at 1.5–2. Use `<AdaptiveDpr>` / `<Preload all />` from drei.
- Respect `prefers-reduced-motion`: 3D becomes a static render, Framer transitions
  shorten/disable.
- **Mobile:** attempt full 3D first. If it lags, fall back to static hero poster +
  CSS parallax. Decide after testing on a real phone (per Sandip).

## Data approach
All copy/packages/contact live in `lib/content.ts` as typed constants sourced from
docs/03-content.md — single source of truth, no hardcoded strings in components.

## Deploy (later)
Vercel is the natural target for Next.js. Out of v1 scope but keep build clean.
