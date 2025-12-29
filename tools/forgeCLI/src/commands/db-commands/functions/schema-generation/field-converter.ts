import CLILoggingService from '@/utils/logging'

import { FIELD_TYPE_MAPPING } from '../../utils'
import type { PocketBaseField } from '../../utils/constants'

/**
 * Converts a PocketBase field to Zod schema string
 */
export function convertFieldToZodSchema(field: PocketBaseField): string | null {
  if (field.name === 'id') {
    return null // Skip auto-generated fields
  }

  const converter = FIELD_TYPE_MAPPING[field.type]

  if (!converter) {
    CLILoggingService.warn(
      `Unknown field type '${field.type}' for field '${field.name}'. Skipping.`
    )

    return null
  }

  return converter(field)
}

/**
 * Generates Zod schema for a collection
 */
export function generateCollectionSchema(
  collection: Record<string, unknown>
): Record<string, string> {
  const zodSchemaObject: Record<string, string> = {}

  const fields = collection.fields as Array<Record<string, unknown>>

  for (const field of fields.filter(e => !e.hidden)) {
    const zodSchema = convertFieldToZodSchema(field as PocketBaseField)

    if (zodSchema) {
      zodSchemaObject[field.name as string] = zodSchema
    }
  }

  return zodSchemaObject
}

/**
 * Strips collection ID and field IDs from raw config
 * This prevents migration conflicts when importing to different databases
 * For relation fields, converts collectionId to collection name for portability
 */
export function stripCollectionIds(
  collection: Record<string, unknown>,
  idToNameMap?: Map<string, string>
): Record<string, unknown> {
  const cleaned = { ...collection }

  // Remove collection-level properties that cause conflicts
  delete cleaned.id
  delete cleaned.created
  delete cleaned.updated

  if ('oauth2' in cleaned) {
    delete cleaned.oauth2
  }

  // Remove field IDs and convert relation collectionIds to names
  if (cleaned.fields && Array.isArray(cleaned.fields)) {
    cleaned.fields = cleaned.fields.map((field: Record<string, unknown>) => {
      const cleanedField = { ...field }

      delete cleanedField.id

      // For relation fields, convert collectionId to collection name
      if (
        cleanedField.type === 'relation' &&
        cleanedField.collectionId &&
        idToNameMap
      ) {
        const collectionName = idToNameMap.get(
          cleanedField.collectionId as string
        )

        if (collectionName) {
          // PocketBase can look up by name instead of ID
          cleanedField.collectionId = collectionName
        }
      }

      return cleanedField
    })
  }

  return cleaned
}
