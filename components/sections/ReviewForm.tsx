"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { contact } from "@/lib/content";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "review-photos";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "mt-2 w-full rounded-xl border border-border bg-surface-alt px-4 py-3 type-body text-ink " +
  "placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none " +
  "focus:ring-2 focus:ring-accent/70";

/** Turn a month picker value ("2026-10") into a clean label ("October 2026"). */
function formatTravelMonth(v: string): string | null {
  const t = v.trim();
  if (!t) return null;
  const m = /^(\d{4})-(\d{2})$/.exec(t);
  if (!m) return t;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, 1);
  return Number.isNaN(d.getTime())
    ? t
    : d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/**
 * "Write a review" form for a trip. Saves straight to Supabase: the photo (if
 * any) is uploaded to the public `review-photos` bucket, then a row is
 * inserted into `reviews` (approved = false by default). Nothing is published
 * until the owner approves it in the Supabase dashboard and the site rebuilds.
 */
export function ReviewForm({ tripTitle, tripSlug }: { tripTitle: string; tripSlug: string }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [travelMonth, setTravelMonth] = useState("");
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [botcheck, setBotcheck] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [ratingError, setRatingError] = useState(false);
  const [requiredError, setRequiredError] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fileKey, setFileKey] = useState(0);

  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoError("");
    if (file && !file.type.startsWith("image/")) {
      setPhoto(null);
      setPhotoError("Please choose an image file.");
      setFileKey((k) => k + 1);
      return;
    }
    if (file && file.size > MAX_PHOTO_BYTES) {
      setPhoto(null);
      setPhotoError("That photo is over 5 MB — please choose a smaller one.");
      setFileKey((k) => k + 1);
      return;
    }
    setPhoto(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Honeypot filled → pretend success, send nothing.
    if (botcheck) {
      setStatus("success");
      return;
    }
    const missingRequired = !name.trim() || !quote.trim();
    setRequiredError(missingRequired);
    setRatingError(rating < 1);
    if (missingRequired || rating < 1) return;

    setStatus("submitting");
    try {
      if (!supabase) throw new Error("Supabase is not configured");

      const photoPaths: string[] = [];
      if (photo) {
        const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${tripSlug}/${Date.now()}-${safeName}`;
        const { data, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, photo, { contentType: photo.type, upsert: false });
        if (uploadError) throw uploadError;
        photoPaths.push(data.path);
      }

      const { error } = await supabase.from("reviews").insert({
        package_slug: tripSlug,
        name: name.trim(),
        location: location.trim() || null,
        rating,
        travel_month: formatTravelMonth(travelMonth),
        title: title.trim() || null,
        quote: quote.trim(),
        photo_paths: photoPaths,
      });
      if (error) throw error;

      setStatus("success");
      setName("");
      setLocation("");
      setRating(0);
      setTravelMonth("");
      setTitle("");
      setQuote("");
      setPhoto(null);
      setFileKey((k) => k + 1);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card p-6 sm:p-8">
      <h3 className="type-h3 text-ink">Write a review</h3>
      <p className="type-small mt-2 text-muted">
        Been on the {tripTitle}? Tell others how it went. Reviews are published once we&rsquo;ve
        approved them.
      </p>

      <div aria-live="polite" className="contents">
        {status === "success" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="type-body mt-4 text-ink">
              Thanks! Your review will appear once we&rsquo;ve approved it.
            </p>
            <Button
              type="button"
              variant="outline-dark"
              className="mt-6"
              onClick={() => setStatus("idle")}
            >
              Write another review
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`review-name-${tripSlug}`} className="type-small font-medium text-ink">
                  Your name <span className="text-accent-ink">*</span>
                </label>
                <input
                  id={`review-name-${tripSlug}`}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor={`review-location-${tripSlug}`} className="type-small font-medium text-ink">
                  Location <span className="text-muted">(optional)</span>
                </label>
                <input
                  id={`review-location-${tripSlug}`}
                  name="location"
                  type="text"
                  placeholder="e.g. London, UK"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label htmlFor={`review-travel-${tripSlug}`} className="type-small font-medium text-ink">
                When did you travel? <span className="text-muted">(optional)</span>
              </label>
              <input
                id={`review-travel-${tripSlug}`}
                name="travel_month"
                type="month"
                value={travelMonth}
                onChange={(e) => setTravelMonth(e.target.value)}
                className={inputClasses}
              />
            </div>

            <fieldset>
              <legend className="type-small font-medium text-ink">
                Your rating <span className="text-accent-ink">*</span>
              </legend>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={n}
                      checked={rating === n}
                      onChange={() => {
                        setRating(n);
                        setRatingError(false);
                      }}
                      className="peer sr-only"
                    />
                    <span className="sr-only">
                      {n} {n === 1 ? "star" : "stars"}
                    </span>
                    <Star
                      aria-hidden="true"
                      className={cn(
                        "h-8 w-8 rounded transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent/70",
                        n <= rating ? "fill-accent text-accent" : "text-border hover:text-accent/60",
                      )}
                    />
                  </label>
                ))}
              </div>
              {ratingError && (
                <p className="type-small mt-2 text-red-600" role="alert">
                  Please choose a star rating.
                </p>
              )}
            </fieldset>

            <div>
              <label htmlFor={`review-title-${tripSlug}`} className="type-small font-medium text-ink">
                Review title <span className="text-muted">(optional)</span>
              </label>
              <input
                id={`review-title-${tripSlug}`}
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor={`review-text-${tripSlug}`} className="type-small font-medium text-ink">
                Your review <span className="text-accent-ink">*</span>
              </label>
              <textarea
                id={`review-text-${tripSlug}`}
                name="quote"
                rows={5}
                required
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="What was the trek like? Guides, route, highlights…"
                className={cn(inputClasses, "resize-y")}
              />
            </div>

            <div>
              <label htmlFor={`review-photo-${tripSlug}`} className="type-small font-medium text-ink">
                Photo <span className="text-muted">(optional)</span>
              </label>
              <input
                key={fileKey}
                id={`review-photo-${tripSlug}`}
                name="attachment"
                type="file"
                accept="image/*"
                onChange={onPhoto}
                className="mt-2 block w-full type-small text-muted file:mr-4 file:rounded-full file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:font-medium file:text-accent-ink"
              />
              <p className="type-small mt-1 text-muted">
                Max 5 MB, image files only.
              </p>
              {photoError && (
                <p className="type-small mt-1 text-red-600" role="alert">
                  {photoError}
                </p>
              )}
            </div>

            {/* Honeypot — see EnquiryForm. */}
            <div aria-hidden="true" className="sr-only">
              <label htmlFor={`review-botcheck-${tripSlug}`}>Leave this field empty</label>
              <input
                id={`review-botcheck-${tripSlug}`}
                name="botcheck"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={botcheck}
                onChange={(e) => setBotcheck(e.target.value)}
              />
            </div>

            {requiredError && (
              <p className="type-small text-red-600" role="alert">
                Please fill in your name and review.
              </p>
            )}

            {status === "error" && (
              <p className="type-small text-red-600">
                Sorry, we couldn&rsquo;t submit your review right now. Please try again, or{" "}
                <a href={`mailto:${contact.email}`} className="font-semibold underline underline-offset-2">
                  email us
                </a>{" "}
                if it keeps failing.
              </p>
            )}

            <Button
              type="submit"
              disabled={status === "submitting"}
              className="w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" ? "Sending…" : "Submit review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
