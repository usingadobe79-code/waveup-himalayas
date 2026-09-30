"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, ChevronDown, Clock, Mail, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { contact } from "@/lib/content";

/**
 * Public by design — Web3Forms access keys are meant to live in client code
 * (the form posts straight to their API; there is no backend in this static
 * export to keep it secret behind).
 */
const WEB3FORMS_ACCESS_KEY = "7eb98f77-94cb-4ce1-b1be-6fd9637ee410";

const TRIP_INTERESTS = [
  "Trekking",
  "Helicopter Tours",
  "Mountain Flights",
  "City Tours",
  "Jungle Safari",
  "Custom Trip",
  "Not sure yet",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

type FormState = {
  name: string;
  email: string;
  phone: string;
  tripInterest: string;
  preferredStartDate: string;
  groupSize: string;
  message: string;
  botcheck: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  tripInterest: "Not sure yet",
  preferredStartDate: "",
  groupSize: "",
  message: "",
  botcheck: "",
};

const inputClasses =
  "mt-2 w-full rounded-xl border border-border bg-surface-alt px-4 py-3 type-body text-ink " +
  "placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none " +
  "focus:ring-2 focus:ring-accent/70";

// Computed once at module load — today's date in YYYY-MM-DD, used as the
// `min` for the date picker so past dates can't be selected.
const today = new Date().toISOString().split("T")[0];

/**
 * "Plan Your Trip" enquiry section (docs/03 has no online checkout — this is
 * the site's real contact form). Client-side only: submits straight to
 * Web3Forms, which emails the owner. Two columns on desktop (pitch + contact
 * details / the form card), single column on mobile.
 */
export function EnquiryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [dateActive, setDateActive] = useState(false);

  const update =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setForm((f) => ({ ...f, [field]: value }));
    };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New trip enquiry — WaveUp Himalayas",
          from_name: "WaveUp Website",
          name: form.name,
          email: form.email,
          phone: form.phone,
          trip_interest: form.tripInterest,
          "Preferred start date": form.preferredStartDate,
          "Group size": form.groupSize,
          message: form.message,
          botcheck: form.botcheck,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm(initialState);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="enquiry" className="section-y bg-surface">
      <div className="container-page">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Plan Your Trip"
          intro="Send us your trip details — dates, group size, what you have in mind — and we'll get back to you with real options, no obligation."
        />

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* Left — pitch + direct contact */}
          <div className="lg:pt-2">
            <h3 className="type-h3 text-ink">Tell us where you want to go</h3>
            <p className="type-body mt-4 text-muted">
              Whether it&rsquo;s the Everest Base Camp trek, a helicopter tour
              over the Khumbu, or a fully custom itinerary — our Thamel-based
              team will read every enquiry and reply with real options,
              usually within 24 hours.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-body text-ink transition-colors hover:text-accent-ink"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="type-body text-ink transition-colors hover:text-accent-ink"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="type-body text-muted">{contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Right — the form */}
          <div className="card p-6 sm:p-8">
            {/* Persistent live region: swaps content on status change so
                screen readers pick up the confirmation / error announcement. */}
            <div aria-live="polite" className="contents">
              {status === "success" ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="type-h3 mt-5 text-ink">Thank you</h3>
                  <p className="type-body mt-2 text-muted">
                    We&rsquo;ve got your enquiry and will be in touch within
                    24 hours.
                  </p>
                  <Button
                    type="button"
                    variant="outline-dark"
                    className="mt-6"
                    onClick={() => setStatus("idle")}
                  >
                    Send another enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" htmlFor="enquiry-name" required>
                      <input
                        id="enquiry-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={update("name")}
                        className={inputClasses}
                      />
                    </Field>
                    <Field label="Email" htmlFor="enquiry-email" required>
                      <input
                        id="enquiry-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={update("email")}
                        className={inputClasses}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone / WhatsApp" htmlFor="enquiry-phone">
                      <input
                        id="enquiry-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={update("phone")}
                        className={inputClasses}
                      />
                    </Field>
                    <Field label="Trip interest" htmlFor="enquiry-trip-interest">
                      <div className="relative">
                        <select
                          id="enquiry-trip-interest"
                          name="trip_interest"
                          value={form.tripInterest}
                          onChange={update("tripInterest")}
                          className={cn(inputClasses, "appearance-none pr-10")}
                        >
                          {TRIP_INTERESTS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                          aria-hidden="true"
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Preferred start date" htmlFor="enquiry-start-date">
                      <input
                        id="enquiry-start-date"
                        name="preferred_start_date"
                        type={dateActive || form.preferredStartDate ? "date" : "text"}
                        min={today}
                        placeholder="Select preferred date"
                        value={form.preferredStartDate}
                        onChange={update("preferredStartDate")}
                        onFocus={() => setDateActive(true)}
                        onBlur={() => setDateActive(false)}
                        className={inputClasses}
                      />
                    </Field>
                    <Field label="Group size" htmlFor="enquiry-group-size">
                      <input
                        id="enquiry-group-size"
                        name="group_size"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g. 2 people"
                        value={form.groupSize}
                        onChange={update("groupSize")}
                        className={inputClasses}
                      />
                    </Field>
                  </div>

                  <Field label="Message" htmlFor="enquiry-message">
                    <textarea
                      id="enquiry-message"
                      name="message"
                      rows={4}
                      placeholder="Tell us a bit about the trip you have in mind…"
                      value={form.message}
                      onChange={update("message")}
                      className={cn(inputClasses, "resize-y")}
                    />
                  </Field>

                  {/* Honeypot — real visitors never see or fill this; if a
                      bot does, Web3Forms silently drops the submission.
                      `sr-only` clips it visually without moving it off the
                      document flow (avoids the horizontal-scroll trap that
                      `left:-9999px` off-screen tricks can cause). */}
                  <div aria-hidden="true" className="sr-only">
                    <label htmlFor="enquiry-botcheck">Leave this field empty</label>
                    <input
                      id="enquiry-botcheck"
                      name="botcheck"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.botcheck}
                      onChange={update("botcheck")}
                    />
                  </div>

                  {status === "error" && (
                    <p className="type-small text-red-600">
                      Something went wrong — please message us on{" "}
                      <a
                        href={contact.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline underline-offset-2"
                      >
                        WhatsApp
                      </a>{" "}
                      or{" "}
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-semibold underline underline-offset-2"
                      >
                        email
                      </a>{" "}
                      instead.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {status === "submitting" ? "Sending…" : "Send Enquiry"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="type-small font-medium text-ink">
        {label}
        {required && <span className="text-accent-ink"> *</span>}
      </label>
      {children}
    </div>
  );
}
