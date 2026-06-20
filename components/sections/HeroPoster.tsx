/**
 * Static hero poster — brand-colored navy→sunset gradient.
 * Serves three jobs: Suspense fallback while the 3D chunk loads, the
 * reduced-motion fallback, and the base layer behind every variant.
 * Pure CSS, no JS — safe to render server-side.
 */
export function HeroPoster() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Deep navy base, warming toward a sunset glow near the horizon */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy to-[#3a3252]" />
      {/* Sunset bloom, lower third */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(120%_80%_at_50%_115%,rgba(212,178,100,0.55),rgba(184,146,62,0.18)_38%,transparent_70%)]" />
      {/* Soft sun-glow disc, upper right */}
      <div className="absolute right-[18%] top-[26%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(247,247,245,0.5),rgba(212,178,100,0.18)_45%,transparent_70%)] blur-2xl" />
      {/* Subtle vignette for text legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_30%,transparent_45%,rgba(17,28,51,0.55))]" />
    </div>
  );
}
