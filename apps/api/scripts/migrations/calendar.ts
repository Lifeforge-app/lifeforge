/**
 * Migrate the calendar module (calendars, categories, events + subtypes) from
 * PocketBase into the Drizzle schema.
 *
 * Run:
 *   pnpm --filter @lifeforge/server exec tsx scripts/migrations/calendar.ts --dry-run
 *   pnpm --filter @lifeforge/server exec tsx scripts/migrations/calendar.ts
 */
import { clearTables, createMigrationDb, insertRows } from './lib/db'
import { introspectModule, loadModuleSchema } from './lib/drizzle'
import { newId } from './lib/id'
import { loadPbRows, openPb, parsePbDate, parsePbJson } from './lib/pb'

const MODULE = 'lifeforge--calendar'

function mapRow(key: string, pb: Record<string, any>): Record<string, unknown> {
  switch (key) {
    case 'calendarCalendars':
      return {
        id: newId(pb.id),
        name: pb.name ?? '',
        color: pb.color ?? '',
        link: pb.link ?? '',
        last_synced: pb.last_synced ? parsePbDate(pb.last_synced) : null
      }

    case 'calendarCategories':
      return {
        id: newId(pb.id),
        name: pb.name ?? '',
        color: pb.color ?? '',
        icon: pb.icon ?? ''
      }

    case 'calendarEvents':
      return {
        id: newId(pb.id),
        title: pb.title ?? '',
        category: pb.category ? newId(pb.category) : null,
        calendar: pb.calendar ? newId(pb.calendar) : null,
        location: pb.location ?? '',
        location_coords: pb.location_coords
          ? parsePbJson(pb.location_coords)
          : null,
        reference_link: pb.reference_link ?? '',
        description: pb.description ?? '',
        type: pb.type,
        created: parsePbDate(pb.created),
        updated: parsePbDate(pb.updated)
      }

    case 'calendarEventsSingle':
      return {
        id: newId(pb.id),
        base_event: newId(pb.base_event),
        start: pb.start ? parsePbDate(pb.start) : null,
        end: pb.end ? parsePbDate(pb.end) : null
      }

    case 'calendarEventsRecurring':
      return {
        id: newId(pb.id),
        recurring_rule: pb.recurring_rule ?? '',
        duration_amount: pb.duration_amount ?? 0,
        duration_unit: pb.duration_unit,
        exceptions: parsePbJson(pb.exceptions) ?? [],
        base_event: newId(pb.base_event)
      }

    case 'calendarEventsIcal':
      return {
        id: newId(pb.id),
        calendar: pb.calendar ? newId(pb.calendar) : null,
        external_id: pb.external_id ?? '',
        title: pb.title ?? '',
        description: pb.description ?? '',
        start: pb.start ? parsePbDate(pb.start) : null,
        end: pb.end ? parsePbDate(pb.end) : null,
        location: pb.location ?? '',
        recurrence_rule: pb.recurrence_rule ?? null
      }

    default:
      throw new Error(`No mapping for table "${key}"`)
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run')

  const info = await loadModuleSchema(MODULE)
  const tables = introspectModule(info)
  const pb = openPb()

  const { db, client } = createMigrationDb()

  try {
    for (const table of tables) {
      const pbRows = loadPbRows(pb, table.pgName)
      const mapped = pbRows.map(row =>
        mapRow(table.key, row as Record<string, any>)
      )

      if (dryRun) {
        console.log(`[dry-run] ${table.pgName}: ${mapped.length} row(s)`)

        if (mapped[0]) {
          console.log(JSON.stringify(mapped[0], null, 2))
        }

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
