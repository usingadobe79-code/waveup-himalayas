import Link from "next/link";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { HeroImageBackground } from "./HeroImageBackground";
import { HeroContent } from "./HeroContent";
import { cn } from "@/lib/cn";
import { type HeroVariant, HERO_VARIANT_LABELS } from "@/lib/hero";

/**
 * Hero section. Background depends on the variant:
 *  - A (default): the Higgsfield image cover + Ken Burns (server-rendered).
 *  - B / C: lazy procedural 3D scenes.
 * The shared animated content overlay + the A/B/C dev switcher sit on top.
 */
export function Hero({ variant }: { variant: HeroVariant }) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-navy-deep">
      {variant === "a" ? <HeroImageBackground /> : <HeroCanvas variant={variant} />}
      <HeroContent />
      <VariantSwitcher active={variant} />
    </section>
  );
}

/** Dev-only A/B/C compare control. Updates ?hero and reloads the variant. */
function VariantSwitcher({ active }: { active: HeroVariant }) {
  return (
    <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1 rounded-full border border-white/15 bg-navy-deep/70 p-1 text-xs backdrop-blur-md">
      <span className="px-2 text-white/40">hero</span>
      {(["a", "b", "c"] as HeroVariant[]).map((v) => (
        <Link
          key={v}
          href={v === "a" ? "/" : `/?hero=${v}`}
          scroll={false}
          title={HERO_VARIANT_LABELS[v]}
          className={cn(
            "rounded-full px-3 py-1 font-medium uppercase transition-colors",
            v === active ? "bg-gold text-navy-deep" : "text-white/70 hover:text-white",
          )}
        >
          {v}
        </Link>
      ))}
    </div>
  );
}
