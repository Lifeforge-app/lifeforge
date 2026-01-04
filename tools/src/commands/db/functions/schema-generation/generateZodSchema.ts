import Logging from '@/utils/logging'

/**
 * PocketBase field definition with common properties.
 */
interface PocketBaseField {
  name: string
  type: string
  required?: boolean
  maxSelect?: number
  values?: string[]
  [key: string]: unknown
}

/**
 * Mapping of PocketBase field types to their Zod schema equivalents.
 *
 * Each entry is a function that takes a field definition and returns
 * the appropriate Zod schema string. Some types (like select, file, relation)
 * need to check field options to determine if they're single or multi-value.
 */
const FIELD_TYPE_MAPPING: Record<string, (field: PocketBaseField) => string> = {
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
 * Converts a single PocketBase field to its Zod schema string representation.
 *
 * @param field - PocketBase field definition
 * @returns Zod schema string, or null if field should be skipped
 */
function convertFieldToZodSchema(field: PocketBaseField): string | null {
  if (field.name === 'id') {
    return null // Skip auto-generated fields
  }

  const converter = FIELD_TYPE_MAPPING[field.type]

  if (!converter) {
    Logging.warn(
      `Unknown field type '${field.type}' for field '${field.name}'. Skipping.`
    )

    return null
  }

  return converter(field)
}

/**
 * Generates a Zod schema string for a PocketBase collection.
 *
 * Converts the collection's field definitions into a `z.object()` schema
 * that can be used for runtime validation and TypeScript type inference.
 *
 * Hidden fields are automatically excluded from the generated schema.
 *
 * @param collection - PocketBase collection object with fields array
 * @returns Zod schema string like `z.object({ name: z.string(), ... })`
 *
 * @example
 * // Input collection with fields: name (text), age (number)
 * // Output: z.object({
 * //   name: z.string(),
 * //   age: z.number(),
 * // })
 */
export default function generateZodSchemaString(
  collection: Record<string, unknown>
): string {
  const zodSchemaObject: Record<string, string> = {}

  const fields = collection.fields as Array<Record<string, unknown>>

  for (const field of fields.filter(e => !e.hidden)) {
    const zodSchema = convertFieldToZodSchema(field as PocketBaseField)

    if (zodSchema) {
      zodSchemaObject[field.name as string] = zodSchema
    }
  }

  return `z.object({\n${Object.entries(zodSchemaObject)
    .map(([key, value]) => `  ${key}: ${value},`)
    .join('\n')}\n})`
}
