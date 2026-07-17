import NodeCache from 'node-cache'

export interface Cache<T = unknown> {
  get(key: string): T | undefined
  set(key: string, value: T, ttl?: number): boolean
  del(key: string): boolean
  has(key: string): boolean
  clear(): void
  keys(): string[]
  readonly size: number
  expiryTime(key: string): number | undefined
}

const instances = new Map<string, NodeCache>()

function getOrCreateNodeCache(
  namespace: string,
  options?: { stdTTL?: number }
): NodeCache {
  if (instances.has(namespace)) {
    return instances.get(namespace)!
  }

  const instance = new NodeCache({
    stdTTL: options?.stdTTL ?? 0,
    checkperiod: 600,
    useClones: false
  })

  instances.set(namespace, instance)

  return instance
}

export function createCache<T = unknown>(
  namespace: string,
  options?: { stdTTL?: number }
): Cache<T> {
  const cache = getOrCreateNodeCache(namespace, options)

  return {
    get(key: string): T | undefined {
      return cache.get<T>(key)
    },
    set(key: string, value: T, ttl?: number): boolean {
      if (ttl !== undefined) {
        return cache.set<T>(key, value, ttl)
      }

      return cache.set<T>(key, value)
    },
    del(key: string): boolean {
      return cache.del(key) > 0
    },
    has(key: string): boolean {
      return cache.get(key) !== undefined
    },
    clear(): void {
      cache.flushAll()
    },
    keys(): string[] {
      return cache.keys().filter(k => cache.get(k) !== undefined)
    },
    get size(): number {
      return cache
        .keys()
        .reduce(
          (count, k) => (cache.get(k) !== undefined ? count + 1 : count),
          0
        )
    },
    expiryTime(key: string): number | undefined {
      return cache.getTtl(key)
    }
  }
}
