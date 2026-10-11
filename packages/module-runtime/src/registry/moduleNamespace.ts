import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { getLoadingModuleId } from './loadingModule'

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

/** Reads a module's id (scope-stripped name) from its package.json. */
function readModuleIdFromPackageJson(moduleDir: string): string | undefined {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(moduleDir, 'package.json'), 'utf-8')
    ) as { name?: string }

    return pkg.name?.replace(/^@lifeforge\//, '')
  } catch {
    return undefined
  }
}

/**
 * Resolves the official module id of the module that is currently being loaded.
 *
 * Prefers the id the loader sets around its dynamic `import()`. When a schema is
 * loaded outside the loader — e.g. drizzle-kit reading `server/dist/schema.js`
 * for `db:push` — it falls back to detecting the module directory from the
 * stack and reading the id from that module's package.json.
 */
export function resolveCallerModuleId(stack?: string): string | undefined {
  const loading = getLoadingModuleId()

  if (loading) {
    return loading
  }

  const moduleDir = detectCallerModuleDir(stack ?? new Error().stack)

  return moduleDir ? readModuleIdFromPackageJson(moduleDir) : undefined
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
