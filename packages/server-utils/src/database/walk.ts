/* eslint-disable padding-line-between-statements */
import type { PgTable } from 'drizzle-orm/pg-core'
import type { z } from 'zod'

import { EXISTS_IN, type ExistenceCheck } from './existsIn'

/**
 * A single resolved existence requirement found while walking a parsed payload.
 */
export interface CollectedExistenceCheck {
  path: string
  table: PgTable
  column?: string
  values: unknown[]
}

function walk(
  schema: z.ZodTypeAny,
  value: unknown,
  path: string,
  results: CollectedExistenceCheck[]
): void {
  const check = (
    schema as unknown as Record<symbol, ExistenceCheck | undefined>
  )[EXISTS_IN]

  if (check) {
    const values =
      value === undefined || value === null
        ? []
        : Array.isArray(value)
          ? value.filter(item => item !== undefined && item !== null)
          : [value]

    if (values.length > 0) {
      results.push({
        path: path || 'value',
        table: check.table,
        column: check.column,
        values
      })
    }

    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const def = (schema as any)?._zod?.def

  if (!def) {
    return
  }

  switch (def.type) {
    case 'object': {
      const shape = typeof def.shape === 'function' ? def.shape() : def.shape

      if (!shape || typeof value !== 'object' || value === null) {
        return
      }

      for (const key of Object.keys(shape)) {
        walk(
          shape[key],
          (value as Record<string, unknown>)[key],
          path ? `${path}.${key}` : key,
          results
        )
      }

      return
    }

    case 'array': {
      if (!Array.isArray(value)) {
        return
      }

      value.forEach((item, index) =>
        walk(def.element, item, `${path}[${index}]`, results)
      )

      return
    }

    case 'record': {
      if (typeof value !== 'object' || value === null) {
        return
      }

      for (const [key, item] of Object.entries(value)) {
        walk(def.valueType, item, path ? `${path}.${key}` : key, results)
      }

      return
    }

    case 'intersection': {
      walk(def.left, value, path, results)
      walk(def.right, value, path, results)

      return
    }

    case 'union': {
      for (const option of def.options) {
        walk(option, value, path, results)
      }

      return
    }

    case 'optional':
    case 'nullable':
    case 'default':
    case 'prefault':
    case 'nonoptional':
    case 'catch':
    case 'readonly': {
      if (def.innerType) {
        walk(def.innerType, value, path, results)
      }

      return
    }

    case 'pipe': {
      walk(def.in, value, path, results)

      return
    }

    case 'lazy': {
      const resolved = def.getter?.()

      if (resolved) {
        walk(resolved, value, path, results)
      }

      return
    }

    default:
      return
  }
}

/**
 * Walks a zod schema paired with its parsed value and collects every
 * `existsIn` requirement it contains.
 */
export function collectExistenceChecks(
  schema: z.ZodTypeAny | undefined,
  value: unknown,
  path = ''
): CollectedExistenceCheck[] {
  if (!schema) {
    return []
  }

  const results: CollectedExistenceCheck[] = []

  walk(schema, value, path, results)

  return results
}
