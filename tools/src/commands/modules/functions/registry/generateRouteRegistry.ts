import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { SERVER_ROUTES_DIR } from '@/constants/constants'
import Logging from '@/utils/logging'

import normalizePackage from '../../../../utils/normalizePackage'
import listModules from '../listModules'
import { parsePackageName } from '../parsePackageName'

export default function generateRouteRegistry() {
  const modules = Object.keys(listModules())

  const modulesWithServer = modules.filter(mod =>
    fs.existsSync(path.join(normalizePackage(mod).targetDir, 'server/index.ts'))
  )

  const imports = modulesWithServer
    .map(mod => {
      const { username, moduleName } = parsePackageName(mod)

      const key = username
        ? `${username}$${_.camelCase(moduleName)}`
        : _.camelCase(moduleName)

      return `  ${key}: (await import('${mod}/server')).default,`
    })
    .join('\n')

  let registry = `// AUTO-GENERATED - DO NOT EDIT
import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({
${imports}
})

export default appRoutes
`

  fs.writeFileSync(SERVER_ROUTES_DIR, registry)

  Logging.success('Generated route registry')
}
