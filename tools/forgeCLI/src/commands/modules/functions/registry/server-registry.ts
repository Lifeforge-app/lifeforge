import { extractModuleName } from './module-utils'

export function generateServerRegistry(modules: string[]): string {
  if (modules.length === 0) {
    return `// AUTO-GENERATED - DO NOT EDIT
import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({})

export default appRoutes
`
  }

  const imports = modules
    .map(mod => {
      const name = extractModuleName(mod)

      return `  ${name}: (await import('${mod}/server')).default,`
    })
    .join('\n')

  return `// AUTO-GENERATED - DO NOT EDIT
import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({
${imports}
})

export default appRoutes
`
}
