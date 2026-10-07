import type { Itinerary } from "@/lib/content";

/**
 * Renders a package itinerary using only existing design-system tokens (no new
 * visual style). Two layouts:
 *  - "days"     → a day-by-day accordion (route, altitude · duration,
 *                 description and/or highlights, optional photo), plus any
 *                 trip notes.
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

/**
 * Day-by-day accordion — plain `<details>/<summary>` per day (same
 * static-safe approach as PackageFaq, so it needs no JS and works unchanged
 * in the static export). The first day starts expanded; the rest start
 * collapsed. Each day's description/highlights and optional photo
 * (`imageDisplay`) are revealed on expand.
 */
function DaysView({ itinerary }: { itinerary: Extract<Itinerary, { kind: "days" }> }) {
  const { days, notes } = itinerary;
  return (
    <div className="mt-6">
      <div className="space-y-3">
        {days.map((d, i) => {
          const meta = [d.altitude, d.duration].filter((x) => x && x !== "—");
          const main = d.description ?? d.highlights;
          // Only when a day has BOTH a description and separate highlights.
          const extra = d.description && d.highlights ? d.highlights : null;
          return (
            <details
              key={d.day}
              open={i === 0}
              className="group rounded-card border border-border bg-surface-alt p-5"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span>
                  <span className="type-small block font-semibold uppercase tracking-wide text-muted">
                    Day {d.day}
                  </span>
                  <span className="type-body mt-0.5 block font-semibold text-ink">
                    {d.route}
                  </span>
                  {meta.length > 0 && (
                    <span className="type-small mt-1 block text-muted">
                      {meta.map((m, mi) => (
                        <span key={`${m}-${mi}`}>
                          {mi > 0 && <span className="px-1.5 text-accent-ink">·</span>}
                          {m}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="mt-1 h-5 w-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                >
                  <path
                    d="M5 7.5l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>

              {(main || extra || d.imageDisplay) && (
                <div className="mt-3">
                  {main && <p className="type-small text-muted">{main}</p>}
                  {extra && (
                    <p className="type-small mt-1.5 text-muted">
                      <span className="font-medium text-accent-ink">Highlights — </span>
                      {extra}
                    </p>
                  )}
                  {d.imageDisplay && (
                    <img
                      src={d.imageDisplay}
                      alt={`Day ${d.day} — ${d.route}`}
                      loading="lazy"
                      className="mt-3 max-h-80 w-full rounded-card object-cover"
                    />
                  )}
                </div>
              )}
            </details>
          );
        })}
      </div>

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
