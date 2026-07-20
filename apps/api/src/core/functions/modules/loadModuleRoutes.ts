import { ROOT_DIR } from '@constants'
import { createServiceLogger } from '@functions/logging'
import chalk from 'chalk'
import { execSync } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import { registerHooks } from 'node:module'
import path from 'path'

import { ModuleRegistry } from './moduleRegistry'
import parseWidgetConfig from './parseWidgetConfig'
import { ModuleEntry, ModuleWidget, modulePackageJSONSchema } from './schemas'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const logger = createServiceLogger('Route Loader')

export function generateModuleId(packageName: string): string {
  return crypto.createHash('sha256').update(packageName).digest('hex')
}

function registerModuleMetadata(
  appsDir: string,
  modDir: string
): (ModuleEntry & { hasServerRoutes: boolean }) | null {
  const pkgPath = path.join(appsDir, modDir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    return null
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const parsed = modulePackageJSONSchema.safeParse(pkg)

    if (!parsed.success) {
      logger.error(
        `Failed to process module ${modDir}: invalid package.json - ${parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      )

      return null
    }

    const moduleId = generateModuleId(parsed.data.name)

    const localesPath = path.join(appsDir, modDir, 'locales')

    let supportedLangs: string[] = []

    if (fs.existsSync(localesPath) && fs.statSync(localesPath).isDirectory()) {
      supportedLangs = fs
        .readdirSync(localesPath)
        .filter(file => file.endsWith('.json'))
        .map(file => file.substring(0, file.length - 5))
    }

    const hasServerRoutes = fs.existsSync(path.join(appsDir, modDir, 'server'))

    const distDir = process.env.DOCKER_MODE === 'true' ? 'dist-docker' : 'dist'
    const clientDistPath = path.join(
      appsDir,
      modDir,
      'client',
      distDir,
      'remoteEntry.js'
    )
    const hasDist =
      fs.existsSync(clientDistPath) && fs.statSync(clientDistPath).size > 0

    let isDistValid = false

    if (hasDist) {
      try {
        execSync(`node --check "${clientDistPath}"`, { stdio: 'ignore' })
        isDistValid = true
      } catch {
        // syntax/check error
      }
    }

    const hasSource = fs.existsSync(path.join(appsDir, modDir, 'client/src'))

    // Discover widgets JIT at server load
    const widgets: ModuleWidget[] = []
    const widgetsDir = path.join(appsDir, modDir, 'client/src/widgets')

    if (fs.existsSync(widgetsDir)) {
      for (const file of fs.readdirSync(widgetsDir)) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const filePath = path.join(widgetsDir, file)
          const config = parseWidgetConfig(filePath)

          if (config) {
            widgets.push({
              id: config.id,
              icon: config.icon,
              minW: config.minW,
              minH: config.minH,
              maxW: config.maxW,
              maxH: config.maxH,
              moduleName: parsed.data.name,
              componentName: path.basename(file, path.extname(file))
            })
          }
        }
      }
    }

    return {
      moduleId,
      name: parsed.data.name,
      displayName: parsed.data.displayName,
      version: parsed.data.version,
      description: parsed.data.description,
      author: parsed.data.author,
      icon: parsed.data.lifeforge.icon,
      category: parsed.data.lifeforge.category,
      isInternal: false,
      supportedLangs,
      remoteEntryUrl: `/modules/${modDir}/remoteEntry.js`,
      APIKeyAccess: parsed.data.lifeforge.APIKeyAccess,
      hasDist: isDistValid,
      hasSource,
      widgets,
      hasServerRoutes
    }
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
  if (!IS_PRODUCTION) {
    try {
      registerHooks({
        resolve: (specifier, context, nextResolve) => {
          if (specifier.startsWith('@/')) {
            const parentURL = context.parentURL

            if (parentURL) {
              const match = parentURL.match(/(.*\/modules\/[^/]+\/server)\//)

              if (match) {
                const serverRoot = match[1]
                const relativePath = specifier.slice(2)
                const resolvedSpecifier = new URL(
                  relativePath,
                  serverRoot + '/'
                ).href

                return nextResolve(resolvedSpecifier, context)
              }
            }
          }

          return nextResolve(specifier, context)
        }
      })
    } catch (e) {
      logger.error(`Failed to register custom path alias resolver hooks: ${e}`)
    }
  }

  logger.info(
    `Detected ${chalk.blue(IS_PRODUCTION ? 'production' : 'development')} environment, loading ${IS_PRODUCTION ? chalk.green('bundled') : chalk.yellow('source')} routes`
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

    if (!metadata.hasServerRoutes) {
      const { hasServerRoutes, ...entry } = metadata
      ModuleRegistry.register(entry)
      continue
    }

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
        modules[metadata.moduleId] = mod.default
        const { hasServerRoutes, ...entry } = metadata
        ModuleRegistry.register(entry)
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
