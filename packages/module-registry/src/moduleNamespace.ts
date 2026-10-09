import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { ModuleRegistry } from './registry/ModuleRegistry'

/** Extracts a module's absolute directory from a stack trace. */
function detectCallerModuleDir(stack: string | undefined): string | undefined {
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
 * Resolves a module directory to its official module id (its package.json
 * `name`), preferring the module registry and falling back to the on-disk
 * package.json.
 */
export function resolveModuleId(moduleDir: string): string | undefined {
  return (
    ModuleRegistry.getModuleIdByPath(moduleDir) ??
    readModuleIdFromPackageJson(moduleDir)
  )
}

/**
 * Resolves the official module id of the module that is currently being loaded.
 * The module directory is derived from the stack; the id itself comes from the
 * registry or the module's package.json - never from the directory name.
 */
export function resolveCallerModuleId(
  stack: string | undefined = new Error().stack
): string | undefined {
  const moduleDir = detectCallerModuleDir(stack)

  if (!moduleDir) return undefined

  return resolveModuleId(moduleDir)
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
