import { isDockerMode } from '@/utils/helpers'
import Logging from '@/utils/logging'
import getPBInstance from '@/utils/pocketbase'

/**
 * Fetches all non-system collections from a running PocketBase instance.
 *
 * This function handles PocketBase lifecycle automatically:
 * - In Docker mode: Connects to the existing PocketBase instance
 * - In local mode: Starts a temporary PocketBase instance if needed, then stops it after fetching
 *
 * System collections (like `_superusers`, `_auths`, etc.) are automatically filtered out
 * since they're managed by PocketBase and shouldn't be included in module schemas.
 *
 * @returns Array of non-system PocketBase collection objects
 *
 * @example
 * const collections = await getCollectionsFromPB()
 * // Returns: [{ name: 'calendar__events', type: 'base', ... }, ...]
 */
export default async function getCollectionsFromPB() {
  Logging.debug('Connecting to PocketBase...')

  const { pb, killPB } = await getPBInstance(!isDockerMode())

  Logging.debug('Fetching all collections...')

  const allCollections = await pb.collections.getFullList()

  killPB?.()

  const nonSystemCollections = allCollections.filter(
    collection => !collection.system
  )

  Logging.debug(
    `Found ${Logging.highlight(String(allCollections.length))} collections, ${Logging.highlight(String(nonSystemCollections.length))} non-system`
  )

  return nonSystemCollections
}
