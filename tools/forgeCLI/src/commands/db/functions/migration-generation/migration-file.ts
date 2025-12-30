import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import prettier from 'prettier'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import CLILoggingService from '@/utils/logging'

import { PRETTIER_OPTIONS } from '../../utils'
import {
  generateSkeletonMigrationContent,
  generateStructureMigrationContent,
  generateViewQueryMigrationContent
} from './migration-content'

/**
 * Creates a single migration file with custom content
 */
async function createSingleMigration(
  name: string,
  upContent: string,
  downContent: string
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const response = execSync(
      `${PB_BINARY_PATH} migrate create ${name} ${PB_KWARGS.join(' ')}`,
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

    if (!fs.existsSync(migrationFilePath)) {
      throw new Error(`Migration file not found at path: ${migrationFilePath}`)
    }

    let content = fs.readFileSync(migrationFilePath, 'utf-8')

    content = content
      .replace('../pb_data/types.d.ts', '../types.d.ts')
      .replace('// add up queries...', upContent)
      .replace('// add down queries...', downContent)

    const formattedContent = await prettier.format(content, PRETTIER_OPTIONS)

    fs.writeFileSync(migrationFilePath, formattedContent, 'utf-8')

    return { success: true, path: migrationFilePath }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Creates skeleton migration for a module (stub collections)
 */
export async function createSkeletonMigration(
  moduleName: string,
  schema: Record<string, { raw: Record<string, unknown> }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const skeleton = generateSkeletonMigrationContent(schema)

    const result = await createSingleMigration(
      `01_${moduleName}_skeleton`,
      skeleton.upContent,
      skeleton.downContent
    )

    if (!result.success) {
      throw new Error(`Skeleton migration failed: ${result.error}`)
    }

    CLILoggingService.debug(
      `Created skeleton migration for ${chalk.bold.blue(moduleName)}`
    )

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    CLILoggingService.error(
      `Failed to create skeleton migration for ${chalk.bold.blue(moduleName)}: ${errorMessage}`
    )

    return { success: false, error: errorMessage }
  }
}

/**
 * Creates structure migration for a module (full schema with relations)
 */
export async function createStructureMigration(
  moduleName: string,
  schema: Record<string, { raw: Record<string, unknown> }>,
  idToNameMap: Map<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    const structure = generateStructureMigrationContent(schema, idToNameMap)

    const result = await createSingleMigration(
      `02_${moduleName}_structure`,
      structure.upContent,
      structure.downContent
    )

    if (!result.success) {
      throw new Error(`Structure migration failed: ${result.error}`)
    }

    CLILoggingService.debug(
      `Created structure migration for ${chalk.bold.blue(moduleName)}`
    )

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    CLILoggingService.error(
      `Failed to create structure migration for ${chalk.bold.blue(moduleName)}: ${errorMessage}`
    )

    return { success: false, error: errorMessage }
  }
}

/**
 * Runs migrate up to apply pending migrations
 */
export function runMigrateUp(): void {
  CLILoggingService.info('Applying pending migrations...')

  execSync(`${PB_BINARY_PATH} migrate up ${PB_KWARGS.join(' ')}`, {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  CLILoggingService.success('Migrations applied successfully')
}

/**
 * Creates view query migration for a module (updates viewQuery on view collections)
 */
export async function createViewQueryMigration(
  moduleName: string,
  schema: Record<string, { raw: Record<string, unknown> }>
): Promise<{ success: boolean; hasViews: boolean; error?: string }> {
  try {
    const viewQuery = generateViewQueryMigrationContent(schema)

    if (!viewQuery.hasViews) {
      return { success: true, hasViews: false }
    }

    const result = await createSingleMigration(
      `03_${moduleName}_views`,
      viewQuery.upContent,
      viewQuery.downContent
    )

    if (!result.success) {
      throw new Error(`View query migration failed: ${result.error}`)
    }

    CLILoggingService.debug(
      `Created view query migration for ${chalk.bold.blue(moduleName)}`
    )

    return { success: true, hasViews: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    CLILoggingService.error(
      `Failed to create view query migration for ${chalk.bold.blue(moduleName)}: ${errorMessage}`
    )

    return { success: false, hasViews: false, error: errorMessage }
  }
}
