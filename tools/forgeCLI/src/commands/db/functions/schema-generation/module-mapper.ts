import fs from 'fs'
import _ from 'lodash'

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

    const matchingModule = allModules.find(module =>
      collectionName.startsWith(
        _.snakeCase(
          module
            .replace(/\/server$/, '')
            .split('/')
            .pop() || ''
        )
      )
    )

    if (!matchingModule) {
      const moduleName = _.camelCase(collectionName.split('__')[0])

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
