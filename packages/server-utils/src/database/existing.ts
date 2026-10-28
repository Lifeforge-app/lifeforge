import type { InferSelectModel } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'
import { getTableConfig } from 'drizzle-orm/pg-core'

import ClientError from '../response/ClientError'

type Row = Record<string, unknown>

/**
 * Rows collected by `existsIn(..., { select: true })`, keyed by table and by
 * the table's primary key.
 */
export class ExistingStore {
  private readonly rows = new Map<PgTable, Map<unknown, Row>>()

  record(options: { table: PgTable; key: string; rows: Row[] }): void {
    const { table, key, rows } = options

    if (rows.length === 0) {
      return
    }

    let keyed = this.rows.get(table)

    if (!keyed) {
      keyed = new Map()
      this.rows.set(table, keyed)
    }

    for (const row of rows) {
      keyed.set(row[key], row)
    }
  }

  one<T extends PgTable>(table: T, value: unknown): InferSelectModel<T> {
    if (value !== undefined && value !== null) {
      const row = this.rows.get(table)?.get(value)

      if (row) {
        return row as InferSelectModel<T>
      }
    }

    throw new ClientError(
      `Related "${getTableConfig(table).name}" record not found for ${String(value)}`,
      404
    )
  }

  all<T extends PgTable>(table: T): InferSelectModel<T>[] {
    return [...(this.rows.get(table)?.values() ?? [])] as InferSelectModel<T>[]
  }
}

/**
 * Callback-facing surface of `ExistingStore`, restricted to the tables the
 * route actually guarded with `{ select: true }`.
 */
export interface ExistingRecords<TGuarded extends PgTable = never> {
  one<T extends TGuarded>(table: T, value: unknown): InferSelectModel<T>
  all<T extends TGuarded>(table: T): InferSelectModel<T>[]
}
