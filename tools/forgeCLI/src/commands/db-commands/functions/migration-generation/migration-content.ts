/**
 * Generates skeleton migration content - creates stub collections if they don't exist
 */
export function generateSkeletonMigrationContent(
  schema: Record<string, { raw: Record<string, unknown> }>
): {
  upContent: string
  downContent: string
} {
  const lines: string[] = []

  lines.push('// Create skeleton collections (only if they do not exist)')

  for (const [name, { raw }] of Object.entries(schema)) {
    const collectionName = raw.name as string

    lines.push('')
    lines.push(`  // ${collectionName}`)
    lines.push(`  let ${name}Existing = null;`)
    lines.push(`  try {`)
    lines.push(
      `    ${name}Existing = app.findCollectionByNameOrId('${collectionName}');`
    )
    lines.push(`  } catch (e) {`)
    lines.push(`    // Collection doesn't exist yet`)
    lines.push(`  }`)
    lines.push('')
    lines.push(`  if (!${name}Existing) {`)

    const stubCollection: Record<string, unknown> = {
      name: collectionName,
      type: raw.type || 'base',
      listRule: raw.listRule,
      viewRule: raw.viewRule,
      createRule: raw.createRule,
      updateRule: raw.updateRule,
      deleteRule: raw.deleteRule
    }

    // View collections require a viewQuery
    if (raw.type === 'view') {
      // Use placeholder query with required id column - real query will be set in structure migration
      stubCollection.viewQuery = 'SELECT (ROW_NUMBER() OVER()) as id'
    }

    lines.push(
      `    const ${name}Stub = ${JSON.stringify(stubCollection, null, 2)
        .split('\n')
        .map((l, i) => (i === 0 ? l : '    ' + l))
        .join('\n')};`
    )
    lines.push(`    app.importCollections([${name}Stub], false);`)
    lines.push(`  }`)
  }

  const upContent = lines.join('\n')

  // Down migration: delete only if we created them (no-op for safety)
  const downContent = '// Skeleton collections are not deleted to preserve data'

  return { upContent, downContent }
}

/**
 * Strips IDs from raw collection config
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
 * Extracts relation fields that need dynamic collectionId resolution
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
 * Generates structure migration content - updates collections with full schema
 * Uses findCollectionByNameOrId to resolve relation collectionIds dynamically
 * NOTE: View collections are excluded - they are handled separately in view query migration
 */
export function generateStructureMigrationContent(
  schema: Record<string, { raw: Record<string, unknown> }>,
  idToNameMap: Map<string, string>
): {
  upContent: string
  downContent: string
} {
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

  const downContent = nonViewCollections
    .map(([, { raw }]) => {
      return `  const ${raw.name}Collection = app.findCollectionByNameOrId("${raw.name}");\n  app.delete(${raw.name}Collection);`
    })
    .join('\n\n')

  return { upContent, downContent }
}

/**
 * Generates view query migration content - updates view collections with their actual viewQuery
 * This must run AFTER all normal collection structures are in place
 */
export function generateViewQueryMigrationContent(
  schema: Record<string, { raw: Record<string, unknown> }>
): {
  upContent: string
  downContent: string
  hasViews: boolean
} {
  const viewCollections = Object.entries(schema).filter(
    ([, { raw }]) => raw.type === 'view'
  )

  if (viewCollections.length === 0) {
    return { upContent: '', downContent: '', hasViews: false }
  }

  const lines: string[] = []

  lines.push('// Update view collections with their actual viewQuery')

  for (const [name, { raw }] of viewCollections) {
    lines.push('')
    lines.push(`  // ${raw.name}`)
    lines.push(
      `  const ${name}Collection = app.findCollectionByNameOrId('${raw.name}');`
    )
    lines.push(
      `  ${name}Collection.viewQuery = ${JSON.stringify(raw.viewQuery)};`
    )
    lines.push(`  app.save(${name}Collection);`)
  }

  const upContent = lines.join('\n')

  // Down migration: revert to placeholder query
  const downContent = viewCollections
    .map(([name, { raw }]) => {
      return `  const ${raw.name}Collection = app.findCollectionByNameOrId("${raw.name}");\n  ${name}Collection.viewQuery = 'SELECT (ROW_NUMBER() OVER()) as id';\n  app.save(${name}Collection);`
    })
    .join('\n\n')

  return { upContent, downContent, hasViews: true }
}
