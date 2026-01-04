import chalk from 'chalk'
import path from 'path'

import { parseCollectionName } from '@/commands/modules/functions/registry/namespaceUtils'
import Logging from '@/utils/logging'

import { writeFormattedFile } from '../../utils'
import { generateModuleSchemaContent } from './content-generator'

/**
 * Processes schema generation for modules
 * @param moduleCollectionsMap - Map of module paths to their collections
 * @param idToNameMap - Map of collection IDs to names for relation resolution
 * @param targetModule - Optional specific module to process
 */
export async function processSchemaGeneration(
  moduleCollectionsMap: Record<string, Record<string, unknown>[]>,
  idToNameMap: Map<string, string>,
  targetModule?: string
): Promise<{ moduleSchemas: Record<string, string>; moduleDirs: string[] }> {
  const filteredModuleCollectionsMap = targetModule
    ? Object.fromEntries(
        Object.entries(moduleCollectionsMap).filter(([key]) =>
          key.includes(targetModule)
        )
      )
    : moduleCollectionsMap

  if (targetModule && Object.keys(filteredModuleCollectionsMap).length === 0) {
    Logging.error(`Module "${targetModule}" not found or has no collections`)
    process.exit(1)
  }

  const moduleSchemas: Record<string, string> = {}

  const moduleDirs: string[] = []

  for (const [moduleDir, collections] of Object.entries(
    filteredModuleCollectionsMap
  )) {
    const [moduleDirPath, moduleDirName] = moduleDir.split('|')

    if (!collections.length) {
      Logging.warn(
        `No collections found for module ${chalk.bold(moduleDirName)}`
      )
      continue
    }

    const firstCollection = collections[0] as Record<string, unknown>

    // Use parseCollectionName to extract module name with username support for third-party modules
    const parsed = parseCollectionName(firstCollection.name as string)

    const moduleName = parsed.username
      ? `${parsed.username}___${parsed.moduleName}`
      : parsed.moduleName

    moduleDirs.push(moduleDir)

    const moduleSchemaContent = generateModuleSchemaContent(
      moduleName,
      collections as Array<Record<string, unknown>>,
      idToNameMap
    )

    moduleSchemas[moduleDirName] = moduleSchemaContent

    // Write individual module schema file
    const moduleSchemaPath = path.join(moduleDirPath, 'schema.ts')

    await writeFormattedFile(moduleSchemaPath, moduleSchemaContent)

    Logging.debug(
      `Created schema file for module ${chalk.bold(moduleDirName)} at ${chalk.bold(`lib/${moduleDirName}/schema.ts`)}`
    )
  }

  return { moduleSchemas, moduleDirs }
}
