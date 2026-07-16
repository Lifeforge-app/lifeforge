import { ROOT_DIR } from '@constants'
import { createServiceLogger } from '@functions/logging'
import chalk from 'chalk'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

import { registerModule } from './moduleRegistry'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const logger = createServiceLogger('Route Loader')

export function generateModuleId(packageName: string): string {
  return crypto.createHash('sha256').update(packageName).digest('hex')
}

function registerModuleMetadata(
  appsDir: string,
  modDir: string
): { key: string; name: string } | null {
  const pkgPath = path.join(appsDir, modDir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    return null
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const key = generateModuleId(pkg.name)

    const localesPath = path.join(appsDir, modDir, 'locales')

    let supportedLangs: string[] = []

    if (fs.existsSync(localesPath) && fs.statSync(localesPath).isDirectory()) {
      supportedLangs = fs
        .readdirSync(localesPath)
        .filter(file => file.endsWith('.json'))
        .map(file => file.substring(0, file.length - 5))
    }

    registerModule(key, pkg.name, supportedLangs)

    return { key, name: pkg.name }
  } catch (error) {
    logger.error(`Failed to process module ${modDir}: ${error}`)

    return null
  }
}

/**
 * Dynamically loads module routes.
 * - In production: loads from pre-bundled dist/index.js
 * - In development: loads from TypeScript source (Pnpm runs TS natively)
 */
export async function loadModuleRoutes(): Promise<Record<string, unknown>> {
  logger.info(
    `Detected ${chalk.blue(process.env.NODE_ENV === 'production' ? 'production' : 'development')} environment, loading ${IS_PRODUCTION ? chalk.green('bundled') : chalk.yellow('source')} routes`
  )

  const appsDir = path.join(ROOT_DIR, 'modules')

  if (!fs.existsSync(appsDir)) {
    logger.warn('Apps directory not found, no module routes loaded')

    return {}
  }

  const modules: Record<string, unknown> = {}

  for (const modDir of fs.readdirSync(appsDir)) {
    const metadata = registerModuleMetadata(appsDir, modDir)

    if (!metadata) {
      continue
    }

    const { key } = metadata

    // In production, load from bundled dist only; skip unbundled modules
    const distPath = path.join(appsDir, modDir, 'server', 'dist', 'index.js')
    const sourcePath = path.join(appsDir, modDir, 'server', 'index.ts')

    const modulePath =
      (IS_PRODUCTION || !fs.existsSync(sourcePath)) && fs.existsSync(distPath)
        ? distPath
        : !IS_PRODUCTION && fs.existsSync(sourcePath)
          ? sourcePath
          : null

    if (!modulePath) {
      if (IS_PRODUCTION) {
        logger.warn(
          `Skipping unbundled module ${chalk.yellow(modDir)} - no dist/index.js found`
        )
      }

      continue
    }

    try {
      const mod = await import(modulePath)

      if (mod.default) {
        modules[key] = mod.default
      } else {
        logger.warn(`Module ${modDir} has no default export`)
      }
    } catch (importError) {
      logger.error(`Failed to load routes from ${modDir}: ${importError}`)
    }
  }

  logger.info(
    `Loaded routes from ${chalk.green(Object.keys(modules).length)} module(s)`
  )

  return modules
}
