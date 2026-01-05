/**
 * Generates skeleton migration content for the first phase of migration.
 *
 * Skeleton migrations create minimal stub collections that only include:
 * - Collection name and type
 * - Access rules (list, view, create, update, delete)
 * - Placeholder viewQuery for view collections
 *
 * This phase runs first to ensure all collections exist before the structure
 * phase attempts to create relations between them. Without skeleton collections,
 * relations would fail because the target collection doesn't exist yet. If the
 * collection already exists, the migration will be skipped.
 *
 * @param schema - Module schema with collection definitions
 * @returns JavaScript code string for the up migration
 *
 * @example
 * // Generated migration creates collections only if they don't exist:
 * // let usersExisting = null;
 * // try { usersExisting = app.findCollectionByNameOrId('users'); } catch (e) {}
 * // if (!usersExisting) { app.importCollections([usersStub], false); }
 */
export default function generateContent(
  schema: Record<string, { raw: Record<string, unknown> }>
): string {
  const lines: string[] = []

  lines.push('// Create skeleton collections (only if they do not exist)')

  for (const [name, { raw }] of Object.entries(schema)) {
    const collectionName = raw.name as string

    lines.push(`
  // ${collectionName}
  let ${name}Existing = null;
  try {
    ${name}Existing = app.findCollectionByNameOrId('${collectionName}');
  } catch (e) {
    // Collection doesn't exist yet
  }

  if (!${name}Existing) {`)

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

  return lines.join('\n')
}
