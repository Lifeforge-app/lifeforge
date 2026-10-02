import type { ColumnPlan, TablePlan } from './drizzle'
import type { PbCollection, PbField } from './pb'

export type MappingKind =
  'id' | 'scalar' | 'enum' | 'date' | 'json' | 'relation' | 'file' | 'unmapped'

export interface ColumnMapping {
  pbField: string
  pbType: string
  column: string | null
  kind: MappingKind
  confidence: 'high' | 'low'
  note?: string
}

export interface MappingProposal {
  mappings: ColumnMapping[]
  unmappedFields: ColumnMapping[]
  unmappedColumns: string[]
}

export function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function findColumn(
  table: TablePlan,
  candidates: string[],
  used: Set<string>
): ColumnPlan | undefined {
  for (const candidate of candidates) {
    const target = normalize(candidate)

    const column = table.columns.find(
      col =>
        !used.has(col.jsKey) &&
        !used.has(col.dbName) &&
        (normalize(col.jsKey) === target || normalize(col.dbName) === target)
    )

    if (column) {
      return column
    }
  }

  return undefined
}

/**
 * Best-effort mapping between a PB collection's fields and a drizzle table's
 * columns. This is a *proposal* for the author to review — the per-module
 * migration script is where the final, correct mapping lives.
 */
export function proposeMapping(
  table: TablePlan,
  pb: PbCollection
): MappingProposal {
  const used = new Set<string>()
  const mappings: ColumnMapping[] = []

  const push = (field: PbField, mapping: ColumnMapping) => {
    if (mapping.column) {
      used.add(mapping.column)
    }

    mappings.push(mapping)
  }

  for (const field of pb.fields) {
    if (field.name === 'id') {
      push(field, {
        pbField: 'id',
        pbType: field.type,
        column: 'id',
        kind: 'id',
        confidence: 'high'
      })
      continue
    }

    if (field.type === 'relation') {
      const relation =
        table.relations.find(
          r => normalize(r.name) === normalize(field.name)
        ) ??
        table.relations.find(
          r => normalize(r.name) === normalize(field.name) + 'id'
        )

      if (relation && relation.sourceColumns[0]) {
        push(field, {
          pbField: field.name,
          pbType: field.type,
          column: relation.sourceColumns[0],
          kind: 'relation',
          confidence: 'high',
          note: relation.targetTable
        })
        continue
      }

      const column = findColumn(table, [field.name + 'Id', field.name], used)

      push(field, {
        pbField: field.name,
        pbType: field.type,
        column: column?.dbName ?? null,
        kind: 'relation',
        confidence: column ? 'low' : 'low',
        note: 'relation (verify column / target)'
      })
      continue
    }

    if (field.type === 'file') {
      const column = findColumn(
        table,
        [field.name, field.name + 'Key', field.name + 'Keys'],
        used
      )

      push(field, {
        pbField: field.name,
        pbType: field.type,
        column: column?.dbName ?? null,
        kind: 'file',
        confidence: column ? 'high' : 'low',
        note: field.maxSelect && field.maxSelect > 1 ? 'multi-file' : undefined
      })
      continue
    }

    const kind: MappingKind =
      field.type === 'autodate' || field.type === 'date'
        ? 'date'
        : field.type === 'json'
          ? 'json'
          : field.type === 'geoPoint'
            ? 'unmapped'
            : 'scalar'

    if (field.type === 'geoPoint' || field.type === 'password') {
      push(field, {
        pbField: field.name,
        pbType: field.type,
        column: null,
        kind: 'unmapped',
        confidence: 'low',
        note: 'special — needs override/transform'
      })
      continue
    }

    const column = findColumn(table, [field.name], used)

    push(field, {
      pbField: field.name,
      pbType: field.type,
      column: column?.dbName ?? null,
      kind: column?.enumValues ? 'enum' : kind,
      confidence: column ? 'high' : 'low'
    })
  }

  const unmappedFields = mappings.filter(m => m.kind === 'unmapped')
  const unmappedColumns = table.columns
    .filter(
      col =>
        !used.has(col.jsKey) &&
        !used.has(col.dbName) &&
        !col.isPrimary &&
        !col.hasDefault
    )
    .map(col => col.dbName)

  return { mappings, unmappedFields, unmappedColumns }
}
