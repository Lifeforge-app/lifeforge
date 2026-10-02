/**
 * Per-module migration template.
 *
 *   1. `cp _template.ts <module>.ts`
 *   2. Run `inspect.ts <module>` and review the proposed mapping.
 *   3. Implement `mapRow` (and the media bits) for the module.
 *   4. Order the tables as `inspect.ts` reports, then run `--dry-run` first.
 *
 * Run:
 *   pnpm --filter @lifeforge/server exec tsx scripts/migrations/<module>.ts [--dry-run]
 *
 * Helpers live in ./lib. See the `database-migration` skill for the rules.
 */
import { clearTables, createMigrationDb, insertRows } from './lib/db'
import { introspectModule, loadModuleSchema } from './lib/drizzle'
import { loadPbRows, openPb } from './lib/pb'

const MODULE = 'REPLACE_ME' // e.g. lifeforge--achievements

/**
 * Maps one PocketBase row to the target table's insert shape.
 *
 * Rules:
 * - id: `newId(pbRow.id)`
 * - relation (maxSelect 1): `<fkColumn>: pbRow.x ? newId(pbRow.x) : null`
 * - relation (maxSelect > 1): use `parsePbList(...).map(newId)` or a junction
 * - date/autodate: `parsePbDate(pbRow.created)`
 * - json: `parsePbJson(pbRow.x)`
 * - file: `await migrateFileField({ storage, ... })` (needs an async mapper)
 */
function mapRow(_pbRow: Record<string, any>): Record<string, unknown> {
  throw new Error(`TODO: implement mapRow for ${MODULE}`)
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run')

  const info = await loadModuleSchema(MODULE)
  const tables = introspectModule(info)
  const pb = openPb()

  // Only needed when the module has file fields:
  // const storage = createModuleStorage(info.storageId)

  const { db, client } = createMigrationDb()

  try {
    // Order tables from `inspect.ts` (parents before children).
    for (const table of tables) {
      const pbRows = loadPbRows(pb, table.pgName)
      const mapped = pbRows.map(row => mapRow(row as Record<string, any>))

      if (dryRun) {
        console.log(`[dry-run] ${table.pgName}: ${mapped.length} row(s)`)
        continue
      }

      await db.transaction(async tx => {
        await clearTables(tx, [info.tables[table.key]])
        await insertRows(tx, info.tables[table.key], mapped)
      })

      console.log(`${table.pgName}: inserted ${mapped.length}`)
    }
  } finally {
    await client.end()
    pb.close()
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
