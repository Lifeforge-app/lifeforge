import { ROOT_DIR } from '@constants'
import chalk from 'chalk'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { createServiceLogger } from '@functions/logging'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const logger = createServiceLogger('Route Loader')

/**
 * Dynamically loads module routes.
 * - In production: loads from pre-bundled dist/index.js
 * - In development: loads from TypeScript source (Bun runs TS natively)
 */
export async function loadModuleRoutes(): Promise<Record<string, unknown>> {
  logger.info(
    `Detected ${chalk.blue(process.env.NODE_ENV)} environment, loading ${IS_PRODUCTION ? chalk.green('bundled') : chalk.yellow('source')} routes`
  )

  const appsDir = path.join(ROOT_DIR, 'apps')

  if (!fs.existsSync(appsDir)) {
    logger.warn('Apps directory not found, no module routes loaded')

    return {}
  }

  const modules: Record<string, unknown> = {}

  for (const modDir of fs.readdirSync(appsDir)) {
    // In production, load from bundled dist; in dev, load from source
    const distPath = path.join(appsDir, modDir, 'server', 'dist', 'index.js')

    const sourcePath = path.join(appsDir, modDir, 'server', 'index.ts')

    const modulePath =
      IS_PRODUCTION && fs.existsSync(distPath) ? distPath : sourcePath

    if (!fs.existsSync(modulePath)) {
      continue
    }

    try {
      const mod = await import(modulePath)

      const key = modDir.includes('--')
        ? modDir.startsWith('lifeforge--')
          ? _.camelCase(modDir.split('--')[1])
          : `${modDir.split('--')[0]}$${_.camelCase(modDir.split('--')[1])}`
        : _.camelCase(modDir)

      if (!mod.default) {
        logger.warn(`Module ${modDir} has no default export`)
        continue
      }

      modules[key] = mod.default
    } catch (error) {
      logger.error(`Failed to load routes from ${modDir}: ${error}`)
    }
  }

  logger.info(
    `Loaded routes from ${chalk.green(Object.keys(modules).length)} module(s)`
  )

  return modules
}
