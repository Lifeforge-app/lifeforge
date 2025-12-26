import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { CLILoggingService } from '../../../utils/logging'
import type { FieldTypeMapping } from './types'

dotenv.config({
  path: path.join(process.cwd(), './env/.env.local')
})

/**
 * Constants for database command operations
 */

export const FIELD_TYPE_MAPPING: FieldTypeMapping = {
  text: () => 'z.string()',
  richtext: () => 'z.string()',
  number: () => 'z.number()',
  bool: () => 'z.boolean()',
  email: () => 'z.email()',
  url: () => 'z.url()',
  date: () => 'z.string()',
  autodate: () => 'z.string()',
  password: () => 'z.string()',
  json: () => 'z.any()',
  geoPoint: () => 'z.object({ lat: z.number(), lon: z.number() })',
  select: field => {
    const values = [...(field.values ?? []), ...(field.required ? [] : [''])]

    const enumSchema = `z.enum(${JSON.stringify(values)})`

    return (field.maxSelect ?? 1) > 1 ? `z.array(${enumSchema})` : enumSchema
  },
  file: field => {
    const baseSchema = 'z.string()'

    return (field.maxSelect ?? 1) > 1 ? `z.array(${baseSchema})` : baseSchema
  },
  relation: field => {
    const baseSchema = 'z.string()'

    return (field.maxSelect ?? 1) > 1 ? `z.array(${baseSchema})` : baseSchema
  }
}

/**
 * Prettier formatting options for generated files
 */
export const PRETTIER_OPTIONS = {
  parser: 'typescript' as const,
  semi: false,
  singleQuote: true,
  trailingComma: 'none' as const,
  arrowParens: 'avoid' as const,
  endOfLine: 'auto' as const
}

/**
 * Migration prettier options
 */
export const MIGRATION_PRETTIER_OPTIONS = {
  parser: 'typescript' as const,
  singleQuote: true,
  trailingComma: 'all' as const,
  printWidth: 80
}

/**
 * Schema file glob patterns
 */
export const SCHEMA_PATTERNS = [
  './server/src/lib/**/schema.ts',
  './apps/**/server/schema.ts'
]

export const PB_DIR = process.env.PB_DIR || ''

// In Docker mode (PB_BINARY_PATH is set), PB_DIR is the data directory directly
// In local mode, PB_DIR contains the pocketbase binary and pb_data subfolder
const isDockerMode = !!process.env.PB_BINARY_PATH

export const PB_DATA_DIR = isDockerMode
  ? path.resolve(PB_DIR)
  : path.resolve(path.join(PB_DIR, 'pb_data'))

export const PB_MIGRATIONS_DIR = path.resolve(`${PB_DATA_DIR}/pb_migrations`)

export const PB_BINARY_PATH = path.resolve(
  process.env.PB_BINARY_PATH || `${PB_DIR}/pocketbase`
)

if (!PB_DATA_DIR || !PB_MIGRATIONS_DIR || !PB_BINARY_PATH) {
  CLILoggingService.error('PocketBase environment variables are not set')
  process.exit(1)
}

if (!fs.existsSync(PB_BINARY_PATH)) {
  CLILoggingService.error(`PocketBase binary does not exist: ${PB_BINARY_PATH}`)
  process.exit(1)
}
