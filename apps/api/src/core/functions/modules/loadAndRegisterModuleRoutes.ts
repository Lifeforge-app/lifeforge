import { ROOT_DIR } from '@constants'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import type { ModuleEntry } from '@lifeforge/configs'

import gatherModuleMetadata from './gatherModuleMetadata'
import { ModuleRegistry, moduleLoaderLogger } from './moduleRegistry'
import registerDevResolverHooks from './registerDevResolverHooks'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * Dynamically loads module routes.
 * - In production: loads from pre-bundled dist/index.js
 * - In development: loads from TypeScript source (Pnpm runs TS natively)
 */
export async function loadAndRegisterModuleRoutes(): Promise<
  Record<string, ModuleEntry>
> {
  if (!IS_PRODUCTION) registerDevResolverHooks()

  moduleLoaderLogger.info(
    `Detected ${chalk.blue(IS_PRODUCTION ? 'production' : 'development')} environment, loading ${IS_PRODUCTION ? chalk.green('bundled') : chalk.yellow('source')} routes`
  )

  const appsDir = path.join(ROOT_DIR, 'modules')

  if (!fs.existsSync(appsDir)) {
    moduleLoaderLogger.warn(
      'Modules directory not found, no module routes loaded'
    )

    return {}
  }

  const modules: Record<string, ModuleEntry> = {}

  for (const modDir of fs.readdirSync(appsDir)) {
    const metadata = gatherModuleMetadata(appsDir, modDir)

    // Continue if failing to parse metadata
    if (!metadata) {
      continue
    }

    // If module doesn't have server routes (client only module),
    // simply register the entry, no further action needed.
    if (!metadata.hasServerRoutes) {
      const { hasServerRoutes: _, ...entry } = metadata
      ModuleRegistry.register(entry)
      continue
    }

    const distPath = path.join(appsDir, modDir, 'server', 'dist', 'index.js')
    const sourcePath = path.join(appsDir, modDir, 'server', 'index.ts')

    // In production, always load distPath.
    // In development, prefer source path, falling back to dist path if exists.
    const modulePath = (() => {
      if (IS_PRODUCTION) {
        return fs.existsSync(distPath) ? distPath : null
      } else {
        return fs.existsSync(sourcePath)
          ? sourcePath
          : fs.existsSync(distPath)
            ? distPath
            : null
      }
    })()

    if (!modulePath) {
      moduleLoaderLogger.warn(
        `Skipping module ${chalk.yellow(metadata.displayName)}: No available server file found.`
      )

      continue
    }

    try {
      const mod = await import(modulePath)

      if (mod.default) {
        modules[metadata.moduleId] = mod.default
        const { hasServerRoutes: _, ...entry } = metadata
        ModuleRegistry.register(entry)
      } else {
        moduleLoaderLogger.warn(
          `Skipping module ${chalk.yellow(metadata.displayName)}: The server file has no default export`
        )
      }
    } catch (importError) {
      moduleLoaderLogger.warn(
        `Skipping module ${chalk.yellow(metadata.displayName)}: ${importError}`
      )
    }
  }

  moduleLoaderLogger.info(
    `Loaded ${chalk.green(Object.keys(ModuleRegistry.entries).length)} module(s): ${chalk.dim(
      Object.values(ModuleRegistry.entries)
        .map(e => e.displayName)
        .sort()
        .join(', ')
    )}`
  )

  return modules
}
