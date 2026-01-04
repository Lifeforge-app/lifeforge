import fs from 'fs'
import path from 'path'

import getFsMetadata from '../getFsMetadata'
import listModules from '../listModules'
import { parsePackageName } from './namespaceUtils'

export default function generateServerRegistry(): string {
  const modules = Object.keys(listModules(true))

  const modulesWithServer = modules.filter(mod =>
    fs.existsSync(path.join(getFsMetadata(mod).targetDir, 'server/index.ts'))
  )

  if (modulesWithServer.length === 0) {
    return `// AUTO-GENERATED - DO NOT EDIT
import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({})

export default appRoutes
`
  }

  const imports = modulesWithServer
    .map(mod => {
      const { username, moduleName } = parsePackageName(mod)

      const key = username ? `${username}$${moduleName}` : moduleName

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
