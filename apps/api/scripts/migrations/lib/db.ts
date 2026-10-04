import type { Table } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { requireEnv } from './env'

/** Creates a bare migration Drizzle client (no relations needed). */
export function createMigrationDb() {
  const client = postgres(requireEnv('DATABASE_URL'), { max: 1 })
  const db = drizzle({ client })

  return { db, client }
}

/** Inserts rows in chunks to stay under parameter limits. */
export async function insertRows(
  db: any,
  table: Table,
  rows: Record<string, unknown>[],
  chunkSize = 500
): Promise<number> {
  let inserted = 0

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)

    if (chunk.length > 0) {
      await db.insert(table).values(chunk)
      inserted += chunk.length
    }
  }

  return inserted
}

/**
 * Deletes all rows from the given tables in reverse order (so children are
 * cleared before parents when `tables` is topologically sorted).
 */
export async function clearTables(db: any, tables: Table[]): Promise<void> {
  for (const table of [...tables].reverse()) {
    await db.delete(table)
  }
}
