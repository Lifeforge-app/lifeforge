import { extractModuleName } from './module-utils'

export function generateClientRegistry(modules: string[]): string {
  if (modules.length === 0) {
    return `// AUTO-GENERATED - DO NOT EDIT
import type { ModuleConfig } from 'shared'

export const modules: ModuleConfig[] = []
`
  }

  const imports = modules
    .map(mod => {
      const name = extractModuleName(mod)

      const varName = name.replace(/-/g, '_')

      return `import ${varName}Manifest from '${mod}/manifest'`
    })
    .join('\n')

  const exports = modules
    .map(mod => {
      const name = extractModuleName(mod)

      const varName = name.replace(/-/g, '_')

      return `  ${varName}Manifest,`
    })
    .join('\n')

  return `// AUTO-GENERATED - DO NOT EDIT
import type { ModuleConfig } from 'shared'

${imports}

export const modules: ModuleConfig[] = [
${exports}
]
`
}
