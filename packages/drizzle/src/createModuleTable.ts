import { pgTableCreator } from 'drizzle-orm/pg-core'

import {
  deriveModuleNamespace,
  resolveCallerModuleId
} from '@lifeforge/module-registry'

/**
 * Returns a `pgTable` builder that auto-prefixes DB table names with the module
 * namespace derived from the caller module id, so schema files declare bare
 * names:
 *
 * ```ts
 * const pgTable = createModuleTable()
 *
 * export const events = pgTable('events', { ... }) // DB table: calendar__events
 * ```
 *
 * Pass `prefix` to override auto-detection (e.g. in scripts/tests).
 */
export function createModuleTable(prefix?: string) {
  const resolved =
    prefix !== undefined
      ? `${prefix.replace(/-/g, '_')}__`
      : (() => {
          const moduleId = resolveCallerModuleId()

          if (!moduleId) {
            throw new Error(
              'createModuleTable: could not resolve the caller module id; pass a prefix explicitly'
            )
          }

          return `${deriveModuleNamespace(moduleId)}__`
        })()

  return pgTableCreator(name => `${resolved}${name}`)
}
