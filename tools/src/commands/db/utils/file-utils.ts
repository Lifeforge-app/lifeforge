import fs from 'fs'
import path from 'path'
import prettier from 'prettier'

import { ROOT_DIR } from '@/constants/constants'
import logger from '@/utils/logger'

import { PRETTIER_OPTIONS } from './constants'

/**
 * Writes a formatted file with prettier
 */
export async function writeFormattedFile(
  modulePath: string,
  content: string
): Promise<void> {
  let filePath

  if (fs.existsSync(path.join(modulePath, 'server/schema.ts'))) {
    filePath = path.join(modulePath, 'server/schema.ts')
  } else {
    filePath = path.join(modulePath, 'schema.ts')
  }

  try {
    const formattedContent = await prettier.format(content, PRETTIER_OPTIONS)

    fs.writeFileSync(filePath, formattedContent)
  } catch (error) {
    logger.error(`Failed to write file ${filePath}: ${error}`)
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
    ...fs.globSync(path.resolve(ROOT_DIR, './server/src/lib/**/schema.ts')),
    ...fs.globSync(path.resolve(ROOT_DIR, './apps/**/server/schema.ts'))
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

    logger.error(
      `Module "${targetModule}" not found. Available modules: ${availableModules}`
    )
    process.exit(1)
  }

  return filteredSchemas
}

/**
 * Imports schema modules from file paths
 */
export async function importSchemaModules(targetModule?: string): Promise<
  Array<{
    moduleName: string
    schema: Record<string, { raw: Record<string, unknown> }>
  }>
> {
  const schemaFiles = getSchemaFiles(targetModule)

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
