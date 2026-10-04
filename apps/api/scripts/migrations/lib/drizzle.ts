import {
  type Table,
  defineRelations,
  getTableColumns,
  getTableName
} from 'drizzle-orm'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { ROOT_DIR } from './constants'

export interface ModuleSchemaInfo {
  module: string
  kind: 'app' | 'core'
  schemaPath: string
  /** Module id used for storage keys (`lifeforge--<module>` for app, `<name>` for core libraries). */
  storageId: string
  tables: Record<string, Table>
  builtRelations: Record<
    string,
    { table: Table; name: string; relations: Record<string, any> }
  >
}

export interface ColumnPlan {
  jsKey: string
  dbName: string
  dataType: string
  columnType: string
  notNull: boolean
  hasDefault: boolean
  isPrimary: boolean
  isUnique: boolean
  enumValues?: readonly string[]
}

export interface RelationPlan {
  name: string
  relationType: 'one' | 'many'
  sourceColumns: string[]
  targetColumns: string[]
  targetTable: string
  throughTable?: string
}

export interface TablePlan {
  key: string
  pgName: string
  columns: ColumnPlan[]
  relations: RelationPlan[]
}

function resolveSchemaPath(module: string): {
  schemaPath: string
  kind: 'app' | 'core'
} {
  const appPath = path.join(
    ROOT_DIR,
    'modules',
    module,
    'server',
    'schema.drizzle.ts'
  )

  if (fs.existsSync(appPath)) {
    return { schemaPath: appPath, kind: 'app' }
  }

  const corePath = path.join(
    ROOT_DIR,
    'apps/api/src/lib',
    module,
    'schema.drizzle.ts'
  )

  if (fs.existsSync(corePath)) {
    return { schemaPath: corePath, kind: 'core' }
  }

  throw new Error(
    `No schema.drizzle.ts found for "${module}" (looked in modules/${module}/server and apps/api/src/lib/${module})`
  )
}

/** Loads a module's drizzle schema and builds its relations for FK introspection. */
export async function loadModuleSchema(
  module: string
): Promise<ModuleSchemaInfo> {
  const { schemaPath, kind } = resolveSchemaPath(module)
  const mod = (await import(pathToFileURL(schemaPath).href)) as {
    tables?: Record<string, Table>
    relations?: (r: any) => Record<string, any>
  }

  if (!mod.tables) {
    throw new Error(`"${module}" schema does not export "tables"`)
  }

  const builtRelations = mod.relations
    ? (defineRelations(mod.tables, mod.relations) as unknown as Record<
        string,
        { table: Table; name: string; relations: Record<string, any> }
      >)
    : Object.fromEntries(
        Object.entries(mod.tables).map(([key, table]) => [
          key,
          { table, name: key, relations: {} }
        ])
      )

  return {
    module,
    kind,
    schemaPath,
    storageId: module,
    tables: mod.tables,
    builtRelations
  }
}

/** Introspects tables -> columns + relations. */
export function introspectModule(info: ModuleSchemaInfo): TablePlan[] {
  return Object.entries(info.tables).map(([key, table]) => {
    const cols = getTableColumns(table) as Record<string, any>

    const columns: ColumnPlan[] = Object.entries(cols).map(([jsKey, col]) => ({
      jsKey,
      dbName: col.name,
      dataType: col.dataType,
      columnType: col.columnType,
      notNull: !!col.notNull,
      hasDefault: !!col.hasDefault,
      isPrimary: !!col.primary,
      isUnique: !!col.isUnique,
      enumValues: col.enumValues
    }))

    const rel = info.builtRelations[key]?.relations ?? {}

    const relations: RelationPlan[] = Object.entries(rel).map(
      ([name, relation]: [string, any]) => ({
        name,
        relationType: relation.relationType,
        sourceColumns: (relation.sourceColumns ?? []).map((c: any) => c.name),
        targetColumns: (relation.targetColumns ?? []).map((c: any) => c.name),
        targetTable: relation.targetTableName,
        throughTable: relation.throughTable
          ? getTableName(relation.throughTable)
          : undefined
      })
    )

    return { key, pgName: getTableName(table), columns, relations }
  })
}
