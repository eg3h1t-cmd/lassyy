// Rate limiting with an optional shared Upstash Redis backend.
// Without Upstash env vars, falls back to a per-process in-memory limiter
// (suitable for local development only, not multi-instance production).

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

async function upstashIncrement(key: string, windowMs: number): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PEXPIRE", key, windowMs, "NX"],
      ]),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Array<{ result?: number }>;
    const count = json?.[0]?.result;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}

export async function checkRateLimitAsync(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const count = await upstashIncrement(key, windowMs);
  if (count !== null) {
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  }
  return checkRateLimit(key, limit, windowMs);
}