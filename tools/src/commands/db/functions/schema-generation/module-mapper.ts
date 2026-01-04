import fs from 'fs'
import _ from 'lodash'

import {
  parseCollectionName,
  parsePackageName
} from '@/commands/modules/functions/registry/namespace-utils'
import CLILoggingService from '@/utils/logging'

/**
 * Builds mapping of modules to their collections
 */
export async function buildModuleCollectionsMap(
  collections: Array<Record<string, unknown>>
): Promise<Record<string, Record<string, unknown>[]>> {
  const moduleCollectionsMap: Record<string, Record<string, unknown>[]> = {}

  const modulesDirs = [
    './server/src/lib/**/schema.ts',
    './apps/**/server/schema.ts'
  ]

  let allModules: string[] = []

  try {
    allModules = modulesDirs
      .map(dir => fs.globSync(dir))
      .flat()
      .map(entry => entry.split('/').slice(0, -1).join('/'))
  } catch (error) {
    CLILoggingService.error(`Failed to read modules directory: ${error}`)
    process.exit(1)
  }

  for (const collection of collections) {
    const collectionName = collection.name as string

    // Parse the collection name to get the module identifier
    const parsed = parseCollectionName(collectionName)

    // Build the module prefix (including username for third-party)
    const modulePrefix = parsed.username
      ? `${parsed.username}___${parsed.moduleName}`
      : parsed.moduleName

    const matchingModule = allModules.find(module => {
      const moduleDirName =
        module
          .replace(/\/server$/, '')
          .split('/')
          .pop() || ''

      const { username, moduleName } = parsePackageName(moduleDirName)

      const expectedPrefix = username
        ? `${username}___${moduleName}`
        : moduleName

      return modulePrefix === expectedPrefix
    })

    if (!matchingModule) {
      // Fallback: use camelCase for path lookup
      const moduleName = _.camelCase(parsed.moduleName)

      const possibleModulePath = [
        `./server/src/lib/${moduleName}/server`,
        `./apps/${moduleName}/server`
      ]

      const foundModulePath = possibleModulePath.filter(modulePath =>
        fs.existsSync(modulePath)
      )

      if (foundModulePath.length > 0) {
        CLILoggingService.debug(
          `Inferred module path for collection '${collectionName}': ${foundModulePath[0]}`
        )

        const key = `${foundModulePath[0]}|${moduleName}`

        if (!moduleCollectionsMap[key]) {
          moduleCollectionsMap[key] = []
        }

        moduleCollectionsMap[key].push(collection)
        continue
      }

      CLILoggingService.warn(
        `Collection '${collectionName}' has no corresponding module`
      )
      continue
    }

    const moduleName = matchingModule
      .replace(/\/server$/, '')
      .split('/')
      .pop()

    const key = `${matchingModule}|${moduleName}`

    if (!moduleCollectionsMap[key]) {
      moduleCollectionsMap[key] = []
    }

    moduleCollectionsMap[key].push(collection)
  }

  const totalCollections = Object.values(moduleCollectionsMap).flat().length

  const moduleCount = Object.keys(moduleCollectionsMap).length

  CLILoggingService.info(
    `Found ${totalCollections} collections across ${moduleCount} modules`
  )

  return moduleCollectionsMap
}
