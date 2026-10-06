import type { TripFacts as TripFactsData } from "@/lib/content";

/** Display order + labels for the Trip Facts box. */
const FACT_ROWS: { key: keyof TripFactsData; label: string }[] = [
  { key: "duration", label: "Duration" },
  { key: "difficulty", label: "Difficulty" },
  { key: "maxAltitude", label: "Max altitude" },
  { key: "bestSeason", label: "Best season" },
  { key: "groupSize", label: "Group size" },
  { key: "accommodation", label: "Accommodation" },
  { key: "meals", label: "Meals" },
  { key: "trekDistance", label: "Trek distance" },
  { key: "startEndPoint", label: "Start / End point" },
];

/**
 * Quick-reference facts box (duration, difficulty, altitude, etc.) for a
 * package's detail page. Only the sub-fields a trip actually has are shown;
 * renders nothing when `facts` has none set, so packages without Trip Facts
 * data are unaffected.
 */
export function TripFacts({ facts }: { facts: TripFactsData }) {
  const rows = FACT_ROWS.filter(({ key }) => facts[key]);
  if (rows.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-5 rounded-card border border-border bg-surface-alt p-6 sm:grid-cols-3">
      {rows.map(({ key, label }) => (
        <div key={key}>
          <dt className="type-small font-medium uppercase tracking-wide text-muted">{label}</dt>
          <dd className="type-body mt-1 font-semibold text-ink">{facts[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
