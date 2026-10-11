import _ from 'lodash'

import { getLoadingModuleId } from './loadingModule'

/**
 * Resolves the official module id of the module that is currently being loaded.
 * The loader sets this around its dynamic `import()`, so schema files can
 * resolve their namespace without parsing a stack trace.
 */
export function resolveCallerModuleId(): string | undefined {
  return getLoadingModuleId()
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
