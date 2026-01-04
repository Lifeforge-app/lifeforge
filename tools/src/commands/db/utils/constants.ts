/**
 * Constants for database command operations
 */

export interface PocketBaseField {
  name: string
  type: string
  required?: boolean
  maxSelect?: number
  values?: string[]
  [key: string]: unknown
}

export const FIELD_TYPE_MAPPING: Record<
  string,
  (field: PocketBaseField) => string
> = {
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
 * Paths to scan for schema files
 */
export const SCHEMA_PATTERNS = [
  './server/src/lib/**/schema.ts',
  './apps/**/server/schema.ts'
]
