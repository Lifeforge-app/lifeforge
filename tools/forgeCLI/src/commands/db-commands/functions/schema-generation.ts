import chalk from 'chalk'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import CLILoggingService from '@/utils/logging'

import { FIELD_TYPE_MAPPING, writeFormattedFile } from '../utils'
import type { ModuleCollectionsMap, PocketBaseField } from '../utils/types'

/**
 * Schema generation utilities
 */

/**
 * Converts a PocketBase field to Zod schema string
 */
function convertFieldToZodSchema(field: PocketBaseField): string | null {
  if (field.name === 'id') {
    return null // Skip auto-generated fields
  }

  const converter = FIELD_TYPE_MAPPING[field.type]

  if (!converter) {
    CLILoggingService.warn(
      `Unknown field type '${field.type}' for field '${field.name}'. Skipping.`
    )

    return null
  }

  return converter(field)
}

/**
 * Generates Zod schema for a collection
 */
function generateCollectionSchema(collection: any): Record<string, string> {
  const zodSchemaObject: Record<string, string> = {}

  for (const field of collection.fields.filter((e: any) => !e.hidden)) {
    const zodSchema = convertFieldToZodSchema(field as PocketBaseField)

    if (zodSchema) {
      zodSchemaObject[field.name] = zodSchema
    }
  }

  return zodSchemaObject
}

/**
 * Builds mapping of modules to their collections
 */
export async function buildModuleCollectionsMap(
  collections: any[]
): Promise<ModuleCollectionsMap> {
  const moduleCollectionsMap: ModuleCollectionsMap = {}

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
    const matchingModule = allModules.find(module =>
      collection.name.startsWith(
        _.snakeCase(
          module
            .replace(/\/server$/, '')
            .split('/')
            .pop() || ''
        )
      )
    )

    if (!matchingModule) {
      const moduleName = _.camelCase(collection.name.split('__')[0])

      const possibleModulePath = [
        `./server/src/lib/${moduleName}/server`,
        `./apps/${moduleName}/server`
      ]

      const foundModulePath = possibleModulePath.filter(modulePath =>
        fs.existsSync(modulePath)
      )

      if (foundModulePath.length > 0) {
        CLILoggingService.debug(
          `Inferred module path for collection '${collection.name}': ${foundModulePath[0]}`
        )

        const key = `${foundModulePath[0]}|${moduleName}`

        if (!moduleCollectionsMap[key]) {
          moduleCollectionsMap[key] = []
        }

        moduleCollectionsMap[key].push(collection)
        continue
      }

      CLILoggingService.warn(
        `Collection '${collection.name}' has no corresponding module`
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

/**
 * Generates schema content for a module
 */
export function generateModuleSchemaContent(
  moduleName: string,
  collections: any[]
): string {
  const schemaEntries: string[] = []

  for (const collection of collections) {
    CLILoggingService.debug(
      `Processing collection ${chalk.bold(collection.name)} with ${collection.fields.length} fields`
    )

    const zodSchemaObject = generateCollectionSchema(collection)

    const schemaObjectString = Object.entries(zodSchemaObject)
      .map(([key, value]) => `  ${key}: ${value},`)
      .join('\n')

    const collectionName = collection.name.split('__').pop()

    const zodSchemaString = `z.object({\n${schemaObjectString}\n})`

    // Remove IDs and timestamps to avoid migration conflicts
    const cleanedCollection = stripCollectionIds(collection)

    schemaEntries.push(`  ${collectionName}: {
        schema: ${zodSchemaString},
        raw: ${JSON.stringify(cleanedCollection, null, 2)}
      },`)

    CLILoggingService.info(
      `Generated schema for collection ${chalk.bold(collection.name)}`
    )
  }

  return `import z from 'zod'

const ${_.camelCase(moduleName)}Schemas = {
${schemaEntries.join('\n')}
}

export default ${_.camelCase(moduleName)}Schemas
`
}

/**
 * Strips collection ID and field IDs from raw config
 * This prevents migration conflicts when importing to different databases
 */
function stripCollectionIds(collection: any): any {
  const cleaned = { ...collection }

  // Remove collection-level properties that cause conflicts
  delete cleaned.id
  delete cleaned.created
  delete cleaned.updated

  if ('oauth2' in cleaned) {
    delete cleaned.oauth2
  }

  // Remove field IDs
  if (cleaned.fields && Array.isArray(cleaned.fields)) {
    cleaned.fields = cleaned.fields.map((field: any) => {
      const cleanedField = { ...field }

      delete cleanedField.id

      return cleanedField
    })
  }

  return cleaned
}

/**
 * Generates main schema file content
 */
export function generateMainSchemaContent(moduleDirs: string[]): string {
  const imports = moduleDirs
    .map(moduleDir => {
      const [moduleDirPath, moduleDirName] = moduleDir.split('|')

      const targetPath = path.join(
        '@lib/',
        moduleDirName,
        moduleDirPath.split(moduleDirName).pop() || '',
        'schema'
      )

      return `  ${_.snakeCase(moduleDirName)}: (await import('${targetPath}')).default,`
    })
    .join('\n')

  return `import flattenSchemas from '@functions/utils/flattenSchema'

export const SCHEMAS = {
${imports}
}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
`
}

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

    const moduleName = collections[0].name.split('__')[0]

    moduleDirs.push(moduleDir)

    const moduleSchemaContent = generateModuleSchemaContent(
      moduleName,
      collections
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
