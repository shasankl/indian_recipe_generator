/**
 * In-memory rate limit for POST /api/recipe. Fixed window per IP (window length 1 hour).
 * Suitable for a single Node instance; use Redis/Upstash when you scale horizontally.
 */

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60 * 60 * 1000;

function sweepExpired(now: number) {
  if (buckets.size < 500) return;
  for (const [ip, b] of buckets) {
    if (now >= b.windowStart + WINDOW_MS) buckets.delete(ip);
  }
}

function clientIpFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export function getRecipeClientIp(req: Request): string {
  return clientIpFromRequest(req);
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function checkRecipeRateLimit(ip: string): RateLimitResult {
  const raw = process.env.RECIPE_RATE_LIMIT_PER_HOUR;
  const maxPerHour = raw === undefined ? 30 : parseInt(raw, 10);
  if (!Number.isFinite(maxPerHour) || maxPerHour <= 0) return { ok: true };

  const now = Date.now();
  sweepExpired(now);

  let b = buckets.get(ip);
  if (!b || now >= b.windowStart + WINDOW_MS) {
    b = { count: 0, windowStart: now };
  }

  if (b.count >= maxPerHour) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((b.windowStart + WINDOW_MS - now) / 1000),
    );
    buckets.set(ip, b);
    return { ok: false, retryAfterSec };
  }

  b.count += 1;
  buckets.set(ip, b);
  return { ok: true };
}
