import { defineRelations } from 'drizzle-orm'

import type { ModuleSchemaDefinition } from '@lifeforge/module-registry'

/**
 * Merges every registered schema part into the single global relations config
 * used by `drizzle({ relations })`.
 */
export function composeRelations(parts: readonly ModuleSchemaDefinition[]) {
  const tables = Object.assign({}, ...parts.map(part => part.tables))

  return defineRelations(tables as any, (r: any) =>
    Object.assign({}, ...parts.map(part => part.relations(r)))
  )
}
