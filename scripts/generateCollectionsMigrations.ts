import { LoggingService } from '@server/core/functions/logging/loggingService'
import chalk from 'chalk'
import { execSync } from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import prettier from 'prettier'

// Types
interface Environment {
  PB_DIR: string
}

interface SchemaModule {
  moduleName: string
  schema: Record<string, { raw: unknown }>
}

interface MigrationResult {
  success: boolean
  migrationPath?: string
  error?: string
}

// Constants
const PATHS = {
  ENV_FILE: path.resolve(__dirname, '../env/.env.local'),
  MODULES_DIR: path.resolve(__dirname, '../server/src/lib')
} as const

// Environment validation
function validateEnvironment(): Environment {
  dotenv.config({ path: PATHS.ENV_FILE })

  const { PB_DIR } = process.env

  if (!PB_DIR) {
    LoggingService.error('Missing required environment variable: PB_DIR')
    process.exit(1)
  }

  return { PB_DIR }
}

// Validate PocketBase setup
async function validatePocketBaseSetup(pbDir: string): Promise<{
  pbInstancePath: string
  pbDir: string
}> {
  const resolvedPbDir = path.resolve(pbDir)

  const pbInstancePath = path.resolve(resolvedPbDir, 'pocketbase')

  try {
    await fs.access(resolvedPbDir)
  } catch {
    LoggingService.error('PocketBase directory does not exist')
    process.exit(1)
  }

  try {
    await fs.access(pbInstancePath)
  } catch {
    LoggingService.error(
      'PocketBase binary not found in the specified directory'
    )
    process.exit(1)
  }

  return { pbInstancePath, pbDir: resolvedPbDir }
}

// Check for running PocketBase instances
function checkRunningInstances(): void {
  try {
    const pbInstanceNumber = execSync("pgrep -f 'pocketbase serve'")
      .toString()
      .trim()

    if (pbInstanceNumber) {
      LoggingService.error(
        `PocketBase is already running (PID: ${chalk.bold.blue(pbInstanceNumber)}). Please stop the existing instance before running the migration script.`
      )
      process.exit(1)
    }
  } catch {
    // No existing instance found, continue with the script
  }
}

// Clean up old migrations
async function cleanupOldMigrations(
  pbDir: string,
  pbInstancePath: string
): Promise<void> {
  const migrationsPath = path.resolve(pbDir, 'pb_migrations')

  try {
    await fs.access(migrationsPath)

    LoggingService.warn('Cleaning up old migrations directory...')

    await fs.rm(migrationsPath, { recursive: true, force: true })

    execSync(`${pbInstancePath} migrate history-sync`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
  } catch {
    // Migrations directory doesn't exist, no cleanup needed
  }
}

// Get schema files based on target module
async function getSchemaFiles(targetModule?: string): Promise<string[]> {
  const { globSync } = await import('glob')

  const allSchemas = globSync('./server/src/lib/**/schema.ts')

  const filteredSchemas = targetModule
    ? allSchemas.filter(schemaPath => {
        const moduleName = schemaPath.split('/').slice(-2, -1)[0]

        return moduleName === targetModule
      })
    : allSchemas

  if (targetModule && filteredSchemas.length === 0) {
    const availableModules = allSchemas
      .map(schemaPath => schemaPath.split('/').slice(-2, -1)[0])
      .join(', ')

    LoggingService.error(
      `Module "${chalk.bold.blue(targetModule)}" not found. Available modules: ${availableModules}`
    )
    process.exit(1)
  }

  return filteredSchemas
}

// Import schema modules
async function importSchemaModules(
  schemaFiles: string[]
): Promise<SchemaModule[]> {
  return Promise.all(
    schemaFiles.map(async schemaPath => {
      const module = await import(path.resolve(schemaPath))

      return {
        moduleName: schemaPath.split('/').slice(-2, -1)[0],
        schema: module.default
      }
    })
  )
}

// Generate migration content
function generateMigrationContent(schema: Record<string, { raw: any }>): {
  upContent: string
  downContent: string
} {
  const upContent =
    Object.entries(schema)
      .map(([name, { raw }]) => {
        return `  const ${name}Collection = ${JSON.stringify(raw, null, 2)};`
      })
      .join('\n\n') +
    '\n\napp.importCollections([' +
    Object.keys(schema)
      .map(name => `  ${name}Collection`)
      .join(',\n') +
    ']);'

  const downContent = Object.values(schema)
    .map(({ raw }) => {
      return `  let ${raw.name}Collection = app.findCollectionByNameOrId("${raw.id}");\n app.delete(${raw.name}Collection);`
    })
    .join('\n\n')

  return { upContent, downContent }
}

// Create and process migration file
async function createMigrationFile(
  moduleName: string,
  schema: Record<string, { raw: any }>,
  pbInstancePath: string
): Promise<MigrationResult> {
  try {
    const response = execSync(
      `${pbInstancePath} migrate create ${moduleName}`,
      {
        input: 'y\n',
        stdio: ['pipe', 'pipe', 'pipe']
      }
    )

    const resString = response.toString()

    const match = resString.match(/Successfully created file "(.*)"/)

    if (!match || match.length < 2) {
      throw new Error('Failed to parse migration file path from response.')
    }

    const migrationFilePath = match[1]

    // Use sync version for file existence check since we need it immediately
    const syncFs = await import('fs')

    if (!syncFs.existsSync(migrationFilePath)) {
      throw new Error(`Migration file not found at path: ${migrationFilePath}`)
    }

    LoggingService.debug(
      `Created migration file for module ${chalk.bold.blue(
        moduleName
      )} at ${chalk.bold.blue(migrationFilePath)}`
    )

    const { upContent, downContent } = generateMigrationContent(schema)

    // Read and modify migration file
    let content = await fs.readFile(migrationFilePath, 'utf-8')

    content = content
      .replace('// add up queries...', upContent)
      .replace('// add down queries...', downContent)

    const formattedContent = await prettier.format(content, {
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 80
    })

    await fs.writeFile(migrationFilePath, formattedContent, 'utf-8')

    LoggingService.info(
      `Migration for module ${chalk.bold.blue(moduleName)} created successfully.`
    )

    return { success: true, migrationPath: migrationFilePath }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    LoggingService.error(
      `Failed to create migration for module ${chalk.bold.blue(moduleName)}: ${errorMessage}`
    )

    return { success: false, error: errorMessage }
  }
}

// Process all migrations
async function processMigrations(
  schemaModules: SchemaModule[],
  pbInstancePath: string
): Promise<void> {
  for (const { moduleName, schema } of schemaModules) {
    const result = await createMigrationFile(moduleName, schema, pbInstancePath)

    if (!result.success) {
      LoggingService.error(`Migration process failed for module ${moduleName}`)
      process.exit(1)
    }
  }
}

// Main execution function
async function main(): Promise<void> {
  try {
    LoggingService.info('Starting migration script...')

    // Get target module from command line arguments
    const targetModule = process.argv[2]

    // Setup and validation
    const env = validateEnvironment()

    const { pbInstancePath, pbDir } = await validatePocketBaseSetup(env.PB_DIR)

    // Check for running instances
    checkRunningInstances()

    // Clean up old migrations
    await cleanupOldMigrations(pbDir, pbInstancePath)

    // Get and process schema files
    const schemaFiles = await getSchemaFiles(targetModule)

    LoggingService.info(
      targetModule
        ? `Processing module: ${chalk.bold.blue(targetModule)}`
        : `Found ${chalk.bold.blue(schemaFiles.length)} schema files.`
    )

    const importedSchemas = await importSchemaModules(schemaFiles)

    // Process migrations
    await processMigrations(importedSchemas, pbInstancePath)

    // Summary
    LoggingService.info(
      targetModule
        ? `Migration script completed for module ${chalk.bold.blue(
            targetModule
          )}. Start the PocketBase server or run the command "pocketbase migrate up" to apply migrations.`
        : 'Migration script completed. Start the PocketBase server or run the command "pocketbase migrate up" to apply migrations.'
    )
  } catch (error) {
    LoggingService.error(
      `Migration script failed: ${error instanceof Error ? error.message : String(error)}`
    )
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
