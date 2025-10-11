// Basit in-memory rate limiting (production'da Redis kullan)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMinutes: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now()
  const windowMs = windowMinutes * 60 * 1000

  // Cleanup expired entries
  for (const [k, v] of rateLimitMap.entries()) {
    if (v.resetAt < now) {
      rateLimitMap.delete(k)
    }
  }

  const entry = rateLimitMap.get(key)

  if (!entry || entry.resetAt < now) {
    // New window
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}
