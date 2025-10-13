import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import prettier from 'prettier'

import { CLILoggingService } from '../../../utils/logging'
import { PRETTIER_OPTIONS } from './constants'
import type { Environment } from './types'

/**
 * Validation and utility functions for database commands
 */

/**
 * Validates and loads environment configuration
 */
export function validateEnvironment(): Environment {
  dotenv.config({
    path: path.resolve(__dirname, '../../../../../env/.env.local')
  })

  return process.env as Environment
}

/**
 * Writes a formatted file with prettier
 */
export async function writeFormattedFile(
  filePath: string,
  content: string
): Promise<void> {
  try {
    const formattedContent = await prettier.format(content, PRETTIER_OPTIONS)

    fs.writeFileSync(filePath, formattedContent)
  } catch (error) {
    CLILoggingService.error(`Failed to write file ${filePath}: ${error}`)
    throw error
  }
}

function getModuleName(schemaPath: string): string | null {
  return (
    schemaPath
      .split('/')
      .slice(0, -1)
      .join('/')
      .replace(/\/server$/, '')
      .split('/')
      .pop() || null
  )
}

/**
 * Gets all schema files, optionally filtered by target module
 */
export function getSchemaFiles(targetModule?: string): string[] {
  const allSchemas = [
    ...fs.globSync('./server/src/lib/**/schema.ts'),
    ...fs.globSync('./apps/**/server/schema.ts')
  ]

  const filteredSchemas = targetModule
    ? allSchemas.filter(
        (schemaPath: string) => getModuleName(schemaPath) === targetModule
      )
    : allSchemas

  if (targetModule && filteredSchemas.length === 0) {
    const availableModules = allSchemas
      .map((schemaPath: string) => getModuleName(schemaPath))
      .join(', ')

    CLILoggingService.error(
      `Module "${targetModule}" not found. Available modules: ${availableModules}`
    )
    process.exit(1)
  }

  return filteredSchemas
}

/**
 * Imports schema modules from file paths
 */
export async function importSchemaModules(
  schemaFiles: string[]
): Promise<
  Array<{ moduleName: string; schema: Record<string, { raw: unknown }> }>
> {
  return Promise.all(
    schemaFiles.map(async schemaPath => {
      const module = await import(path.resolve(schemaPath))

      return {
        moduleName: getModuleName(schemaPath) || 'unknown-module',
        schema: module.default
      }
    })
  )
}
