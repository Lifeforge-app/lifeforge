import type { PgTable } from 'drizzle-orm/pg-core'
import type { z } from 'zod'

/**
 * Key under which `existsIn` stores its `{ table, select }` metadata on a zod
 * schema instance. Declared with `Symbol.for` so the same key is resolved even
 * if multiple copies of the package are loaded.
 */
export const EXISTS_IN = Symbol.for('lifeforge.existsIn')

/**
 * Phantom key used to carry the guarded table through the type system. It is
 * never read at runtime; `existsIn` only attaches the `EXISTS_IN` metadata.
 */
export declare const EXISTS_IN_TABLE: unique symbol

/**
 * Describes a referenced-record requirement attached to a field schema by
 * `existsIn`. Records are always matched on the table's primary key.
 */
export interface ExistenceCheck {
  table: PgTable
  select?: boolean
}

/**
 * Type-level mirror of `ExistenceCheck`, linked to the field schema by
 * `existsIn` so route callbacks can only read guarded tables.
 */
export interface GuardMeta<TTable extends PgTable, TSelect extends boolean> {
  table: TTable
  select: TSelect
}

/**
 * A zod schema that `existsIn` has annotated. `TSelect` records whether the
 * guard was asked to keep the row for `existing.one(...)`.
 */
export type GuardedSchema<
  T extends z.ZodTypeAny,
  TTable extends PgTable,
  TSelect extends boolean
> = T & { readonly [EXISTS_IN_TABLE]: GuardMeta<TTable, TSelect> }

/**
 * Extracts every table guarded with `{ select: true }` from an input schema,
 * looking through the wrappers that appear in route definitions. Wrappers it
 * does not understand yield `never`, so a route using one fails to compile
 * instead of silently allowing unguarded tables.
 */
export type SelectableTables<T> = T extends {
  readonly [EXISTS_IN_TABLE]: GuardMeta<infer TTable, true>
}
  ? TTable
  : T extends z.ZodObject<infer TShape, infer _TConfig>
    ? SelectableTables<TShape[keyof TShape]>
    : T extends z.ZodOptional<infer TInner>
      ? SelectableTables<TInner>
      : T extends z.ZodNullable<infer TInner>
        ? SelectableTables<TInner>
        : T extends z.ZodDefault<infer TInner>
          ? SelectableTables<TInner>
          : T extends z.ZodArray<infer TInner>
            ? SelectableTables<TInner>
            : never

/**
 * Strongly-typed shape of `forge.existsIn`, constrained to the module's tables.
 */
export type ExistsInFor<TTables extends Record<string, PgTable>> = {
  <T extends z.ZodTypeAny, TTable extends TTables[keyof TTables]>(
    schema: T,
    table: TTable,
    options: { select: true }
  ): GuardedSchema<T, TTable, true>

  <T extends z.ZodTypeAny, TTable extends TTables[keyof TTables]>(
    schema: T,
    table: TTable,
    options?: { select?: false }
  ): GuardedSchema<T, TTable, false>
}

/**
 * Annotates a field schema as a foreign-key reference that must exist before the
 * route runs. The referenced record is always looked up by the table's primary
 * key. The schema instance is returned unchanged, so `z.infer` and the generated
 * JSON schema are unaffected; the metadata is stored on the schema itself under
 * a hidden symbol.
 *
 * Pass `{ select: true }` to keep the referenced row available to the callback
 * as `existing.one(table, value)`.
 *
 * @example
 * ```ts
 * input: {
 *   body: z.object({
 *     calendarId: forge.existsIn(z.string().optional(), calendars),
 *     categoryIds: forge.existsIn(z.array(z.string()), categories),
 *     eventId: forge.existsIn(z.string(), events, { select: true })
 *   })
 * }
 * ```
 */
export function existsIn<T extends z.ZodTypeAny, TTable extends PgTable>(
  schema: T,
  table: TTable,
  options: { select: true }
): GuardedSchema<T, TTable, true>

export function existsIn<T extends z.ZodTypeAny, TTable extends PgTable>(
  schema: T,
  table: TTable,
  options?: { select?: false }
): GuardedSchema<T, TTable, false>

export function existsIn(
  schema: z.ZodTypeAny,
  table: PgTable,
  options?: { select?: boolean }
): z.ZodTypeAny {
  ;(schema as unknown as Record<symbol, ExistenceCheck | undefined>)[
    EXISTS_IN
  ] = {
    table,
    select: options?.select === true
  }

  return schema
}
