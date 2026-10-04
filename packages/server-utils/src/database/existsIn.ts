import type { PgTable } from 'drizzle-orm/pg-core'
import type { z } from 'zod'

/**
 * Key under which `existsIn` stores its `{ table, column }` metadata on a zod
 * schema instance. Declared with `Symbol.for` so the same key is resolved even
 * if multiple copies of the package are loaded.
 */
export const EXISTS_IN = Symbol.for('lifeforge.existsIn')

/**
 * Describes a referenced-record requirement attached to a field schema by
 * `existsIn`. `column` defaults to the table's primary key when omitted.
 */
export interface ExistenceCheck {
  table: PgTable
  column?: string
}

/**
 * Strongly-typed shape of `forge.existsIn`, constrained to the module's tables.
 */
export type ExistsInFor<TTables extends Record<string, PgTable>> = <
  T extends z.ZodTypeAny,
  TTable extends TTables[keyof TTables]
>(
  schema: T,
  table: TTable,
  column?: keyof TTable['_']['columns']
) => T

/**
 * Annotates a field schema as a foreign-key reference that must exist before the
 * route runs. The schema instance is returned unchanged, so `z.infer` and the
 * generated JSON schema are unaffected; the metadata is stored on the schema
 * itself under a hidden symbol.
 *
 * @example
 * ```ts
 * input: {
 *   body: z.object({
 *     calendarId: forge.existsIn(z.string().optional(), calendars),
 *     categoryIds: forge.existsIn(z.array(z.string()), categories),
 *     authorEmail: forge.existsIn(z.string(), users, 'email')
 *   })
 * }
 * ```
 */
export function existsIn<T extends z.ZodTypeAny, TTable extends PgTable>(
  schema: T,
  table: TTable,
  column?: keyof TTable['_']['columns']
): T {
  ;(schema as unknown as Record<symbol, ExistenceCheck | undefined>)[
    EXISTS_IN
  ] = {
    table,
    column: column as string | undefined
  }

  return schema
}
