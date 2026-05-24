/** Public site metadata for legal pages, PWA, and store listings. */

export const APP_NAME = "Rasoi";

export const SITE_DESCRIPTION =
  "Homely Indian recipe ideas tailored to your diet, goals, and time to cook.";

/** Production site URL (no trailing slash). Set in Vercel env for accurate legal links. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function getSupportEmail(): string {
  return (
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@example.com"
  );
}

export function privacyUrl(): string {
  return `${getSiteUrl()}/privacy`;
}

export function termsUrl(): string {
  return `${getSiteUrl()}/terms`;
}

export function supportUrl(): string {
  return `${getSiteUrl()}/support`;
}
