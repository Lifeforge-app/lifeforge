/**
 * Generates view query migration content for the third phase of migration.
 *
 * View collections in PocketBase are defined by SQL queries that reference
 * other collections. This phase runs LAST because:
 * 1. All referenced collections must exist (created in skeleton phase)
 * 2. All fields must be defined (set in structure phase)
 * 3. The viewQuery can now safely reference any table/field
 *
 * During skeleton phase, views are created with a placeholder query:
 * `SELECT (ROW_NUMBER() OVER()) as id`
 *
 * This phase replaces that placeholder with the actual viewQuery from the schema.
 *
 * @param schema - Module schema with collection definitions
 * @returns JavaScript code string for the up migration, or empty string if no views
 *
 * @example
 * // For a view collection 'users_aggregated':
 * // const users_aggregated = app.findCollectionByNameOrId('users_aggregated');
 * // users_aggregated.viewQuery = 'SELECT ... FROM users GROUP BY ...';
 * // app.save(users_aggregated);
 */
export default function generateContent(
  schema: Record<string, { raw: Record<string, unknown> }>
): string {
  const viewCollections = Object.entries(schema).filter(
    ([, { raw }]) => raw.type === 'view'
  )

  if (viewCollections.length === 0) {
    return ''
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

  return lines.join('\n')
}
