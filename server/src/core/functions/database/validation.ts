import {
  CleanedSchemas,
  CollectionKey,
  IPBService
} from '@lifeforge/server-utils'

const checkExistence = async <TSchemas extends CleanedSchemas>(
  pb: IPBService<TSchemas>,
  collection: CollectionKey<TSchemas>,
  id: string
): Promise<boolean> => {
  try {
    await pb.getOne.collection(collection).id(id).execute()

    return true
  } catch {
    return false
  }
}

/**
 * Batch check existence of multiple IDs in a collection
 * Uses a single query with filter instead of N+1 queries
 */
export const checkExistenceBatch = async <TSchemas extends CleanedSchemas>(
  pb: IPBService<TSchemas>,
  collection: CollectionKey<TSchemas>,
  ids: string[]
): Promise<Set<string>> => {
  if (ids.length === 0) {
    return new Set()
  }

  if (ids.length === 1) {
    const exists = await checkExistence(pb, collection, ids[0])
    return exists ? new Set(ids) : new Set()
  }

  try {
    // Create filter for multiple IDs
    const filter = ids.map(id => `id="${id}"`).join(' || ')
    const records = await pb.instance
      .collection(collection as string)
      .getFullList({
        filter,
        fields: 'id'
      })

    return new Set(records.map(r => r.id))
  } catch {
    // Fallback to individual checks if batch fails
    const results = await Promise.all(
      ids.map(async id => ({
        id,
        exists: await checkExistence(pb, collection, id)
      }))
    )

    return new Set(results.filter(r => r.exists).map(r => r.id))
  }
}

export default checkExistence
