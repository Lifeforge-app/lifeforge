import { getTableColumns, inArray } from 'drizzle-orm'
import {
  type PgColumn,
  type PgTable,
  getTableConfig
} from 'drizzle-orm/pg-core'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { z } from 'zod'

import ClientError from '../response/ClientError'
import { collectExistenceChecks } from './walk'

interface ExistenceGroup {
  table: PgTable
  column: PgColumn
  values: Map<unknown, string[]>
}

function resolveColumn(table: PgTable, column?: string): PgColumn {
  const tableName = getTableConfig(table).name

  if (column) {
    const resolved = getTableColumns(table)[column]

    if (!resolved) {
      throw new Error(
        `Unknown column "${column}" on table "${tableName}" referenced by existsIn.`
      )
    }

    return resolved as PgColumn
  }

  const primary = getTableConfig(table).columns.find(col => col.primary)

  if (!primary) {
    throw new Error(
      `Table "${tableName}" has no primary key to check existence against.`
    )
  }

  return primary
}

/**
 * Runs every `existsIn` pre-flight check for a parsed request, throwing a
 * `404 ClientError` if any referenced record is missing.
 *
 * Checks are batched per `(table, column)` using a single `IN (...)` query.
 */
export async function checkRecordExistence(options: {
  db: PostgresJsDatabase
  querySchema?: z.ZodTypeAny
  query?: unknown
  bodySchema?: z.ZodTypeAny
  body?: unknown
}): Promise<void> {
  const { db, querySchema, query, bodySchema, body } = options

  const checks = [
    ...collectExistenceChecks(querySchema, query, 'query'),
    ...collectExistenceChecks(bodySchema, body, 'body')
  ]

  if (checks.length === 0) {
    return
  }

  const groups: ExistenceGroup[] = []

  for (const check of checks) {
    const column = resolveColumn(check.table, check.column)

    let group = groups.find(
      entry => entry.table === check.table && entry.column === column
    )

    if (!group) {
      group = { table: check.table, column, values: new Map() }
      groups.push(group)
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
        select: (fields: unknown) => {
          from: (table: PgTable) => {
            where: (condition: unknown) => Promise<Record<string, unknown>[]>
          }
        }
      }
    )
      .select({ value: group.column })
      .from(group.table)
      .where(inArray(group.column, values as never[]))) as {
      value: unknown
    }[]

    const found = new Set(rows.map(row => row.value))

    const missing = values.filter(value => !found.has(value))

    if (missing.length === 0) {
      continue
    }

    const tableName = getTableConfig(group.table).name

    const paths = missing.flatMap(value => group.values.get(value) ?? [])

    throw new ClientError(
      `Related "${tableName}" record not found (${paths.join(', ')}) for ${group.column.name}: ${missing
        .map(String)
        .join(', ')}`,
      404
    )
  }
}
