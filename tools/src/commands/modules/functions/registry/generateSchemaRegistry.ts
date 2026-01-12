import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { SERVER_SCHEMA_DIR } from '@/constants/constants'
import logger from '@/utils/logger'

import normalizePackage from '../../../../utils/normalizePackage'
import listModules from '../listModules'
import { parsePackageName } from '../parsePackageName'

export default function generateSchemaRegistry() {
  const modules = Object.keys(listModules())

  const modulesWithSchema = modules.filter(mod =>
    fs.existsSync(
      path.join(normalizePackage(mod).targetDir, 'server/schema.ts')
    )
  )

  const moduleSchemas = modulesWithSchema
    .map(mod => {
      const { username, moduleName } = parsePackageName(mod)

      const key = username
        ? `${username}$${_.camelCase(moduleName)}`
        : _.camelCase(moduleName)

      return `  ${key}: (await import('${mod}/server/schema')).default,`
    })
    .join('\n')

  const registry = `// AUTO-GENERATED - DO NOT EDIT

const SCHEMAS = {
${moduleSchemas}
}

export default SCHEMAS
`

  fs.writeFileSync(SERVER_SCHEMA_DIR, registry)

  logger.success('Generated schema registry')
}
