import Pocketbase, { type CollectionModel } from 'pocketbase'

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
export default async function generateContent(
  pb: Pocketbase,
  schema: Record<string, { raw: CollectionModel }>
) {
  for (const [_, { raw }] of Object.entries(schema)) {
    const collectionName = raw.name as string

    const collection = await pb.collections
      .getFirstListItem(`name = '${collectionName}'`)
      .catch(() => null)

    if (collection) {
      continue
    }

    const stubCollection: Partial<CollectionModel> = {
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

    await pb.collections.create(stubCollection)
  }
}
