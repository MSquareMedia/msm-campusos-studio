import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting that actually holds.
 *
 * The previous in-process Map counted per serverless instance, so the real
 * ceiling was the stated limit multiplied by however many instances Vercel
 * happened to spin up, useless against the case that matters here, which is
 * someone looping a script against an endpoint that bills a model API per
 * call.
 *
 * This uses Redis (Vercel KV / Upstash), so the count is shared across every
 * instance and survives cold starts. When Redis is not configured it falls
 * back to the in-memory limiter and says so once in the logs, rather than
 * silently running unlimited.
 */

type Result = { success: boolean; remaining: number };

const memory = new Map<string, { count: number; resetAt: number }>();
let warned = false;

function redisConfigured(): boolean {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
      (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
  );
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/** Limiters are cached per bucket: constructing one per request would open a
 *  new client on every invocation. */
const limiters = new Map<string, Ratelimit>();

function getLimiter(bucket: string, limit: number, windowSeconds: number): Ratelimit | null {
  const cached = limiters.get(bucket);
  if (cached) return cached;
  const redis = getRedis();
  if (!redis) return null;
  const limiter = new Ratelimit({
    redis,
    // Sliding window rather than fixed: a fixed window lets someone spend the
    // whole allowance at 59s and the whole next allowance at 61s.
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    prefix: `rl:${bucket}`,
    analytics: false,
  });
  limiters.set(bucket, limiter);
  return limiter;
}

function memoryLimit(key: string, limit: number, windowSeconds: number): Result {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now > entry.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true, remaining: limit - 1 };
  }
  entry.count += 1;
  return { success: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}

export async function rateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<Result> {
  if (!redisConfigured()) {
    if (!warned) {
      warned = true;
      console.warn(
        "[rate-limit] No Redis configured (UPSTASH_REDIS_REST_URL / KV_REST_API_URL). " +
          "Falling back to per-instance memory, which does NOT hold across serverless instances."
      );
    }
    return memoryLimit(`${bucket}:${identifier}`, limit, windowSeconds);
  }

  const limiter = getLimiter(bucket, limit, windowSeconds);
  if (!limiter) return memoryLimit(`${bucket}:${identifier}`, limit, windowSeconds);

  try {
    const { success, remaining } = await limiter.limit(identifier);
    return { success, remaining };
  } catch (error) {
    // A Redis outage must not take the site's forms down with it. Degrade to
    // the local limiter, which is weaker but still bounded.
    console.error("[rate-limit] Redis call failed, using memory fallback.", error);
    return memoryLimit(`${bucket}:${identifier}`, limit, windowSeconds);
  }
}

/** Best-effort client identity. Vercel sets x-forwarded-for at the edge. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
