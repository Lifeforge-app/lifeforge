/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AnyRelationsBuilderConfig,
  ExtractTablesFromSchema,
  ExtractTablesWithRelations,
  Schema,
  Table,
  View
} from 'drizzle-orm'

export type SchemaEntry = Table | View

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
 * A resolved schema definition as stored in `ModuleRegistry`. `tables`/`keyMap`
 * are namespaced when a module id was provided; `relations` is the (possibly
 * proxied) callback. `schemaParts` are composed into the global `db`.
 */
export interface ModuleSchemaDefinition<
  TTables = Record<string, SchemaEntry>,
  TRelations = (r: any) => Record<string, any>
> {
  moduleId?: string
  tables: TTables
  relations: TRelations
  /** Bare table key -> namespaced registry key. */
  keyMap?: Record<string, string>
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
