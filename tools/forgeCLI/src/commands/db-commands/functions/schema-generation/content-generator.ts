import chalk from 'chalk'
import _ from 'lodash'
import path from 'path'

import CLILoggingService from '@/utils/logging'

import { generateCollectionSchema, stripCollectionIds } from './field-converter'

/**
 * Generates schema content for a module
 * @param moduleName - The name of the module
 * @param collections - Collections belonging to this module
 * @param idToNameMap - Map of collection IDs to names for relation resolution
 */
export function generateModuleSchemaContent(
  moduleName: string,
  collections: Array<Record<string, unknown>>,
  idToNameMap?: Map<string, string>
): string {
  const schemaEntries: string[] = []

  for (const collection of collections) {
    const collectionName = collection.name as string

    const fields = collection.fields as Array<Record<string, unknown>>

    CLILoggingService.debug(
      `Processing collection ${chalk.bold(collectionName)} with ${fields.length} fields`
    )

    const zodSchemaObject = generateCollectionSchema(collection)

    const schemaObjectString = Object.entries(zodSchemaObject)
      .map(([key, value]) => `  ${key}: ${value},`)
      .join('\n')

    const shortName = collectionName.split('__').pop()

    const zodSchemaString = `z.object({\n${schemaObjectString}\n})`

    // Remove IDs and convert relation collectionIds to names
    const cleanedCollection = stripCollectionIds(collection, idToNameMap)

    schemaEntries.push(`  ${shortName}: {
        schema: ${zodSchemaString},
        raw: ${JSON.stringify(cleanedCollection, null, 2)}
      },`)

    CLILoggingService.info(
      `Generated schema for collection ${chalk.bold(collectionName)}`
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
