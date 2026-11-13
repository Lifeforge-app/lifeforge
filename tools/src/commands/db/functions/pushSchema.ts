import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import postgres from 'postgres'

/** Errors we can safely ignore (object already exists). */
const IGNORED_CODES = new Set(['42P07', '42710', '42P16', '42P06'])

export interface PushResult {
  applied: number
  failures: string[]
}

type Sql = ReturnType<typeof postgres>

interface NodePgAdapter {
  execute(query: unknown): Promise<{ rows: unknown[] }>
}

/**
 * Adapts a postgres-js client to the node-postgres shape that drizzle-kit's
 * programmatic `pushSchema` expects (`execute(sql)` -> `{ rows }`).
 */
async function createAdapter(sql: Sql): Promise<NodePgAdapter> {
  const { PgDialect } = await import('drizzle-orm/pg-core')

  const dialect = new PgDialect()

  return {
    execute: async (query: unknown) => {
      const { sql: text } = dialect.sqlToQuery(query as never)

      return { rows: (await sql.unsafe(text)) as unknown[] }
    }
  }
}

/** Extracts the SQL table names exported by a schema module. */
async function getTableNames(
  imports: Record<string, unknown>
): Promise<string[]> {
  const { getTableName } = await import('drizzle-orm')

  const names = new Set<string>()

  for (const value of Object.values(imports)) {
    if (value === null || typeof value !== 'object') continue

    try {
      const name = getTableName(value as never) as string | undefined

      if (typeof name === 'string' && name.length > 0) {
        names.add(name)
      }
    } catch {
      // Not a drizzle table (e.g. the `relations` helper).
    }
  }

  return [...names]
}

interface EnumDefinition {
  schema: string
  name: string
  values: string[]
}

/** Extracts the PostgreSQL enums exported by a schema module. */
async function getEnums(
  imports: Record<string, unknown>
): Promise<EnumDefinition[]> {
  const { isPgEnum } = await import('drizzle-orm/pg-core')

  const enums = new Map<string, EnumDefinition>()

  for (const value of Object.values(imports)) {
    if (!isPgEnum(value)) continue

    const schema = value.schema ?? 'public'

    enums.set(`${schema}.${value.enumName}`, {
      schema,
      name: value.enumName,
      values: [...value.enumValues]
    })
  }

  return [...enums.values()]
}

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`
}

/**
 * drizzle-kit's programmatic `pushSchema` does not accept a hints handler, so
 * whenever an enum diff contains both created and deleted enums (new enums in
 * this schema file vs. enums belonging to schemas outside the per-file filter)
 * its diff resolver throws `resolver(enum) was called without a HintsHandler`.
 *
 * Creating the module's enums up front removes the "created" side of the diff,
 * so drizzle-kit only has to deal with additive column/table changes.
 */
async function ensureEnums(
  sql: Sql,
  imports: Record<string, unknown>
): Promise<number> {
  const enums = await getEnums(imports)

  if (enums.length === 0) return 0

  const rows = await sql<
    { schema: string; name: string }[]
  >`select n.nspname as schema, t.typname as name
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typtype = 'e'`

  const existing = new Set(rows.map(row => `${row.schema}.${row.name}`))

  let created = 0

  for (const definition of enums) {
    const key = `${definition.schema}.${definition.name}`

    if (existing.has(key)) continue

    const values = definition.values
      .map(value => `'${value.replace(/'/g, "''")}'`)
      .join(', ')

    await sql.unsafe(
      `CREATE TYPE ${quoteIdentifier(definition.schema)}.${quoteIdentifier(
        definition.name
      )} AS ENUM (${values})`
    )

    existing.add(key)
    created++
  }

  return created
}

/**
 * Applies the given schema files to the database using drizzle-kit's diff
 * engine, scoped to each file's own tables.
 *
 * Destructive statements are never applied, so objects that aren't part of the
 * provided schemas (e.g. tables/enums from modules that are no longer
 * installed) are left untouched - the database is only ever extended.
 */
export async function pushSchemaFiles(files: string[]): Promise<PushResult> {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  const { pushSchema } = await import('drizzle-kit/api-postgres')

  const sql = postgres(databaseUrl, { max: 1 })

  let applied = 0

  const failures: string[] = []

  try {
    await sql`select 1`

    const adapter = await createAdapter(sql)

    for (const file of files) {
      if (!fs.existsSync(file)) continue

      const imports = (await import(pathToFileURL(file).href)) as Record<
        string,
        unknown
      >

      const tables = await getTableNames(imports)

      if (tables.length === 0) continue

      applied += await ensureEnums(sql, imports)

      const { sqlStatements } = await pushSchema(
        imports,
        adapter as never,
        { tables } as never
      )

      const additive = sqlStatements.filter(
        statement => !/\bDROP\b/i.test(statement)
      )

      for (const statement of additive) {
        try {
          await sql.unsafe(statement)
          applied++
        } catch (error) {
          const code = (error as { code?: string }).code

          if (code && IGNORED_CODES.has(code)) {
            continue
          }

          failures.push((error as Error).message)
        }
      }
    }
  } finally {
    await sql.end()
  }

  return { applied, failures }
}
