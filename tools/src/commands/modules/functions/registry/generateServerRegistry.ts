import fs from 'fs'
import path from 'path'

import { SERVER_ROUTES_DIR } from '@/constants/constants'

import normalizePackage from '../../../../utils/normalizePackage'
import listModules from '../listModules'
import { parsePackageName } from '../parsePackageName'

export default function generateServerRegistry() {
  const modules = Object.keys(listModules(true))

  const modulesWithServer = modules.filter(mod =>
    fs.existsSync(path.join(normalizePackage(mod).targetDir, 'server/index.ts'))
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

  const registry = `// AUTO-GENERATED - DO NOT EDIT
import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({
${imports}
})

export default appRoutes
`

  fs.writeFileSync(SERVER_ROUTES_DIR, registry)
}
