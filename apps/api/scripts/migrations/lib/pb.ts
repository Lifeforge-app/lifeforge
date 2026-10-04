import { DatabaseSync } from 'node:sqlite'

import { PB_DB_PATH } from './constants'

export type PbFieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'select'
  | 'number'
  | 'bool'
  | 'date'
  | 'autodate'
  | 'json'
  | 'geoPoint'
  | 'file'
  | 'relation'
  | 'password'

export interface PbField {
  name: string
  type: PbFieldType
  maxSelect?: number | null
  values?: string[] | null
  collectionId?: string | null
  thumbs?: string[] | null
  required?: boolean
  [key: string]: unknown
}

export interface PbCollection {
  id: string
  name: string
  type: string
  system: boolean
  fields: PbField[]
}

/** Opens the PocketBase SQLite database (read-only usage). */
export function openPb(): DatabaseSync {
  return new DatabaseSync(PB_DB_PATH)
}

/**
 * Reads non-view, non-system collections from `_collections`.
 *
 * - Skips PB views (`_aggregated` collections) — they map to aggregate queries
 *   in the new codebase, not tables.
 * - Skips PB system collections (names starting with `_`), but keeps `users`
 *   (an auth collection that the app still owns).
 */
export function loadPbCollections(
  db: DatabaseSync,
  options: { includeViews?: boolean } = {}
): PbCollection[] {
  const rows = db
    .prepare('SELECT id, name, type, system, fields FROM _collections')
    .all() as Array<{
    id: string
    name: string
    type: string
    system: number
    fields: string
  }>

  return rows
    .filter(row => options.includeViews || row.type !== 'view')
    .filter(row => !row.name.startsWith('_'))
    .map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      system: !!row.system,
      fields: JSON.parse(row.fields || '[]') as PbField[]
    }))
}

/** Reads every record of a PB collection. */
export function loadPbRows<T = Record<string, unknown>>(
  db: DatabaseSync,
  collection: string
): T[] {
  return db.prepare(`SELECT * FROM "${collection}"`).all() as T[]
}

/** Converts a PocketBase `date`/`autodate` value (`YYYY-MM-DD HH:MM:SS.mmmZ`) to a Date. */
export function parsePbDate(value: string): Date {
  return new Date(value.replace(' ', 'T'))
}

/** Parses a PocketBase JSON field value (stored as text in SQLite). */
export function parsePbJson<T = unknown>(value: unknown): T {
  if (typeof value === 'string') {
    return JSON.parse(value) as T
  }

  return value as T
}

/**
 * Splits a PB multi-value column (relations, files). PB serializes multi
 * relations as a JSON array and multi files as a comma-separated list.
 */
export function parsePbList(value: unknown): string[] {
  if (value === null || value === undefined || value === '') {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (trimmed.startsWith('[')) {
      return (JSON.parse(trimmed) as unknown[]).filter(Boolean).map(String)
    }

    return trimmed
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)
  }

  return []
}
