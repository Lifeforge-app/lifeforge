import { ROOT_DIR } from '@constants'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { coreLogger } from '../../..'

// Use globalThis to ensure cache works across bundler-duplicated modules
const SCHEMA_CACHE_KEY = '__lifeforge_module_schemas__'

/**
 * Dynamically loads module schemas from TypeScript source files.
 * Bun runs TypeScript natively, so no bundling is needed.
 * Results are cached to prevent double loading.
 */
export async function loadModuleSchemas(): Promise<Record<string, unknown>> {
  if ((globalThis as any)[SCHEMA_CACHE_KEY]) {
    return (globalThis as any)[SCHEMA_CACHE_KEY]
  }

  const appsDir = path.join(ROOT_DIR, 'apps')

  if (!fs.existsSync(appsDir)) {
    coreLogger.warn('Apps directory not found, no module schemas loaded')

    return {}
  }

  const schemas: Record<string, unknown> = {}

  for (const modDir of fs.readdirSync(appsDir)) {
    const schemaPath = path.join(appsDir, modDir, 'server', 'schema.ts')

    if (!fs.existsSync(schemaPath)) {
      continue
    }

    try {
      const mod = await import(schemaPath)

      // Schema file exports default
      if (!mod.default) {
        continue
      }

      const key = modDir.includes('--')
        ? modDir.startsWith('lifeforge--')
          ? _.camelCase(modDir.split('--')[1])
          : `${modDir.split('--')[0]}$${_.camelCase(modDir.split('--')[1])}`
        : _.camelCase(modDir)

      schemas[key] = mod.default
    } catch (error) {
      coreLogger.error(`Failed to load schemas from ${modDir}: ${error}`)
    }
  }

  const count = Object.keys(schemas).length

  if (count > 0) {
    coreLogger.info(`Loaded ${count} module schema(s)`)
  }

  ;(globalThis as any)[SCHEMA_CACHE_KEY] = schemas

  return schemas
}
