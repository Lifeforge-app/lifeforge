import generateZodSchemaString from './generateZodSchema'
import stripCollectionIds from './stripCollectionIds'

/**
 * Processes a single collection into schema.ts format with Zod schema and raw config.
 *
 * @param collection - PocketBase collection object
 * @param idToNameMap - Map for converting relation IDs to collection names
 * @returns Formatted schema entry string for the collection
 */
async function processCollectionSchema(
  collection: Record<string, unknown>,
  idToNameMap: Map<string, string>
): Promise<string> {
  const { parseCollectionName } = await import('shared')

  const collectionName = collection.name as string

  const shortName = parseCollectionName(
    collectionName,
    'pb',
    collectionName === 'users' ? 'users' : undefined
  ).collectionName

  const zodSchemaString = generateZodSchemaString(collection)

  const cleanedRawCollection = stripCollectionIds(collection, idToNameMap)

  return `  ${shortName}: {
      schema: ${zodSchemaString},
      raw: ${JSON.stringify(cleanedRawCollection, null, 2)}
    },`
}

/**
 * Generates the complete TypeScript schema file content for a module.
 *
 * Creates a `schema.ts` file that exports:
 * - Zod validation schemas for type-safe data access
 * - Raw PocketBase collection configs for migration generation
 *
 * The generated file can be imported by both the migration generator (for raw configs)
 * and application code (for Zod schemas).
 *
 * @param collections - Array of PocketBase collections belonging to this module
 * @param idToNameMap - Map of collection IDs to names for resolving relation fields
 * @returns Complete TypeScript file content as a string
 *
 * @example
 * // Generated file structure:
 * // import z from 'zod'
 * //
 * // const schemas = {
 * //   events: {
 * //     schema: z.object({ title: z.string(), ... }),
 * //     raw: { name: 'events', ... }
 * //   },
 * // }
 * //
 * // export default schemas
 */
export default async function generateSchemaContent(
  collections: Array<Record<string, unknown>>,
  idToNameMap: Map<string, string>
): Promise<string> {
  const schemaEntries: string[] = []

  for (const collection of collections) {
    schemaEntries.push(await processCollectionSchema(collection, idToNameMap))
  }

  return `import z from 'zod'
import { cleanSchemas } from '@lifeforge/server-utils'

export const schemas = {
${schemaEntries.join('\n')}
}

export default cleanSchemas(schemas)`
}
