import PocketBase, { type CollectionModel } from 'pocketbase'

/**
 * Removes auto-generated IDs and timestamps from a raw collection config.
 *
 * PocketBase generates unique IDs for collections and fields, but these
 * aren't portable across environments. By stripping them, the migration
 * code works consistently regardless of the source database.
 *
 * Normally in generated `schema.ts`, these fields are already stripped.
 * But in case the schema is generated from a different source, this serves
 * as another layer of safety to ensure the migration code works.
 *
 * @param raw - The raw collection configuration from the schema
 * @returns Cleaned config without id, created, updated fields
 */
async function mapCollectionRelation(
  pb: PocketBase,
  raw: CollectionModel
): Promise<CollectionModel> {
  const allCollectionsInPB = await pb.collections.getFullList()

  const mapped = { ...raw }

  const realCollection = allCollectionsInPB.find(
    collection => collection.name === raw.name
  )

  if (!realCollection?.id) {
    throw new Error(
      `Collection "${raw.name}" not found in PocketBase for relation field "${raw.name}"`
    )
  }

  mapped.id = realCollection.id

  delete mapped.created
  delete mapped.updated

  for (const index of mapped.indexes) {
    const found = realCollection.indexes.find(idx => idx === index)

    // If the index is already in the collection, we don't need to add it again
    if (found) {
      mapped.indexes = mapped.indexes.filter(idx => idx !== index)
    }
  }

  if (mapped.fields && Array.isArray(mapped.fields)) {
    mapped.fields = mapped.fields.map(field => {
      const cleanedField = { ...field }

      if (cleanedField.type === 'relation' && cleanedField.collectionId) {
        const targetCollection = allCollectionsInPB.find(
          collection => collection.name === cleanedField.collectionId
        )

        if (!targetCollection) {
          throw new Error(
            `Collection "${cleanedField.collectionId}" not found in PocketBase for relation field "${cleanedField.name}" in collection "${raw.name}"`
          )
        }

        cleanedField.collectionId = targetCollection.id
      }

      return cleanedField
    })
  }

  return mapped
}

/**
 * Generates structure migration content for the second phase of migration.
 *
 * Structure migrations update existing collections with their full schema including:
 * - All field definitions (text, number, relation, file, etc.)
 * - Field options and validation rules
 * - Dynamically resolved relation collectionIds using `findCollectionByNameOrId`
 *
 * View collections are EXCLUDED from this phase because their viewQuery may
 * reference other collections that aren't fully set up yet. Views are handled
 * in the separate views phase.
 *
 * @param schema - Module schema with collection definitions
 * @returns JavaScript code string for the up migration
 */
export default async function generateContent(
  pb: PocketBase,
  schema: Record<string, { raw: CollectionModel }>
) {
  // Filter out view collections - they are handled in view query migration
  const nonViewCollections = Object.entries(schema).filter(
    ([, { raw }]) => raw.type !== 'view'
  )

  for (const [_, { raw }] of nonViewCollections) {
    const mappedRaw = await mapCollectionRelation(pb, raw)

    await pb.collections.update(raw.name, mappedRaw)
  }
}
