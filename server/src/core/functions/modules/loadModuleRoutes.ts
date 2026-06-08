import { ROOT_DIR } from '@constants'
import { createServiceLogger } from '@functions/logging'
import chalk from 'chalk'
import crypto from 'crypto'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const logger = createServiceLogger('Route Loader')

export function generateModuleId(packageName: string): string {
  return crypto.createHash('sha256').update(packageName).digest('hex')
}

/**
 * Dynamically loads module routes.
 * - In production: loads from pre-bundled dist/index.js
 * - In development: loads from TypeScript source (Bun runs TS natively)
 */
export async function loadModuleRoutes(): Promise<Record<string, unknown>> {
  logger.info(
    `Detected ${chalk.blue(process.env.NODE_ENV === 'production' ? 'production' : 'development')} environment, loading ${IS_PRODUCTION ? chalk.green('bundled') : chalk.yellow('source')} routes`
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

    // Load from dist if in production or if source code does not exist
    const modulePath =
      (IS_PRODUCTION || !fs.existsSync(sourcePath)) && fs.existsSync(distPath)
        ? distPath
        : sourcePath

    if (!fs.existsSync(modulePath)) {
      continue
    }

    try {
      const mod = await import(modulePath)

      const pkgPath = path.join(appsDir, modDir, 'package.json')
      if (!fs.existsSync(pkgPath)) {
        continue
      }
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      const key = generateModuleId(pkg.name)

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
