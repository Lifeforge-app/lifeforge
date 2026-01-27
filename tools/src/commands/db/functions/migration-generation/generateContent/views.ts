import PocketBase, { type CollectionModel } from 'pocketbase'

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
export default async function generateContent(
  pb: PocketBase,
  schema: Record<string, { raw: CollectionModel }>
) {
  const viewCollections = Object.entries(schema).filter(
    ([, { raw }]) => raw.type === 'view'
  )

  if (viewCollections.length === 0) {
    return
  }

  for (const [_, { raw }] of viewCollections) {
    const collection = await pb.collections
      .getFirstListItem(`name = "${raw.name}"`)
      .catch(() => null)

    if (!collection) {
      throw new Error(`Collection "${raw.name}" not found in PocketBase`)
    }

    collection.viewQuery = raw.viewQuery

    await pb.collections.update(collection.id, collection)
  }
}
