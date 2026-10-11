/**
 * Synchronizes a single module's drizzle schema against the database, applying
 * only that module's changes (creates + alters). Destructive statements are
 * never applied, and other modules' objects are never touched.
 *
 * Uses drizzle-kit's programmatic `pushSchema` (the same diff engine as
 * `drizzle-kit push`), then filters the planned statements.
 *
 * Usage: tsx scripts/push-module-schema.ts <moduleDir>
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { pushSchema } from 'drizzle-kit/api-postgres'
import { PgDialect } from 'drizzle-orm/pg-core'
import dotenv from 'dotenv'
import postgres from 'postgres'

import { deriveModuleNamespace } from '@lifeforge/module-runtime/registry'

dotenv.config({
  path: path.resolve(import.meta.dirname, '../../../env/.env.local'),
  quiet: true
})

/** Errors we can safely ignore (object already exists). */
const IGNORED_CODES = new Set(['42P07', '42710', '42P16', '42P06'])

async function main(): Promise<void> {
  const moduleDir = process.argv[2]

  if (!moduleDir) {
    throw new Error('Usage: push-module-schema <moduleDir>')
  }

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  const client = postgres(databaseUrl, { max: 1 })

  try {
    await client`select 1`

    console.log('DB_OK')

    const pkg = JSON.parse(
      fs.readFileSync(path.join(moduleDir, 'package.json'), 'utf-8')
    ) as { name: string }

    const namespace = deriveModuleNamespace(pkg.name)

    const source = path.join(moduleDir, 'server', 'schema.drizzle.ts')
    const compiled = path.join(moduleDir, 'server', 'dist', 'schema.js')
    const schemaFile = fs.existsSync(source) ? source : compiled

    if (!fs.existsSync(schemaFile)) {
      console.log('NO_SCHEMA')

      return
    }

    const imports = (await import(pathToFileURL(schemaFile).href)) as Record<
      string,
      unknown
    >

    // drizzle-kit's pushSchema expects a node-postgres-shaped instance
    // (`execute(sql)` -> `{ rows }`); adapt our postgres-js client.
    const dialect = new PgDialect()

    const adapter = {
      execute: async (query: unknown) => {
        const { sql: text } = dialect.sqlToQuery(query as never)

        return { rows: await client.unsafe(text) }
      }
    }

    const { sqlStatements } = await pushSchema(
      imports,
      adapter as never,
      { tables: `${namespace}__*` } as never
    )

    // Only apply additive / non-destructive statements for the module. Never
    // drop anything (dropping other modules' enums would be destructive).
    const filtered = sqlStatements.filter(
      statement => !/\bDROP\b/i.test(statement)
    )

    let applied = 0

    const failures: string[] = []

    for (const statement of filtered) {
      try {
        await client.unsafe(statement)
        applied++
      } catch (error) {
        const code = (error as { code?: string }).code

        if (code && IGNORED_CODES.has(code)) {
          continue
        }

        failures.push((error as Error).message)
      }
    }

    console.log(`APPLIED ${applied}`)

    if (failures.length > 0) {
      console.error(`FAILED ${failures.length}`)

      for (const failure of failures) {
        console.error(`  - ${failure}`)
      }

      process.exit(1)
    }
  } finally {
    await client.end()
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
