interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

function cleanup() {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) {
      store.delete(key)
    }
  }
}

export interface RateLimitResult {
  limited: boolean
  remaining: number
  reset: number
}

/**
 * Check rate limit for a given IP and route group.
 * @param ip       Client IP address
 * @param group    Route group identifier (e.g. 'auth', 'cotacao', 'billing')
 * @param limit    Max requests allowed per window
 * @param windowMs Window duration in milliseconds (default: 60 000ms = 1 min)
 */
export function checkRateLimit(
  ip: string,
  group: string,
  limit: number,
  windowMs = 60_000
): RateLimitResult {
  cleanup()

  const key = `${group}:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { limited: false, remaining: limit - 1, reset: now + windowMs }
  }

  entry.count += 1

  if (entry.count > limit) {
    return { limited: true, remaining: 0, reset: entry.resetAt }
  }

  return { limited: false, remaining: limit - entry.count, reset: entry.resetAt }
}

/**
 * Extract the real client IP from a Next.js request.
 * Vercel sets x-forwarded-for; falls back to 'unknown'.
 */
export function getClientIp(request: Request): string {
  const xff = (request.headers as Headers).get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return 'unknown'
}
