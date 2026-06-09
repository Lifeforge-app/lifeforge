/**
 * Constants for database command operations
 */

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
 * Paths to scan for schema files
 */
export const SCHEMA_PATTERNS = [
  './apps/api/src/lib/**/schema.ts',
  './modules/**/server/schema.ts'
]
