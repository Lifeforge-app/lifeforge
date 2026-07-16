import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { type Cache, createCache } from '../index'

describe('Cache service', () => {
  let namespaceCounter = 0

  function nextNamespace(prefix: string): string {
    return `${prefix}-${++namespaceCounter}`
  }

  describe('persistent cache (no TTL)', () => {
    let cache: Cache

    beforeEach(() => {
      cache = createCache(nextNamespace('persist'))
    })

    it('get returns undefined for non-existent key', () => {
      expect(cache.get('ghost')).toBeUndefined()
    })

    it('has returns false for non-existent key', () => {
      expect(cache.has('ghost')).toBe(false)
    })

    it('size is 0 and keys is empty for fresh cache', () => {
      expect(cache.size).toBe(0)
      expect(cache.keys()).toEqual([])
    })

    it('set returns true', () => {
      expect(cache.set('key', 'value')).toBe(true)
    })

    it('set and get round-trip string', () => {
      cache.set('str', 'hello')
      expect(cache.get('str')).toBe('hello')
    })

    it('set and get round-trip number', () => {
      cache.set('num', 42)
      expect(cache.get('num')).toBe(42)
    })

    it('set and get round-trip boolean', () => {
      cache.set('bool', true)
      expect(cache.get('bool')).toBe(true)
    })

    it('set and get round-trip null', () => {
      cache.set('nil', null)
      expect(cache.get('nil')).toBeNull()
    })

    it('storing undefined is not supported (returns null)', () => {
      cache.set('undef', undefined)
      expect(cache.get('undef')).toBeNull()
    })

    it('set and get round-trip object', () => {
      const obj = { a: 1, b: { c: 'deep' }, d: [1, 2, 3] }
      cache.set('obj', obj)
      expect(cache.get('obj')).toEqual(obj)
    })

    it('set and get round-trip array', () => {
      const arr = [1, 'two', { three: true }]
      cache.set('arr', arr)
      expect(cache.get('arr')).toEqual(arr)
    })

    it('overwriting a key replaces the value', () => {
      cache.set('key', 'first')
      cache.set('key', 'second')
      expect(cache.get('key')).toBe('second')
    })

    it('has returns true for existing key', () => {
      cache.set('key', 'value')
      expect(cache.has('key')).toBe(true)
    })

    it('has returns false after del', () => {
      cache.set('key', 'value')
      cache.del('key')
      expect(cache.has('key')).toBe(false)
    })

    it('del removes a key and returns true', () => {
      cache.set('key', 'value')
      expect(cache.del('key')).toBe(true)
      expect(cache.get('key')).toBeUndefined()
    })

    it('del on non-existent key returns false', () => {
      expect(cache.del('ghost')).toBe(false)
    })

    it('size reflects number of entries', () => {
      expect(cache.size).toBe(0)
      cache.set('a', 1)
      expect(cache.size).toBe(1)
      cache.set('b', 2)
      cache.set('c', 3)
      expect(cache.size).toBe(3)
      cache.del('b')
      expect(cache.size).toBe(2)
    })

    it('keys returns all stored keys', () => {
      cache.set('z', 1)
      cache.set('a', 2)
      cache.set('m', 3)
      expect(cache.keys().sort()).toEqual(['a', 'm', 'z'])
    })

    it('clear removes all entries', () => {
      cache.set('a', 1)
      cache.set('b', 2)
      cache.clear()
      expect(cache.size).toBe(0)
      expect(cache.get('a')).toBeUndefined()
      expect(cache.get('b')).toBeUndefined()
      expect(cache.keys()).toEqual([])
    })

    it('set-del-set cycle works correctly', () => {
      cache.set('x', 1)
      cache.del('x')
      expect(cache.has('x')).toBe(false)
      cache.set('x', 2)
      expect(cache.get('x')).toBe(2)
    })

    it('keys includes overwritten keys only once', () => {
      cache.set('k', 1)
      cache.set('k', 2)
      cache.set('k', 3)
      expect(cache.keys()).toEqual(['k'])
      expect(cache.size).toBe(1)
    })

    it('handles empty string key', () => {
      cache.set('', 'empty')
      expect(cache.get('')).toBe('empty')
      expect(cache.has('')).toBe(true)
      cache.del('')
      expect(cache.has('')).toBe(false)
    })

    it('handles key with special characters', () => {
      const key = 'user:123:session'
      cache.set(key, 'data')
      expect(cache.get(key)).toBe('data')
    })

    describe('reference integrity (useClones: false)', () => {
      it('mutating retrieved object mutates the cached reference', () => {
        const obj = { count: 0 }
        cache.set('mut', obj)

        const retrieved = cache.get('mut')! as typeof obj
        retrieved.count += 5

        const reRetrieved = cache.get('mut')! as typeof obj
        expect(reRetrieved.count).toBe(5)
      })

      it('storing a function preserves identity', () => {
        function fn(): string {
          return 'hello'
        }

        cache.set('fn', fn)
        expect(cache.get('fn')).toBe(fn)
      })

      it('storing a Date preserves its methods', () => {
        const date = new Date('2024-01-15T12:00:00Z')
        cache.set('date', date)

        const retrieved = cache.get('date')! as Date
        expect(retrieved).toBeInstanceOf(Date)
        expect(retrieved.toISOString()).toBe('2024-01-15T12:00:00.000Z')
      })
    })
  })

  describe('TTL cache (with expiry)', () => {
    let cache: Cache

    beforeEach(() => {
      vi.useFakeTimers()

      cache = createCache('ttl-test', { stdTTL: 2 })
      cache.clear()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('key is available before TTL expires', () => {
      cache.set('key', 'value')
      vi.advanceTimersByTime(1000)
      expect(cache.get('key')).toBe('value')
    })

    it('key expires after TTL (get returns undefined)', () => {
      cache.set('key', 'value')
      vi.advanceTimersByTime(3000)
      expect(cache.get('key')).toBeUndefined()
    })

    it('has returns false for expired key', () => {
      cache.set('key', 'value')
      vi.advanceTimersByTime(3000)
      expect(cache.has('key')).toBe(false)
    })

    it('expiryTime returns a future timestamp for a fresh key', () => {
      cache.set('key', 'value')
      const expiry = cache.expiryTime('key')
      expect(expiry).toBeGreaterThan(Date.now())
    })

    it('per-key TTL overrides default stdTTL', () => {
      cache.set('short', 'a', 1)
      cache.set('long', 'b', 5)

      vi.advanceTimersByTime(1500)

      expect(cache.get('short')).toBeUndefined()
      expect(cache.get('long')).toBe('b')
    })

    it('per-key TTL of 0 makes a key persistent in a TTL cache', () => {
      cache.set('persist', 'forever', 0)
      vi.advanceTimersByTime(10_000)
      expect(cache.get('persist')).toBe('forever')
    })

    it('set without TTL uses the default stdTTL', () => {
      cache.set('key', 'value')
      vi.advanceTimersByTime(1500)
      expect(cache.get('key')).toBe('value')
      vi.advanceTimersByTime(1000)
      expect(cache.get('key')).toBeUndefined()
    })

    it('size drops when key expires', () => {
      cache.set('k1', 1)
      cache.set('k2', 2, 5)
      expect(cache.size).toBe(2)

      vi.advanceTimersByTime(3000)

      // k1 expired (2s default), k2 still alive (5s)
      expect(cache.size).toBe(1)
      expect(cache.get('k2')).toBe(2)
    })

    it('keys excludes expired entries', () => {
      cache.set('a', 1)
      cache.set('b', 2, 5)
      expect(cache.keys().sort()).toEqual(['a', 'b'])

      vi.advanceTimersByTime(3000)

      // 'a' expired, only 'b' remains
      expect(cache.keys()).toEqual(['b'])
    })

    it('expiryTime returns undefined for non-existent key', () => {
      expect(cache.expiryTime('ghost')).toBeUndefined()
    })

    it('expiryTime returns undefined for expired key', () => {
      cache.set('key', 'value')
      vi.advanceTimersByTime(3000)
      expect(cache.expiryTime('key')).toBeUndefined()
    })

    it('overwriting a key resets its TTL', () => {
      cache.set('key', 'v1')
      vi.advanceTimersByTime(1500)
      cache.set('key', 'v2')
      vi.advanceTimersByTime(1500)
      // total elapsed: 3000ms. Original key would have expired.
      // But overwrite at 1500ms reset TTL, so should still be alive.
      expect(cache.get('key')).toBe('v2')
    })
  })

  describe('persistent cache with stdTTL: 0', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('key never expires even after a long time', () => {
      const cache = createCache(nextNamespace('unlimited'), { stdTTL: 0 })
      cache.set('key', 'value')
      vi.advanceTimersByTime(86_400_000)
      expect(cache.get('key')).toBe('value')
    })

    it('expiryTime returns 0 for persistent key', () => {
      const cache = createCache(nextNamespace('unlimited-expiry'), { stdTTL: 0 })
      cache.set('key', 'value')
      expect(cache.expiryTime('key')).toBe(0)
    })
  })

  describe('default persistent (no options passed)', () => {
    it('key never expires', () => {
      const cache = createCache(nextNamespace('default-persist'))
      cache.set('key', 'value')
      expect(cache.get('key')).toBe('value')
      expect(cache.expiryTime('key')).toBe(0)
    })
  })

  describe('singleton / namespace isolation', () => {
    it('same namespace returns the same underlying cache', () => {
      const a = createCache('shared-ns')
      const b = createCache('shared-ns')

      a.set('key', 'from-a')
      expect(b.get('key')).toBe('from-a')
    })

    it('different namespaces are fully isolated', () => {
      const ns1 = createCache('ns-one')
      const ns2 = createCache('ns-two')

      ns1.set('key', 'from-one')
      ns2.set('key', 'from-two')

      expect(ns1.get('key')).toBe('from-one')
      expect(ns2.get('key')).toBe('from-two')
    })

    it('different namespaces with same TTL are isolated', () => {
      const a = createCache('ttl-a', { stdTTL: 10 })
      const b = createCache('ttl-b', { stdTTL: 10 })

      a.set('x', 1)
      b.set('x', 2)

      expect(a.get('x')).toBe(1)
      expect(b.get('x')).toBe(2)
    })

    it('persistent and TTL namespaces are independent', () => {
      const persist = createCache('mix-persist')
      const ttl = createCache('mix-ttl', { stdTTL: 10 })

      persist.set('key', 'persist')
      ttl.set('key', 'ttl')

      expect(persist.get('key')).toBe('persist')
      expect(ttl.get('key')).toBe('ttl')
    })
  })

  describe('stress / edge cases', () => {
    it('handles large number of entries', () => {
      const cache = createCache(nextNamespace('stress-many'))
      const n = 1000

      for (let i = 0; i < n; i++) {
        cache.set(`key-${i}`, { index: i, value: `val-${i}` })
      }

      expect(cache.size).toBe(n)
      expect(cache.get('key-0')).toEqual({ index: 0, value: 'val-0' })
      expect(cache.get('key-999')).toEqual({ index: 999, value: 'val-999' })
    })

    it('handles rapid set-del cycles on the same key', () => {
      const cache = createCache(nextNamespace('stress-churn'))

      for (let i = 0; i < 100; i++) {
        cache.set('key', i)
        expect(cache.get('key')).toBe(i)
        cache.del('key')
        expect(cache.get('key')).toBeUndefined()
      }
    })

    it('del then del again is idempotent', () => {
      const cache = createCache(nextNamespace('stress-deldel'))
      cache.set('key', 'value')
      expect(cache.del('key')).toBe(true)
      expect(cache.del('key')).toBe(false)
      expect(cache.get('key')).toBeUndefined()
    })

    it('clear on already empty cache is harmless', () => {
      const cache = createCache(nextNamespace('stress-clearempty'))
      cache.clear()
      expect(cache.size).toBe(0)
      cache.set('key', 'value')
      cache.clear()
      cache.clear()
      expect(cache.size).toBe(0)
    })
  })
})
