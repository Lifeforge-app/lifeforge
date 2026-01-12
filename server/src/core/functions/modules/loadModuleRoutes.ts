import { ROOT_DIR } from '@constants'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { coreLogger } from '@functions/logging'

/**
 * Dynamically loads module routes from TypeScript source files.
 * Bun runs TypeScript natively, so no bundling is needed.
 * Falls back to dist/index.js if source not found.
 */
export async function loadModuleRoutes(): Promise<Record<string, unknown>> {
  const appsDir = path.join(ROOT_DIR, 'apps')

  if (!fs.existsSync(appsDir)) {
    coreLogger.warn('Apps directory not found, no module routes loaded')

    return {}
  }

  const modules: Record<string, unknown> = {}

  for (const modDir of fs.readdirSync(appsDir)) {
    const modulePath = path.join(appsDir, modDir, 'server', 'index.ts')

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
        coreLogger.warn(`Module ${modDir} has no default export`)
        continue
      }

      modules[key] = mod.default
    } catch (error) {
      coreLogger.error(`Failed to load routes from ${modDir}: ${error}`)
    }
  }

  coreLogger.info(`Loaded ${Object.keys(modules).length} module route(s)`)

  return modules
}
