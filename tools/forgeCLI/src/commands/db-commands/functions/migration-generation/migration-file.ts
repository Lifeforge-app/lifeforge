import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import prettier from 'prettier'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import CLILoggingService from '@/utils/logging'

import { PRETTIER_OPTIONS } from '../../utils'
import { generateMigrationContent } from './migration-content'

/**
 * Creates a migration file for a module
 */
export async function createMigrationFile(
  moduleName: string,
  schema: Record<string, { raw: Record<string, unknown> }>
): Promise<{ success: boolean; migrationPath?: string; error?: string }> {
  try {
    const response = execSync(
      `${PB_BINARY_PATH} migrate create ${moduleName} ${PB_KWARGS.join(' ')}`,
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

    CLILoggingService.debug(
      `Created migration file for module ${chalk.bold.blue(
        moduleName
      )} at ${chalk.bold.blue(migrationFilePath)}`
    )

    const { upContent, downContent } = generateMigrationContent(schema)

    let content = fs.readFileSync(migrationFilePath, 'utf-8')
    content = content
      .replace('// add up queries...', upContent)
      .replace('// add down queries...', downContent)

    const formattedContent = await prettier.format(content, PRETTIER_OPTIONS)

    fs.writeFileSync(migrationFilePath, formattedContent, 'utf-8')

    CLILoggingService.info(
      `Migration for module ${chalk.bold.blue(moduleName)} created successfully with ${chalk.bold.blue(Object.keys(schema).length)} collections.`
    )

    return { success: true, migrationPath: migrationFilePath }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    CLILoggingService.error(
      `Failed to create migration for module ${chalk.bold.blue(moduleName)}: ${errorMessage}`
    )

    return { success: false, error: errorMessage }
  }
}
