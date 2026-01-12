import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

/**
 * Filters a module collections map to include only a specific module's collections.
 *
 * Used when running schema generation for a single module instead of all modules.
 * Matches by the module's short name (e.g., 'calendar' matches 'lifeforge--calendar').
 *
 * @param moduleCollectionsMap - Full map of all modules to their collections
 * @param targetModule - Optional module name to filter by. If omitted, returns the full map.
 * @returns Filtered map containing only the target module, or the full map if no target specified
 *
 * @throws Exits process if targetModule is specified but not found in the map
 *
 * @example
 * // Filter to only invoice-maker collections:
 * filterCollectionsMap(fullMap, 'invoice-maker')
 * // Returns: { '/path/to/melvinchia3636--invoice-maker': [...] }
 */
export default function filterCollectionsMap(
  moduleCollectionsMap: Record<string, Record<string, unknown>[]>,
  targetModule?: string
) {
  const { shortName } = normalizePackage(targetModule || '', 'module')

  const filteredModuleCollectionsMap = targetModule
    ? Object.fromEntries(
        Object.entries(moduleCollectionsMap).filter(([key]) =>
          key.endsWith(shortName)
        )
      )
    : moduleCollectionsMap

  if (targetModule && Object.keys(filteredModuleCollectionsMap).length === 0) {
    logger.error(`Module "${shortName}" not found or has no collections`)
    process.exit(1)
  }

  return filteredModuleCollectionsMap
}
