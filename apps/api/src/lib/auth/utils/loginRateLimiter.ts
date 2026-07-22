import NodeCache from 'node-cache'

interface AttemptRecord {
  count: number
  blockedUntil: number
}

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 })

const THRESHOLDS = [
  { maxAttempts: 3, cooldownMs: 0 },
  { maxAttempts: 6, cooldownMs: 5_000 },
  { maxAttempts: 9, cooldownMs: 30_000 },
  { maxAttempts: Infinity, cooldownMs: 300_000 }
]

function getCooldown(count: number): number {
  for (const tier of THRESHOLDS) {
    if (count <= tier.maxAttempts) return tier.cooldownMs
  }

  return 300_000
}

export function checkLoginRateLimit(ip: string): boolean {
  const record = cache.get<AttemptRecord>(ip)

  if (!record) return true

  if (record.blockedUntil > 0 && Date.now() < record.blockedUntil) {
    return false
  }

  return true
}

export function recordFailedLogin(ip: string): void {
  const record = cache.get<AttemptRecord>(ip) || { count: 0, blockedUntil: 0 }

  record.count++

  const cooldown = getCooldown(record.count)

  record.blockedUntil = cooldown > 0 ? Date.now() + cooldown : 0

  cache.set(ip, record)
}

export function clearLoginRateLimit(ip: string): void {
  cache.del(ip)
}
