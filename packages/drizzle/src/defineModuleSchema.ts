import {
  type RelationsBuilder,
  type RelationsBuilderConfig,
  getTableName
} from 'drizzle-orm'

import type { ModuleSchemaDefinition } from '@lifeforge/module-registry'

/**
 * Scopes the relations helper so bare table keys resolve to their namespaced
 * keys: `r.events` → `r['app__events']` and `r.one.events` → `r.one['app__events']`.
 *
 * Only table keys at the `r` root and on the `one`/`many` helpers are remapped;
 * table builders and columns pass through untouched (so a column named like a
 * table key is not hijacked).
 */
function proxyHelper<T extends object>(
  target: T,
  keyMap: Record<string, string>
): T {
  return new Proxy(target, {
    get(t, prop) {
      if (typeof prop !== 'string') {
        return Reflect.get(t, prop)
      }

      if (prop === 'one' || prop === 'many') {
        const helper = Reflect.get(t, prop) as object

        return new Proxy(helper, {
          get(h, key) {
            if (typeof key !== 'string') {
              return Reflect.get(h, key)
            }

            return Reflect.get(h, keyMap[key] ?? key)
          }
        })
      }

      return Reflect.get(t, keyMap[prop] ?? prop)
    }
  })
}

/** Renames the relations config's top-level keys to their namespaced keys. */
function remapRelations(
  config: Record<string, unknown>,
  keyMap: Record<string, string>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(config).map(([tableKey, relations]) => [
      keyMap[tableKey] ?? tableKey,
      relations
    ])
  )
}

/**
 * Resolves a module's `tables`/`relations` into a registry definition. When
 * `moduleId` is given (app modules), the table keys are auto-prefixed with the
 * module namespace derived from the id, so schema files can use bare names.
 * Core (no id) is left unprefixed.
 *
 * Registration is the caller's job (`ModuleRegistry.registerSchemaPart`).
 */
export function defineModuleSchema<
  TTables extends Record<string, any>,
  TConfig extends RelationsBuilderConfig<TTables>
>(
  tables: TTables,
  relations: (r: RelationsBuilder<TTables>) => TConfig,
  moduleId?: string
): ModuleSchemaDefinition<TTables, (r: RelationsBuilder<TTables>) => TConfig> {
  if (!moduleId) {
    return { tables, relations }
  }

  const keyMap = Object.fromEntries(
    Object.entries(tables).map(([key, table]) => [key, getTableName(table)])
  )

  const prefixedTables = Object.fromEntries(
    Object.entries(tables).map(([key, table]) => [keyMap[key], table])
  )

  const wrappedRelations = (r: RelationsBuilder<TTables>) =>
    remapRelations(
      relations(proxyHelper(r, keyMap)) as Record<string, unknown>,
      keyMap
    )

  return {
    moduleId,
    tables: prefixedTables as TTables,
    relations: wrappedRelations as (r: RelationsBuilder<TTables>) => TConfig,
    keyMap
  }
}
