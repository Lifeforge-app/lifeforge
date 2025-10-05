import { LoggingService } from '@server/core/functions/logging/loggingService'
import chalk from 'chalk'
import dotenv from 'dotenv'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import PocketBase, { type CollectionModel } from 'pocketbase'
import prettier from 'prettier'

// Types
interface Environment {
  PB_HOST: string
  PB_EMAIL: string
  PB_PASSWORD: string
}

interface ModuleCollectionsMap {
  [moduleName: string]: CollectionModel[]
}

interface SchemaGenerationResult {
  moduleSchemas: Record<string, string>
  mainSchemaContent: string
}

interface PocketBaseField {
  name: string
  type: string
  required?: boolean
  maxSelect?: number
  values?: string[]
  [key: string]: unknown
}

interface FieldTypeMapping {
  [fieldType: string]: (field: PocketBaseField) => string
}

// Constants
const PATHS = {
  ENV_FILE: path.resolve(__dirname, '../env/.env.local'),
  MODULES_DIRS: [
    path.resolve(__dirname, '../server/src/lib/**/schema.ts'),
    path.resolve(__dirname, '../apps/**/server/schema.ts')
  ],
  CORE_SCHEMA: path.resolve(__dirname, '../server/src/core/schema.ts')
} as const

const FIELD_TYPE_MAPPING: FieldTypeMapping = {
  text: () => 'z.string()',
  richtext: () => 'z.string()',
  number: () => 'z.number()',
  bool: () => 'z.boolean()',
  email: () => 'z.email()',
  url: () => 'z.url()',
  date: () => 'z.string()',
  autodate: () => 'z.string()',
  password: () => 'z.string()',
  json: () => 'z.any()',
  geoPoint: () => 'z.object({ lat: z.number(), lon: z.number() })',
  select: field => {
    const values = [...(field.values ?? []), ...(field.required ? [] : [''])]

    const enumSchema = `z.enum(${JSON.stringify(values)})`

    return (field.maxSelect ?? 1) > 1 ? `z.array(${enumSchema})` : enumSchema
  },
  file: field => {
    const baseSchema = 'z.string()'

    return (field.maxSelect ?? 1) > 1 ? `z.array(${baseSchema})` : baseSchema
  },
  relation: field => {
    const baseSchema = 'z.string()'

    return (field.maxSelect ?? 1) > 1 ? `z.array(${baseSchema})` : baseSchema
  }
}

// Environment validation
function validateEnvironment(): Environment {
  dotenv.config({ path: PATHS.ENV_FILE })

  const { PB_HOST, PB_EMAIL, PB_PASSWORD } = process.env

  if (!PB_HOST || !PB_EMAIL || !PB_PASSWORD) {
    LoggingService.error(
      'Missing required environment variables: PB_HOST, PB_EMAIL, and PB_PASSWORD'
    )
    process.exit(1)
  }

  return { PB_HOST, PB_EMAIL, PB_PASSWORD }
}

// PocketBase authentication
async function authenticatePocketBase(env: Environment): Promise<PocketBase> {
  const pb = new PocketBase(env.PB_HOST)

  try {
    await pb
      .collection('_superusers')
      .authWithPassword(env.PB_EMAIL, env.PB_PASSWORD)

    if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
      throw new Error('Invalid credentials or insufficient permissions')
    }

    return pb
  } catch (error) {
    LoggingService.error(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    process.exit(1)
  }
}

// Convert field to Zod schema
function convertFieldToZodSchema(field: PocketBaseField): string | null {
  if (field.name === 'id') {
    return null // Skip auto-generated fields
  }

  const converter = FIELD_TYPE_MAPPING[field.type]

  if (!converter) {
    LoggingService.warn(
      `Unknown field type '${field.type}' for field '${field.name}'. Skipping.`
    )

    return null
  }

  return converter(field)
}

// Generate Zod schema for a collection
function generateCollectionSchema(
  collection: CollectionModel
): Record<string, string> {
  const zodSchemaObject: Record<string, string> = {}

  for (const field of collection.fields) {
    const zodSchema = convertFieldToZodSchema(field as PocketBaseField)

    if (zodSchema) {
      zodSchemaObject[field.name] = zodSchema
    }
  }

  return zodSchemaObject
}

// Build module collections mapping
async function buildModuleCollectionsMap(
  collections: CollectionModel[]
): Promise<ModuleCollectionsMap> {
  const moduleCollectionsMap: ModuleCollectionsMap = {}

  let allModules: string[] = []

  try {
    allModules = PATHS.MODULES_DIRS.map(dir => fs.globSync(dir))
      .flat()
      .map(entry => entry.split('/').slice(0, -1).join('/'))
  } catch (error) {
    LoggingService.error(`Failed to read modules directory: ${error}`)
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
      LoggingService.warn(
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

  LoggingService.info(
    `Found ${totalCollections} collections across ${moduleCount} modules`
  )

  return moduleCollectionsMap
}

// Generate module schema content
function generateModuleSchemaContent(
  moduleName: string,
  collections: CollectionModel[]
): string {
  const schemaEntries: string[] = []

  for (const collection of collections) {
    LoggingService.debug(
      `Processing collection ${chalk.bold(collection.name)} with ${collection.fields.length} fields`
    )

    const zodSchemaObject = generateCollectionSchema(collection)

    const schemaObjectString = Object.entries(zodSchemaObject)
      .map(([key, value]) => `  ${key}: ${value},`)
      .join('\n')

    const collectionName = collection.name.split('__').pop()

    const zodSchemaString = `z.object({\n${schemaObjectString}\n})`

    delete collection.created
    delete collection.updated

    if ('oauth2' in collection) {
      delete collection.oauth2
    }

    schemaEntries.push(`  ${collectionName}: {
        schema: ${zodSchemaString},
        raw: ${JSON.stringify(collection, null, 2)}
      },`)

    LoggingService.info(
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

// Generate main schema content
function generateMainSchemaContent(moduleDirs: string[]): string {
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

// Write formatted file
async function writeFormattedFile(
  filePath: string,
  content: string
): Promise<void> {
  try {
    const formattedContent = await prettier.format(content, {
      parser: 'typescript',
      semi: false,
      singleQuote: true,
      trailingComma: 'none',
      arrowParens: 'avoid',
      endOfLine: 'auto'
    })

    fs.writeFileSync(filePath, formattedContent)
  } catch (error) {
    LoggingService.error(`Failed to write file ${filePath}: ${error}`)
    throw error
  }
}

// Generate schemas for all modules
async function generateSchemas(
  moduleCollectionsMap: ModuleCollectionsMap
): Promise<SchemaGenerationResult> {
  const moduleSchemas: Record<string, string> = {}

  const moduleDirs: string[] = []

  for (const [moduleDir, collections] of Object.entries(moduleCollectionsMap)) {
    const [moduleDirPath, moduleDirName] = moduleDir.split('|')

    if (!collections.length) {
      LoggingService.warn(
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

    LoggingService.debug(
      `Created schema file for module ${chalk.bold(moduleDirName)} at ${chalk.bold(`lib/${moduleDirName}/schema.ts`)}`
    )
  }

  const mainSchemaContent = generateMainSchemaContent(moduleDirs)

  return { moduleSchemas, mainSchemaContent }
}

// Main execution function
async function main(): Promise<void> {
  try {
    LoggingService.info('Starting schema generation process...')

    // Setup
    const env = validateEnvironment()

    const pb = await authenticatePocketBase(env)

    // Fetch collections
    LoggingService.debug('Fetching collections from PocketBase...')

    const allCollections = await pb.collections.getFullList()

    const userCollections = allCollections.filter(
      collection => !collection.system
    )

    LoggingService.info(
      `Found ${userCollections.length} user-defined collections`
    )

    // Build module mapping
    const moduleCollectionsMap =
      await buildModuleCollectionsMap(userCollections)

    // Generate schemas
    const { moduleSchemas, mainSchemaContent } =
      await generateSchemas(moduleCollectionsMap)

    // Write main schema file
    await writeFormattedFile(PATHS.CORE_SCHEMA, mainSchemaContent)
    LoggingService.debug(
      `Updated main schema file at ${chalk.bold('core/schema.ts')}`
    )

    // Summary
    const moduleCount = Object.keys(moduleSchemas).length

    LoggingService.info(
      `Schema generation completed! Created ${moduleCount} module schema files.`
    )
  } catch (error) {
    LoggingService.error(`Schema generation failed: ${error}`)
    process.exit(1)
  }
}

// Execute if this file is run directly
if (require.main === module) {
  main().catch(error => {
    LoggingService.error(`Unhandled error: ${error}`)
    process.exit(1)
  })
}
