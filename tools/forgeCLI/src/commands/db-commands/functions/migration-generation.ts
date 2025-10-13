import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import prettier from 'prettier'

import { CLILoggingService } from '../../../utils/logging'
import { MIGRATION_PRETTIER_OPTIONS } from '../utils/constants'
import type { MigrationResult } from '../utils/types'

/**
 * Migration generation utilities
 */

/**
 * Generates migration file content
 */
export function generateMigrationContent(
  schema: Record<string, { raw: any }>
): {
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

/**
 * Creates a migration file for a module
 */
export async function createMigrationFile(
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

    const formattedContent = await prettier.format(
      content,
      MIGRATION_PRETTIER_OPTIONS
    )

    fs.writeFileSync(migrationFilePath, formattedContent, 'utf-8')

    CLILoggingService.info(
      `Migration for module ${chalk.bold.blue(moduleName)} created successfully.`
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
