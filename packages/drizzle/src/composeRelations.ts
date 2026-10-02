import { defineRelations } from 'drizzle-orm'

import { DrizzleSchemaRegistry } from './registry/DrizzleSchemaRegistry'

export function composeRelations() {
  const parts = DrizzleSchemaRegistry.parts
  const tables = Object.assign({}, ...parts.map(part => part.tables))

  return defineRelations(tables as any, (r: any) =>
    Object.assign({}, ...parts.map(part => part.relations(r)))
  )
}
