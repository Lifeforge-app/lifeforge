/**
 * Strips auto-generated IDs and timestamps from a collection configuration.
 *
 * PocketBase assigns unique IDs to collections and fields, but these IDs are
 * database-specific and not portable. By stripping them, the generated schema
 * can be used to recreate collections in any PocketBase instance.
 *
 * For relation fields, this function also converts the `collectionId` (which is
 * a database-specific ID) to the collection's `name` using the provided map.
 * This allows migrations to look up collections by name instead of ID.
 *
 * Removed properties:
 * - `id` - Collection and field IDs
 * - `created` / `updated` - Timestamps
 * - `oauth2` - OAuth config (if present)
 *
 * @param collection - Raw PocketBase collection object
 * @param idToNameMap - Optional map for converting relation collectionIds to names
 * @returns Cleaned collection config without database-specific IDs
 *
 * @example
 * // Before: { id: 'abc123', name: 'events', fields: [{ id: 'def456', name: 'title', ... }] }
 * // After: { name: 'events', fields: [{ name: 'title', ... }] }
 */
export default function stripCollectionIds(
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
