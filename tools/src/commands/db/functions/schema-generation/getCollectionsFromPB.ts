import chalk from 'chalk'

import { isDockerMode } from '@/utils/helpers'
import logger from '@/utils/logger'
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
  logger.debug('Connecting to PocketBase...')

  const { pb, killPB } = await getPBInstance(!isDockerMode())

  logger.debug('Fetching all collections...')

  const allCollections = await pb.collections.getFullList()

  killPB?.()

  const nonSystemCollections = allCollections.filter(
    collection => !collection.system
  )

  logger.debug(
    `Found ${chalk.blue(String(allCollections.length))} collections, ${chalk.blue(String(nonSystemCollections.length))} non-system`
  )

  return nonSystemCollections
}
