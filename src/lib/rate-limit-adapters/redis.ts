// Production rate-limiting boundary (not wired). Implement with Upstash/Redis in production.

export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

export class InMemoryRateLimitStore implements RateLimitStore {
  private buckets = new Map<string, { count: number; resetAt: number }>();
  async increment(key: string, windowMs: number) {
    const now = Date.now();
    const b = this.buckets.get(key);
    if (!b || b.resetAt <= now) {
      const v = { count: 1, resetAt: now + windowMs };
      this.buckets.set(key, v);
      return v;
    }
    b.count += 1;
    return b;
  }
}

// Placeholder for a Redis-backed store; implement using ioredis/upstash client.
export class RedisRateLimitStore implements RateLimitStore {
  constructor(private url: string, private token: string) {}
  async increment(_key: string, _windowMs: number): Promise<{ count: number; resetAt: number }> {
    throw new Error("RedisRateLimitStore not implemented. Configure Upstash/Redis.");
  }
}