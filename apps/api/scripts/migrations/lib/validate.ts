import { type Table, sql } from 'drizzle-orm'
import type { DatabaseSync } from 'node:sqlite'

export interface OrphanCheck {
  label: string
  sourceTable: string
  sourceColumn: string
  targetTable: string
  targetColumn: string
}

/** Counts rows in a target Postgres table. */
export async function countRows(db: any, table: Table): Promise<number> {
  const rows = (await db
    .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
    .from(table)) as Array<{ count: number }>

  return rows[0]?.count ?? 0
}

/** Counts rows in a PocketBase collection. */
export function countPbRows(pb: DatabaseSync, collection: string): number {
  const row = pb
    .prepare(`SELECT COUNT(*) AS count FROM "${collection}"`)
    .get() as { count: number }

  return row.count
}

/** Counts rows whose foreign key points at a non-existent target row. */
export async function countOrphanFks(
  db: any,
  check: OrphanCheck
): Promise<number> {
  const query = [
    `SELECT CAST(COUNT(*) AS INTEGER) AS count`,
    `FROM "${check.sourceTable}" s`,
    `LEFT JOIN "${check.targetTable}" t`,
    `  ON t."${check.targetColumn}" = s."${check.sourceColumn}"`,
    `WHERE s."${check.sourceColumn}" IS NOT NULL`,
    `  AND t."${check.targetColumn}" IS NULL`
  ].join(' ')

  const result = (await db.execute(sql.raw(query))) as
    Array<{ count: number }> | { rows: Array<{ count: number }> }

  const rows = Array.isArray(result) ? result : result.rows

  return rows[0]?.count ?? 0
}
