import fs from 'fs'
import path from 'path'

import { SERVER_SCHEMA_PATH } from '@/constants/constants'

import normalizePackage from '../../../../utils/normalizePackage'
import listModules from '../listModules'
import { parsePackageName } from '../parsePackageName'

export default function generateSchemaRegistry(): string {
  const modules = Object.keys(listModules())

  const modulesWithSchema = modules.filter(mod =>
    fs.existsSync(
      path.join(normalizePackage(mod).targetDir, 'server/schema.ts')
    )
  )

  const moduleSchemas = modulesWithSchema
    .map(mod => {
      const { username, moduleName } = parsePackageName(mod)

      const key = username ? `${username}$${moduleName}` : moduleName

      return `  ${key}: (await import('${mod}/server/schema')).default,`
    })
    .join('\n')

  const registry = `// AUTO-GENERATED - DO NOT EDIT
import flattenSchemas from '@functions/utils/flattenSchema'

const SCHEMAS = {
${moduleSchemas}
}

export default SCHEMAS
`

  fs.writeFileSync(SERVER_SCHEMA_PATH, registry)
}
