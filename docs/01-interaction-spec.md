# 01 — Motion & 3D Interaction Spec

Personality: **calm, cinematic, premium.** Everything glides; nothing snaps or bounces.
Shared ease (use everywhere unless noted): `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo-ish).

---

## Global
- **Smooth scroll** via Lenis (lerp ~0.1). All scroll-driven 3D reads Lenis progress.
- **Reduced motion:** if `prefers-reduced-motion`, disable Lenis, freeze 3D to a
  static frame, replace entrance animations with instant opacity.
- **Section reveals:** default pattern = children fade + rise 24px, stagger 0.08s,
  duration 0.6s, trigger when 20% in view, play once.

---

## 1. Header
- Transparent over hero. On scroll past hero, background frosts (navy @ ~85% +
  backdrop-blur), shrinks height ~72px→60px, logo scales down slightly.
- Nav links: gold underline wipes in on hover (left→right).
- "Book Now / WhatsApp" button: gold fill, subtle scale 1.0→1.03 + glow on hover.

## 2. Hero  (3D — mock-test A/B/C)
**Content overlay (all variants):**
- Eyebrow tag fades in first (0.0s).
- Headline "Rise Above the Ordinary" — words rise + fade, stagger 0.1s, start 0.3s.
- Sub fades in at 0.9s.
- Two CTAs at 1.1s: "Explore Packages" (gold) + "Plan My Trip" (white outline).
- Scroll chevron at bottom, gentle infinite bounce, fades on first scroll.
- A gold SVG peak mark (echo of logo) draws itself in (stroke-dashoffset) near headline.

**Variant A — real 3D range (default):**
- Procedural/asset Himalayan range, snow material, soft sun + bloom.
- Camera drifts subtly with mouse (parallax, damped, max ±3°).
- Volumetric-ish clouds drift slowly L→R. Slow auto sun-glow pulse.
- On load: camera eases from slightly-zoomed to rest (2s).

**Variant B — layered depth:**
- 4–6 mountain silhouette planes at increasing depth, fog between layers.
- Particle snow drifting. Mouse parallax shifts layers at different rates.
- Lighter GPU cost; strong "modern" feel.

**Variant C — floating model:**
- One 3D model (helicopter or single peak) slow-rotating / bobbing.
- Background: navy→sunset gradient + soft particles. Lightest.

> Toggle via `?hero=a|b|c`. Default = A.

## 3. Scroll-Rise Sequence  ★ signature moment
The "Wave Up" payoff. A tall pinned section right after hero.
- Pin the 3D canvas; map Lenis/scroll progress (0→1) to a **camera flying UP the
  mountain** — from base, past tree line, to summit above the clouds.
- At ~3 scroll stages, captions cross-fade in/out, pinned center or side:
  - Stage 1 (~base): "Every journey begins with a single step."
  - Stage 2 (~mid): "Through valleys, forests, and frozen passes."
  - Stage 3 (~summit): "Until you rise above it all." → reveals a CTA "Find your trek".
- Optional altitude readout counts up (e.g. 2,800m → 5,364m) tied to progress.
- Easing on camera path: smooth, no jerks; use a curve (CatmullRom) for the path.
- Exit: un-pin smoothly into the Services section.

## 4. Services (6 cards)
- Cards stagger-reveal (rise + fade). Icon line-draws on first reveal.
- Hover: card lifts 6px, gold border glow, icon micro-rotate.

## 5. Featured Packages (6)
- Grid reveals row by row.
- Card hover: image scale 1.0→1.08 inside fixed frame (parallax feel), title slides,
  gold "View Details →" arrow nudges right.
- "View All 25 Packages" button: gold underline wipe + arrow.

## 6. Offers (2 promo cards)
- Slide in from opposite sides. Discount badge (-20% / -10%) pops with a slight
  overshoot (the ONE permitted bit of playfulness, very subtle).

## 7. Regions
- Tabbed. Active tab: gold pill that animates position (Framer `layoutId`).
- Panel content cross-fades + slight slide on tab change.

## 8. Why Us
- Points reveal in sequence. Optional count-up stats if we add any (none invented).

## 9. Gallery
- Masonry. Items reveal with scroll, slight scale-from-0.96 + fade, staggered.
- Hover: zoom + navy gradient overlay with caption.

## 10. Testimonials
- 3 cards; carousel optional. Quote marks in gold. Gentle auto-advance (pausable).

## 11. CTA Band
- Subtle 3D/parallax depth background (reuse a cheap layered scene or static).
- Headline reveal + WhatsApp (gold) and Email CTAs.

## 12. Footer
- Quiet. Links underline-wipe on hover. Social icons gold on hover.

---

## Asset list for Higgsfield (LATER — not in v1)
- Himalayan mountain range model / heightmap for Hero A + Rise sequence.
- Optional helicopter model for Hero C.
- Cloud/sky textures, snow normal map.
> v1 uses procedural geometry + provided photos as placeholders. Do NOT block v1 on these.
