import chalk from 'chalk'
import path from 'path'

import CLILoggingService from '@/utils/logging'

import { type ModuleCollectionsMap, writeFormattedFile } from '../../utils'
import { generateModuleSchemaContent } from './content-generator'

/**
 * Processes schema generation for modules
 */
export async function processSchemaGeneration(
  moduleCollectionsMap: ModuleCollectionsMap,
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
    CLILoggingService.error(
      `Module "${targetModule}" not found or has no collections`
    )
    process.exit(1)
  }

  const moduleSchemas: Record<string, string> = {}

  const moduleDirs: string[] = []

  for (const [moduleDir, collections] of Object.entries(
    filteredModuleCollectionsMap
  )) {
    const [moduleDirPath, moduleDirName] = moduleDir.split('|')

    if (!collections.length) {
      CLILoggingService.warn(
        `No collections found for module ${chalk.bold(moduleDirName)}`
      )
      continue
    }

    const firstCollection = collections[0] as Record<string, unknown>

    const moduleName = (firstCollection.name as string).split('__')[0]

    moduleDirs.push(moduleDir)

    const moduleSchemaContent = generateModuleSchemaContent(
      moduleName,
      collections as Array<Record<string, unknown>>
    )

    moduleSchemas[moduleDirName] = moduleSchemaContent

    // Write individual module schema file
    const moduleSchemaPath = path.join(moduleDirPath, 'schema.ts')

    await writeFormattedFile(moduleSchemaPath, moduleSchemaContent)

    CLILoggingService.debug(
      `Created schema file for module ${chalk.bold(moduleDirName)} at ${chalk.bold(`lib/${moduleDirName}/schema.ts`)}`
    )
  }

  return { moduleSchemas, moduleDirs }
}
