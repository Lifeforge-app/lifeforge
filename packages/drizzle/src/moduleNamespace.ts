const MODULE_PATH = /\/modules\/([^/]+)\//

/** Detects the calling module id (folder name) from the stack. */
export function detectCallerModuleId(): string | undefined {
  const stack = new Error().stack

  for (const line of stack?.split('\n') ?? []) {
    const match = line.replace(/\\/g, '/').match(MODULE_PATH)

    if (match) {
      return match[1]
    }
  }

  return undefined
}

/**
 * Derives a module's namespace from its id:
 * - `lifeforge--calendar` → `calendar`
 * - `melvinchia3636--invoice-maker` → `melvinchia3636___invoice_maker`
 */
export function deriveModuleNamespace(moduleId: string): string {
  const separator = moduleId.indexOf('--')

  const author = separator === -1 ? '' : moduleId.slice(0, separator)

  const moduleName = (
    separator === -1 ? moduleId : moduleId.slice(separator + 2)
  ).replace(/-/g, '_')

  if (!author || author === 'lifeforge') {
    return moduleName
  }

  return `${author}___${moduleName}`
}
