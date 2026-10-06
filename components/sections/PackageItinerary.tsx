import type { Itinerary } from "@/lib/content";

/**
 * Renders a package itinerary using only existing design-system tokens (no new
 * visual style). Two layouts:
 *  - "days"     → a numbered day-by-day timeline (route, altitude · duration,
 *                 description and/or highlights), plus any trip notes.
 *  - "schedule" → time → activity rows for flight/heli tours, plus peaks & notes.
 * All values come straight from content.ts (client-supplied; nothing computed).
 */
export function PackageItinerary({ itinerary }: { itinerary: Itinerary }) {
  return itinerary.kind === "schedule" ? (
    <ScheduleView itinerary={itinerary} />
  ) : (
    <DaysView itinerary={itinerary} />
  );
}

function DaysView({ itinerary }: { itinerary: Extract<Itinerary, { kind: "days" }> }) {
  const { days, notes } = itinerary;
  return (
    <div className="mt-6">
      <ol>
        {days.map((d, i) => {
          const meta = [d.altitude, d.duration].filter((x) => x && x !== "—");
          const main = d.description ?? d.highlights;
          // Only when a day has BOTH a description and separate highlights.
          const extra = d.description && d.highlights ? d.highlights : null;
          const last = i === days.length - 1;
          return (
            <li key={d.day} className="flex gap-4 sm:gap-5">
              {/* Day marker + connecting rail */}
              <div className="flex flex-col items-center">
                <span className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent-ink">
                  {d.day}
                </span>
                {!last && <span aria-hidden="true" className="w-px flex-1 bg-border" />}
              </div>

              {/* Day content */}
              <div className={last ? "pb-1" : "pb-8"}>
                <p className="type-small font-semibold uppercase tracking-wide text-muted">
                  Day {d.day}
                </p>
                <h3 className="type-body mt-0.5 font-semibold text-ink">{d.route}</h3>
                {meta.length > 0 && (
                  <p className="type-small mt-1 text-muted">
                    {meta.map((m, mi) => (
                      <span key={`${m}-${mi}`}>
                        {mi > 0 && <span className="px-1.5 text-accent-ink">·</span>}
                        {m}
                      </span>
                    ))}
                  </p>
                )}
                {main && <p className="type-small mt-2 text-muted">{main}</p>}
                {extra && (
                  <p className="type-small mt-1.5 text-muted">
                    <span className="font-medium text-accent-ink">Highlights — </span>
                    {extra}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {notes && notes.length > 0 && <Notes notes={notes} />}
    </div>
  );
}

function ScheduleView({
  itinerary,
}: {
  itinerary: Extract<Itinerary, { kind: "schedule" }>;
}) {
  const { sections, peaks, notes } = itinerary;
  return (
    <div className="mt-6 space-y-8">
      {sections.map((section, si) => (
        <div key={`${section.title ?? "sec"}-${si}`}>
          {section.title && (
            <h3 className="type-body mb-3 font-semibold text-ink">{section.title}</h3>
          )}
          <ul className="overflow-hidden rounded-card border border-border bg-surface-alt">
            {section.rows.map((r, ri) => (
              <li
                key={`${r.time}-${r.activity}-${ri}`}
                className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:gap-5"
              >
                <span className="type-small shrink-0 font-semibold text-accent-ink sm:w-36">
                  {r.time}
                </span>
                <span className="type-small text-muted">{r.activity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {peaks && peaks.length > 0 && (
        <div>
          <h3 className="type-body mb-3 font-semibold text-ink">Peaks you&rsquo;ll see</h3>
          <ul className="flex flex-wrap gap-2">
            {peaks.map((p) => (
              <li
                key={p}
                className="type-small rounded-badge border border-border bg-surface-alt px-3 py-1 text-ink"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {notes && notes.length > 0 && <Notes notes={notes} />}
    </div>
  );
}

/** Shared "Good to know" block — trip notes / permits / cancellation policy. */
function Notes({ notes }: { notes: string[] }) {
  return (
    <div className="mt-8 rounded-card border border-border bg-surface-alt p-5">
      <p className="type-eyebrow mb-3">Good to know</p>
      <ul className="space-y-1.5">
        {notes.map((n) => (
          <li key={n} className="type-small text-muted">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}
