"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { contact } from "@/lib/content";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "review-photos";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_PHOTO_SIDE = 1600;

/**
 * Downscale a photo in the browser (longest side <= 1600px, never upscaled) and
 * re-encode as WebP (JPEG fallback) at 0.8. Falls back to the original file if
 * anything fails, so submission is never blocked.
 */
async function shrinkPhoto(file: File): Promise<{ body: Blob; contentType: string; ext: string | null }> {
  const original = { body: file as Blob, contentType: file.type, ext: null };
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const toBlob = (type: string) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.8));
    const webp = await toBlob("image/webp");
    if (webp && webp.type === "image/webp") return { body: webp, contentType: "image/webp", ext: "webp" };
    const jpeg = await toBlob("image/jpeg");
    if (jpeg && jpeg.type === "image/jpeg") return { body: jpeg, contentType: "image/jpeg", ext: "jpg" };
    return original;
  } catch {
    return original;
  }
}

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "mt-2 w-full rounded-xl border border-border bg-surface-alt px-4 py-3 type-body text-ink " +
  "placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none " +
  "focus:ring-2 focus:ring-accent/70";

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleDateString("en-GB", { month: "long" }),
);
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => THIS_YEAR + 1 - i);

/** Build a clean label ("October 2026") only when both month and year are chosen. */
function formatTravelMonth(month: string, year: string): string | null {
  if (!month || !year) return null;
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
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
  const [travelYear, setTravelYear] = useState("");
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
        const shrunk = await shrinkPhoto(photo);
        let safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        if (shrunk.ext) safeName = `${safeName.replace(/\.[^.]*$/, "")}.${shrunk.ext}`;
        const path = `${tripSlug}/${Date.now()}-${safeName}`;
        const { data, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, shrunk.body, { contentType: shrunk.contentType, upsert: false });
        if (uploadError) throw uploadError;
        photoPaths.push(data.path);
      }

      const { error } = await supabase.from("reviews").insert({
        package_slug: tripSlug,
        name: name.trim(),
        location: location.trim() || null,
        rating,
        travel_month: formatTravelMonth(travelMonth, travelYear),
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
      setTravelYear("");
      setTitle("");
      setQuote("");
      setPhoto(null);
      setFileKey((k) => k + 1);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card overflow-x-clip p-6 sm:p-8">
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
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    id={`review-travel-${tripSlug}`}
                    name="travel_month"
                    value={travelMonth}
                    onChange={(e) => setTravelMonth(e.target.value)}
                    className={cn(inputClasses, "appearance-none pr-10")}
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={String(i + 1)}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                </div>
                <div className="relative">
                  <select
                    id={`review-travel-year-${tripSlug}`}
                    name="travel_year"
                    aria-label="Year of travel"
                    value={travelYear}
                    onChange={(e) => setTravelYear(e.target.value)}
                    className={cn(inputClasses, "appearance-none pr-10")}
                  >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                </div>
              </div>
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
