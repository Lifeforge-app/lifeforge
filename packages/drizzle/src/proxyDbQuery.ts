const RAW_DB = Symbol.for('lifeforge.rawDb')

/**
 * Wraps a drizzle db so `db.query.<bareKey>` resolves to the module's namespaced
 * registry key. The raw db is exposed under a symbol so it can be re-scoped.
 */
export function proxyDbQuery<TDb extends object>(
  db: TDb,
  keyMap: Record<string, string>
): TDb {
  return new Proxy(db, {
    get(target, prop) {
      if (prop === RAW_DB) {
        return target
      }

      if (prop === 'query') {
        const query = Reflect.get(target, prop) as object

        return new Proxy(query, {
          get(q, key) {
            if (typeof key === 'string' && keyMap[key]) {
              return Reflect.get(q, keyMap[key])
            }

            return Reflect.get(q, key)
          }
        })
      }

      if (prop === 'transaction') {
        const transaction = Reflect.get(target, prop) as (
          callback: (tx: TDb) => unknown,
          ...args: unknown[]
        ) => unknown

        return (callback: (tx: TDb) => unknown, ...args: unknown[]) =>
          transaction.call(
            target,
            (tx: TDb) => callback(proxyDbQuery(tx, keyMap)),
            ...args
          )
      }

      const value = Reflect.get(target, prop)

      return typeof value === 'function' ? value.bind(target) : value
    }
  })
}

/**
 * Returns a db scoped to a module's `keyMap` (bare `db.query` keys). When `db`
 * is already a scoped proxy, its raw db is unwrapped first, so this can
 * re-scope it for another module (e.g. external event getters).
 */
export function scopeDbForModule<TDb extends object>(
  db: TDb,
  keyMap: Record<string, string> | undefined
): TDb {
  if (!keyMap) {
    return db
  }

  const raw = ((db as Record<symbol, unknown>)[RAW_DB] as TDb | undefined) ?? db

  return proxyDbQuery(raw, keyMap)
}
