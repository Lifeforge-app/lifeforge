/**
 * Strips IDs from raw collection config to prevent conflicts
 */
export function stripIdsFromRaw(
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
 * Generates migration file content
 */
export function generateMigrationContent(
  schema: Record<string, { raw: unknown }>
): {
  upContent: string
  downContent: string
} {
  const upContent =
    Object.entries(schema)
      .map(([name, { raw }]) => {
        const cleanedRaw = stripIdsFromRaw(raw)

        return `  const ${name}Collection = ${JSON.stringify(cleanedRaw, null, 2)};`
      })
      .join('\n\n') +
    '\n\napp.importCollections([' +
    Object.keys(schema)
      .map(name => `  ${name}Collection`)
      .join(',\n') +
    ']);'

  const downContent = Object.values(schema)
    .map(({ raw }) => {
      return `  let ${raw.name}Collection = app.findCollectionByNameOrId("${raw.name}");\n app.delete(${raw.name}Collection);`
    })
    .join('\n\n')

  return { upContent, downContent }
}
