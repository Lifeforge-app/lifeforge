import { defineRelations } from 'drizzle-orm'

import type { ResolvedModuleSchema } from '@lifeforge/module-runtime/registry'

/**
 * Merges every registered schema part into the single global relations config
 * used by `drizzle({ relations })`.
 */
export function composeRelations(parts: readonly ResolvedModuleSchema[]) {
  const tables = Object.assign({}, ...parts.map(part => part.tables))

  return defineRelations(tables, (r: any) =>
    Object.assign({}, ...parts.map(part => part.relations(r)))
  )
}
