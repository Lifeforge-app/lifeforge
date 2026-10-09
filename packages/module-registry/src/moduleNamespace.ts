import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { ModuleRegistry } from './registry/ModuleRegistry'

/** Extracts the calling module's absolute directory from the current stack. */
function detectCallerModuleDir(): string | undefined {
  const stack = new Error().stack

  for (const line of stack?.split('\n') ?? []) {
    const normalized = line.replace(/\\/g, '/')

    const pathMatch =
      normalized.match(/\((.+?):\d+:\d+\)/) ||
      normalized.match(/at (.+?):\d+:\d+/)

    const filePath = pathMatch?.[1]?.replace(/^file:\/\//, '')

    if (!filePath) continue

    const moduleMatch = filePath.match(/^(.*\/modules\/[^/]+)\//)

    if (moduleMatch) {
      return moduleMatch[1]
    }
  }

  return undefined
}

/** Reads a module's official id straight from its package.json as a fallback. */
function readModuleIdFromPackageJson(moduleDir: string): string | undefined {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(moduleDir, 'package.json'), 'utf-8')
    ) as { name?: string }

    return pkg.name
  } catch {
    return undefined
  }
}

/**
 * Resolves the official module id (its package.json `name`) of the module that
 * is currently being loaded, preferring the module registry and falling back to
 * the on-disk package.json (e.g. when schema files are loaded by tooling).
 */
export function resolveCallerModuleId(): string | undefined {
  const moduleDir = detectCallerModuleDir()

  if (!moduleDir) return undefined

  return (
    ModuleRegistry.getModuleIdByPath(moduleDir) ??
    readModuleIdFromPackageJson(moduleDir)
  )
}

/**
 * Derives a module's namespace from its official id:
 * - `@lifeforge/lifeforge--calendar` → `calendar`
 * - `@lifeforge/melvinchia3636--invoice-maker` → `melvinchia3636___invoice_maker`
 */
export function deriveModuleNamespace(moduleId: string): string {
  const scopedName = moduleId.includes('/')
    ? moduleId.slice(moduleId.lastIndexOf('/') + 1)
    : moduleId

  const separator = scopedName.indexOf('--')

  const author = separator === -1 ? '' : scopedName.slice(0, separator)

  const moduleName = _.snakeCase(
    separator === -1 ? scopedName : scopedName.slice(separator + 2)
  )

  if (!author || author === 'lifeforge') {
    return moduleName
  }

  return `${author}___${moduleName}`
}
