/**
 * Lightweight in-process rate limiter for server actions.
 * Keyed by an arbitrary string (e.g. IP, "admin").
 * Not distributed — resets on cold start, which is acceptable for an admin
 * passcode endpoint that handles low traffic.
 */

const store = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true if the caller is within their allowed quota.
 * @param key     Unique identifier for the rate-limit bucket.
 * @param limit   Max allowed calls in the window.
 * @param windowMs Window duration in milliseconds.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
