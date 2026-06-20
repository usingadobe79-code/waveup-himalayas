/**
 * Minimal className joiner — filters falsy values and joins with spaces.
 * Avoids pulling in clsx for a project this size.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
