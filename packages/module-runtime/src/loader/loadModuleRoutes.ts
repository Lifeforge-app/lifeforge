import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

import type { ModuleEntry } from '@lifeforge/configs'

import { ModuleRegistry } from '../registry/ModuleRegistry'

import gatherModuleMetadata from './gatherModuleMetadata'
import { loaderLogger } from './logger'
import registerDevResolverHooks from './registerDevResolverHooks'

/** Cache of moduleId -> imported server route tree, reused across reloads. */
const routeTrees = new Map<string, ModuleEntry>()

let hooksRegistered = false

/**
 * Dynamically loads (and reconciles) module routes.
 * - In production: loads from pre-bundled dist/index.js
 * - In development: loads from TypeScript source (Pnpm runs TS natively)
 *
 * Safe to call repeatedly at runtime: modules already imported are reused,
 * modules whose directory disappeared are unregistered, and newly installed
 * modules are imported.
 */
export async function loadModuleRoutes(options: {
  modulesDir: string
  isProduction: boolean
}): Promise<Record<string, ModuleEntry>> {
  const { modulesDir, isProduction } = options

  if (!isProduction && !hooksRegistered) {
    registerDevResolverHooks()
    hooksRegistered = true
  }

  if (!fs.existsSync(modulesDir)) {
    for (const entry of ModuleRegistry.entries) {
      ModuleRegistry.unregister(entry.name)
      routeTrees.delete(entry.moduleId)
    }

    loaderLogger.warn('Modules directory not found, no module routes loaded')

    return {}
  }

  // Drop modules whose directory has been removed from disk.
  for (const entry of ModuleRegistry.entries) {
    const moduleDir = ModuleRegistry.getPath(entry.name)

    if (!moduleDir || !fs.existsSync(moduleDir)) {
      ModuleRegistry.unregister(entry.name)
      routeTrees.delete(entry.moduleId)

      loaderLogger.info(
        `Unregistered removed module ${chalk.yellow(entry.displayName)}`
      )
    }
  }

  for (const dirent of fs.readdirSync(modulesDir, { withFileTypes: true })) {
    // Only treat real, non-hidden directories as modules.
    if (!dirent.isDirectory() || dirent.name.startsWith('.')) {
      continue
    }

    const modDir = dirent.name
    const moduleDir = path.join(modulesDir, modDir)

    const metadata = await gatherModuleMetadata(moduleDir, isProduction)

    // Continue if failing to parse metadata
    if (!metadata) {
      continue
    }

    // If module doesn't have server routes (client only module),
    // simply register the entry, no further action needed.
    if (!metadata.hasServerRoutes) {
      const { hasServerRoutes: _, ...entry } = metadata
      ModuleRegistry.register(entry, moduleDir)
      continue
    }

    const distPath = path.join(moduleDir, 'server', 'dist', 'index.js')
    const sourcePath = path.join(moduleDir, 'server', 'index.ts')

    // In production, always load distPath.
    // In development, prefer source path, falling back to dist path if exists.
    const modulePath = (() => {
      if (isProduction) {
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
      loaderLogger.warn(
        `Skipping module ${chalk.yellow(metadata.displayName)}: No available server file found.`
      )

      continue
    }

    const { hasServerRoutes: _, ...entry } = metadata
    ModuleRegistry.register(entry, moduleDir)

    // Already imported in a previous load: reuse the cached route tree.
    if (routeTrees.has(metadata.moduleId)) {
      continue
    }

    try {
      const version = fs.statSync(modulePath).mtimeMs
      const mod = await import(`${pathToFileURL(modulePath).href}?v=${version}`)

      if (mod.default) {
        routeTrees.set(metadata.moduleId, mod.default)
      } else {
        ModuleRegistry.unregister(entry.name)
        loaderLogger.warn(
          `Skipping module ${chalk.yellow(metadata.displayName)}: The server file has no default export`
        )
      }
    } catch (importError) {
      ModuleRegistry.unregister(metadata.name)
      loaderLogger.warn(
        `Skipping module ${chalk.yellow(metadata.displayName)}: ${importError}`
      )
    }
  }

  loaderLogger.info(
    `Loaded ${chalk.green(Object.keys(ModuleRegistry.entries).length)} module(s): ${chalk.dim(
      Object.values(ModuleRegistry.entries)
        .map(e => e.displayName)
        .sort()
        .join(', ')
    )}`
  )

  return Object.fromEntries(routeTrees)
}
