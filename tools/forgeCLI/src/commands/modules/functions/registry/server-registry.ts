import { extractModuleName, moduleHasServer } from './module-utils'

export function generateServerRegistry(modules: string[]): string {
  const modulesWithServer = modules.filter(mod => moduleHasServer(mod))

  if (modulesWithServer.length === 0) {
    return `// AUTO-GENERATED - DO NOT EDIT
import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({})

export default appRoutes
`
  }

  const imports = modulesWithServer
    .map(mod => {
      const name = extractModuleName(mod)

      let key: string

      if (name.includes('--')) {
        // Third-party module: username--module-name → username$module_name
        const [username, ...rest] = name.split('--')

        const moduleName = rest.join('--').replace(/-/g, '_')

        key = `${username}$${moduleName}`
      } else {
        // Official module: just convert dashes to underscores
        key = name.replace(/-/g, '_')
      }

      return `  ${key}: (await import('${mod}/server')).default,`
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
