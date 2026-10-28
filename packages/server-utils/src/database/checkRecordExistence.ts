import { getTableColumns, inArray } from 'drizzle-orm'
import {
  type PgColumn,
  type PgTable,
  getTableConfig
} from 'drizzle-orm/pg-core'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { z } from 'zod'

import ClientError from '../response/ClientError'
import { ExistingStore } from './existing'
import { collectExistenceChecks } from './walk'

interface ExistenceGroup {
  table: PgTable
  column: PgColumn
  key: string
  select: boolean
  values: Map<unknown, string[]>
}

type Row = Record<string, unknown>

function resolveColumn(table: PgTable): PgColumn {
  const tableName = getTableConfig(table).name

  const primary = getTableConfig(table).columns.find(col => col.primary)

  if (!primary || primary.name !== 'id') {
    throw new Error(
      `existsIn requires a single "id" primary key on table "${tableName}".`
    )
  }

  return primary
}

/**
 * Maps a column back to its drizzle property name, which is the key used in the
 * rows returned by `select()`. These differ when a column's name and property
 * name are not identical.
 */
function resolveColumnKey(table: PgTable, column: PgColumn): string {
  for (const [key, value] of Object.entries(getTableColumns(table))) {
    if (value === column) {
      return key
    }
  }

  return column.name
}

/**
 * Runs every `existsIn` pre-flight check for a parsed request, throwing a
 * `404 ClientError` if any referenced record is missing.
 *
 * Checks are batched per table using a single `IN (...)` query against the
 * table's primary key. Tables flagged with `{ select: true }` fetch full rows
 * and are returned in an `ExistingStore` so callbacks can read them through
 * `existing.one(...)`.
 */
export async function checkRecordExistence(options: {
  db: PostgresJsDatabase
  querySchema?: z.ZodTypeAny
  query?: unknown
  bodySchema?: z.ZodTypeAny
  body?: unknown
}): Promise<ExistingStore> {
  const { db, querySchema, query, bodySchema, body } = options

  const store = new ExistingStore()

  const checks = [
    ...collectExistenceChecks(querySchema, query, 'query'),
    ...collectExistenceChecks(bodySchema, body, 'body')
  ]

  if (checks.length === 0) {
    return store
  }

  const groups: ExistenceGroup[] = []

  for (const check of checks) {
    const column = resolveColumn(check.table)

    let group = groups.find(entry => entry.table === check.table)

    if (!group) {
      group = {
        table: check.table,
        column,
        key: resolveColumnKey(check.table, column),
        select: check.select,
        values: new Map()
      }
      groups.push(group)
    } else {
      group.select ||= check.select
    }

    for (const value of check.values) {
      const paths = group.values.get(value) ?? []

      paths.push(check.path)
      group.values.set(value, paths)
    }
  }

  for (const group of groups) {
    const values = [...group.values.keys()]

    if (values.length === 0) {
      continue
    }

    const rows = (await (
      db as unknown as {
        select: (fields?: unknown) => {
          from: (table: PgTable) => {
            where: (condition: unknown) => Promise<Row[]>
          }
        }
      }
    )
      .select(group.select ? undefined : { value: group.column })
      .from(group.table)
      .where(inArray(group.column, values as never[]))) as Row[]

    const found = new Set(
      rows.map(row => (group.select ? row[group.key] : row.value))
    )

    const missing = values.filter(value => !found.has(value))

    if (missing.length > 0) {
      const tableName = getTableConfig(group.table).name

      const paths = missing.flatMap(value => group.values.get(value) ?? [])

      throw new ClientError(
        `Related "${tableName}" record not found (${paths.join(', ')}) for ${group.column.name}: ${missing
          .map(String)
          .join(', ')}`,
        404
      )
    }

    if (group.select) {
      store.record({
        table: group.table,
        key: group.key,
        rows
      })
    }
  }

  return store
}
