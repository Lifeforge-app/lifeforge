import type {
  AnyRelationsBuilderConfig,
  ExtractTablesFromSchema,
  ExtractTablesWithRelations,
  Schema
} from 'drizzle-orm'

/**
 * A module's schema declaration: its tables plus the raw `defineRelations`
 * callback. This is what `schema.drizzle.ts` exports and what
 * `createForgeContractBuilder` accepts to register + type the module.
 */
export interface ModuleSchema<
  TTables extends Record<string, any> = Record<string, any>
> {
  tables: TTables
  relations: (r: any) => Record<string, any>
}

/**
 * Resolves a `ModuleSchema` to the built relations type that drizzle's
 * relational query builder (`db.query.*`) expects.
 */
export type BuiltModuleSchema<T extends ModuleSchema> =
  ExtractTablesWithRelations<
    ReturnType<T['relations']> & AnyRelationsBuilderConfig,
    ExtractTablesFromSchema<T['tables']> & Schema
  >
