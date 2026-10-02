/**
 * Read-only migration planner.
 *
 *   pnpm --filter @lifeforge/server exec tsx scripts/migrations/inspect.ts <module>
 *
 * Prints the proposed table/column mapping between PocketBase and a module's
 * drizzle schema, its relation graph, and the insert order. It never writes.
 */
import {
  type TablePlan,
  introspectModule,
  loadModuleSchema
} from './lib/drizzle'
import { loadEnv } from './lib/env'
import { proposeMapping } from './lib/map'
import { loadPbCollections, openPb } from './lib/pb'
import { countPbRows } from './lib/validate'

function insertOrder(tables: TablePlan[]): string[] {
  const byName = new Map(tables.map(t => [t.pgName, t]))
  const visited = new Set<string>()
  const order: string[] = []

  const visit = (table: TablePlan) => {
    if (visited.has(table.pgName)) {
      return
    }

    visited.add(table.pgName)

    for (const relation of table.relations) {
      const target = byName.get(relation.targetTable)

      if (target && target.pgName !== table.pgName) {
        visit(target)
      }
    }

    order.push(table.pgName)
  }

  for (const table of tables) {
    visit(table)
  }

  return order
}

async function main(): Promise<void> {
  const moduleName = process.argv[2]

  if (!moduleName) {
    console.error('Usage: tsx scripts/migrations/inspect.ts <module>')
    process.exit(1)
  }

  loadEnv()

  const info = await loadModuleSchema(moduleName)
  const tables = introspectModule(info)
  const pb = openPb()
  const collections = loadPbCollections(pb)
  const byName = new Map(collections.map(c => [c.name, c]))

  console.log(`module:  ${info.module} (${info.kind})`)
  console.log(`schema:  ${info.schemaPath}`)
  console.log(`storage: ${info.storageId}`)
  console.log()

  for (const table of tables) {
    const collection = byName.get(table.pgName)

    console.log(`=== ${table.pgName}  (key: ${table.key}) ===`)

    if (!collection) {
      console.log('  no matching PocketBase collection')
      console.log()
      continue
    }

    console.log(
      `  PB collection: ${collection.name} — ${countPbRows(pb, collection.name)} row(s)`
    )

    const proposal = proposeMapping(table, collection)

    for (const mapping of proposal.mappings) {
      const flag =
        mapping.kind === 'unmapped'
          ? '!!'
          : mapping.confidence === 'low'
            ? ' ?'
            : '  '

      console.log(
        `${flag} ${mapping.pbField} (${mapping.pbType}) -> ${mapping.column ?? '—'} [${mapping.kind}]${
          mapping.note ? ` (${mapping.note})` : ''
        }`
      )
    }

    if (proposal.unmappedColumns.length > 0) {
      console.log(
        `  unmapped target columns: ${proposal.unmappedColumns.join(', ')}`
      )
    }

    const relations = table.relations.filter(r => r.sourceColumns.length > 0)

    if (relations.length > 0) {
      console.log('  relations:')

      for (const relation of relations) {
        console.log(
          `    ${relation.name} (${relation.relationType}) ${relation.sourceColumns.join(', ')} -> ${relation.targetTable}${
            relation.throughTable ? ` through ${relation.throughTable}` : ''
          }`
        )
      }
    }

    console.log()
  }

  console.log(`insert order: ${insertOrder(tables).join(' -> ')}`)

  pb.close()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
