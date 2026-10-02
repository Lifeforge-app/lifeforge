export {
  DrizzleSchemaRegistry,
  type DrizzleSchemaPart,
  type SchemaEntry
} from './registry/DrizzleSchemaRegistry'

export { defineModuleSchema } from './defineModuleSchema'

export { type BuiltModuleSchema, type ModuleSchema } from './types'

export { composeRelations } from './composeRelations'

export type { AnyRelations, RelationsBuilder } from 'drizzle-orm'

export type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
