/** Hero A/B/C mock-test toggle (docs/01 §2, docs/02). Default = A. */
export type HeroVariant = "a" | "b" | "c";

const VARIANTS: HeroVariant[] = ["a", "b", "c"];

export const HERO_VARIANT_LABELS: Record<HeroVariant, string> = {
  a: "A · Himalaya video",
  b: "B · Layered depth",
  c: "C · Floating model",
};

/** Parse the `?hero=` query value; anything invalid falls back to A. */
export function parseHeroVariant(value: string | string[] | undefined): HeroVariant {
  const v = Array.isArray(value) ? value[0] : value;
  return VARIANTS.includes(v as HeroVariant) ? (v as HeroVariant) : "a";
}
