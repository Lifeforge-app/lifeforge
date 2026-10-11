/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AnyRelationsBuilderConfig,
  ExtractTablesFromSchema,
  ExtractTablesWithRelations,
  Schema,
  Table,
  View
} from 'drizzle-orm'

/** A single table or view in a module's schema. */
export type ModuleTable = Table | View

/**
 * The raw schema a module declares in `schema.drizzle.ts`: its tables plus the
 * `defineRelations` callback. Consumed by `defineModuleSchema` /
 * `createForgeContractBuilder`.
 */
export interface ModuleSchema<
  TTables extends Record<string, any> = Record<string, any>
> {
  tables: TTables
  relations: (r: any) => Record<string, any>
}

/**
 * The normalized schema stored in `ModuleRegistry` (produced by
 * `defineModuleSchema`). When a module id was provided, `tables`/`keyMap` are
 * namespaced and `relations` is wrapped to resolve bare table keys. Registered
 * parts are composed into the global `db`.
 */
export interface ResolvedModuleSchema<
  TTables = Record<string, ModuleTable>,
  TRelations = (r: any) => Record<string, any>
> {
  moduleId?: string
  tables: TTables
  relations: TRelations
  /** Bare table key -> namespaced registry key. */
  keyMap?: Record<string, string>
}

/**
 * The built relations type produced from a `ModuleSchema`, matching what
 * drizzle's relational query builder (`db.query.*`) expects.
 */
export type BuiltModuleSchema<T extends ModuleSchema> =
  ExtractTablesWithRelations<
    ReturnType<T['relations']> & AnyRelationsBuilderConfig,
    ExtractTablesFromSchema<T['tables']> & Schema
  >
