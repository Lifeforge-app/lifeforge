import fs from 'fs'
import path from 'path'
import z from 'zod'

import logger from '@/utils/logger'

const MODULE_STRUCTURE: Array<{
  type: 'folder' | 'file'
  name: string
  required: boolean
  validate?: (content: string) => Promise<boolean> | boolean
  errorMessage: string
}> = [
  {
    type: 'folder',
    name: 'client',
    required: true,
    errorMessage: 'Missing client/ directory'
  },
  {
    type: 'folder',
    name: 'server',
    required: false,
    errorMessage: 'Missing server/ directory'
  },
  {
    type: 'folder',
    name: 'locales',
    required: true,
    errorMessage: 'Missing locales/ directory'
  },
  {
    type: 'file',
    name: 'package.json',
    required: true,
    validate: async (content: string) => {
      const json = JSON.parse(content)

      const { packageJSONSchema } = await import('shared')

      const result = z.safeParse(packageJSONSchema, json)

      return result.success
    },
    errorMessage: 'Missing package.json'
  },
  {
    type: 'file',
    name: 'client/manifest.ts',
    required: true,
    errorMessage: 'Missing client/manifest.ts (federation manifest)'
  },
  {
    type: 'file',
    name: 'client/vite.config.ts',
    required: true,
    errorMessage: 'Missing client/vite.config.ts (federation config)'
  },
  {
    type: 'file',
    name: 'client/tsconfig.json',
    required: true,
    errorMessage: 'Missing client/tsconfig.json'
  }
]

/**
 * Validates the structure of a module based on the MODULE_STRUCTURE constant.
 * Exits the process if any validation fails.
 *
 * @param modulePath - The path to the module directory.
 */
export default async function validateModuleStructure(
  modulePath: string
): Promise<void> {
  const errors: string[] = []

  for (const item of MODULE_STRUCTURE) {
    const itemPath = path.join(modulePath, item.name)

    const exists =
      item.type === 'folder'
        ? fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory()
        : fs.existsSync(itemPath) && fs.statSync(itemPath).isFile()

    if (!exists) {
      if (item.required) {
        errors.push(item.errorMessage)
      }
      continue
    }

    if (item.validate && item.type === 'file') {
      const content = fs.readFileSync(itemPath, 'utf-8')

      const isValid = await item.validate(content)

      if (!isValid) {
        errors.push(`${item.name} validation failed`)
      }
    }
  }

  if (errors.length > 0) {
    logger.error('Module validation failed:')
    errors.forEach(error => {
      logger.error(`  ✗ ${error}`)
    })
    process.exit(1)
  }
}
