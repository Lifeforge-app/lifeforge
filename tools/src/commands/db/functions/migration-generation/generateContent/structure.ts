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
function stripIdsFromRaw(
  raw: Record<string, unknown>
): Record<string, unknown> {
  const cleaned = { ...raw }

  delete cleaned.id
  delete cleaned.created
  delete cleaned.updated

  if (cleaned.fields && Array.isArray(cleaned.fields)) {
    cleaned.fields = cleaned.fields.map((field: Record<string, unknown>) => {
      const cleanedField = { ...field }

      delete cleanedField.id

      return cleanedField
    })
  }

  return cleaned
}

/**
 * Extracts relation fields from a collection that need dynamic collectionId resolution.
 *
 * Relation fields store the target collection's ID, but IDs aren't portable.
 * This function identifies which fields need their collectionId resolved
 * at migration runtime using `findCollectionByNameOrId`.
 *
 * @param raw - The raw collection configuration
 * @returns Array of relation field info with field name and target collection name
 */
function extractRelationFields(
  raw: Record<string, unknown>
): Array<{ fieldName: string; collectionName: string }> {
  const relations: Array<{ fieldName: string; collectionName: string }> = []

  const fields = raw.fields as Array<Record<string, unknown>> | undefined

  if (fields) {
    for (const field of fields) {
      if (field.type === 'relation' && field.collectionId) {
        relations.push({
          fieldName: field.name as string,
          collectionName: field.collectionId as string // Already converted to name in schema
        })
      }
    }
  }

  return relations
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
 * @param idToNameMap - Map of collection IDs to names for resolving relations
 * @returns JavaScript code string for the up migration
 */
export default function generateContent(
  schema: Record<string, { raw: Record<string, unknown> }>,
  idToNameMap: Map<string, string>
): string {
  // Filter out view collections - they are handled in view query migration
  const nonViewCollections = Object.entries(schema).filter(
    ([, { raw }]) => raw.type !== 'view'
  )

  const lines: string[] = []

  lines.push('// Update collections with full schema (excluding views)')

  for (const [name, { raw }] of nonViewCollections) {
    const cleanedRaw = stripIdsFromRaw(raw)

    const relations = extractRelationFields(cleanedRaw)

    lines.push('')
    lines.push(`  // Get existing collection and update it`)
    lines.push(
      `  const ${name}Existing = app.findCollectionByNameOrId('${raw.name}');`
    )
    lines.push(
      `  const ${name}Collection = ${JSON.stringify(cleanedRaw, null, 2)
        .split('\n')
        .map((l, i) => (i === 0 ? l : '  ' + l))
        .join('\n')};`
    )

    // For each relation field, resolve the collectionId dynamically using NAME not ID
    for (const { fieldName, collectionName } of relations) {
      // Convert ID to name if needed
      const resolvedName = idToNameMap.get(collectionName) || collectionName

      lines.push(
        `  const ${name}_${fieldName}_rel = app.findCollectionByNameOrId('${resolvedName}');`
      )
      lines.push(
        `  ${name}Collection.fields.find(f => f.name === '${fieldName}').collectionId = ${name}_${fieldName}_rel.id;`
      )
    }

    lines.push(`  ${name}Collection.id = ${name}Existing.id;`)
    lines.push(`  app.importCollections([${name}Collection], false);`)
  }

  const upContent = lines.join('\n')

  return upContent
}
