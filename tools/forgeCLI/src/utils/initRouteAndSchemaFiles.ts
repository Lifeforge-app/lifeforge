import fs from 'fs'
import path from 'path'

import CLILoggingService from './logging'
import { generateDatabaseSchemas } from '@/commands/modules/functions'

const ROOT_DIR = path.resolve(
  import.meta.dirname.split('tools')[0],
  'server/src/core'
)

export default function initRouteAndSchemaFiles(): {
  appRoutesPath: string
  schemaPath: string
} {
  const appRoutesPath = path.resolve(ROOT_DIR, 'routes/app.routes.ts')

  const schemaPath = path.resolve(ROOT_DIR, 'schema.ts')

  const templatesDir = path.resolve(ROOT_DIR, 'templates')

  if (!fs.existsSync(appRoutesPath)) {
    CLILoggingService.info('app.routes.ts not found, creating from template...')
    fs.copyFileSync(path.join(templatesDir, 'example.routes.ts'), appRoutesPath)
  }

  if (!fs.existsSync(schemaPath)) {
    CLILoggingService.info('schema.ts not found, creating from template...')
    fs.copyFileSync(path.join(templatesDir, 'example.schema.ts'), schemaPath)

    generateDatabaseSchemas()
  }

  return {
    appRoutesPath,
    schemaPath
  }
}
