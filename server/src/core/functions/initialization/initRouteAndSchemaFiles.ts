import fs from 'fs'
import path from 'path'

import { LoggingService } from '@functions/logging/loggingService'

const ROOT_DIR = path.resolve(import.meta.dirname.split('core')[0], 'core')

/**
 * Initializes the route and schema files.
 * Creates the files from templates if they do not exist.
 */
export default function initRouteAndSchemaFiles(): void {
  const appRoutesPath = path.resolve(ROOT_DIR, 'routes/app.routes.ts')

  const schemaPath = path.resolve(ROOT_DIR, 'schema.ts')

  const templatesDir = path.resolve(ROOT_DIR, 'templates')

  if (!fs.existsSync(appRoutesPath)) {
    LoggingService.info(
      'app.routes.ts not found, creating from template...',
      'INIT'
    )
    fs.copyFileSync(path.join(templatesDir, 'example.routes.ts'), appRoutesPath)
  }

  if (!fs.existsSync(schemaPath)) {
    LoggingService.info(
      'schema.ts not found, creating from template...',
      'INIT'
    )
    fs.copyFileSync(path.join(templatesDir, 'example.schema.ts'), schemaPath)
  }
}
