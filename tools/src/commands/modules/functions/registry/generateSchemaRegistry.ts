import fs from 'fs'
import path from 'path'

import getFsMetadata from '../getFsMetadata'
import listModules from '../listModules'
import { parsePackageName } from './namespaceUtils'

export default function generateSchemaRegistry(): string {
  const modules = Object.keys(listModules())

  const modulesWithSchema = modules.filter(mod =>
    fs.existsSync(path.join(getFsMetadata(mod).targetDir, 'server/schema.ts'))
  )

  const moduleSchemas = modulesWithSchema
    .map(mod => {
      const { username, moduleName } = parsePackageName(mod)

      const key = username ? `${username}$${moduleName}` : moduleName

      return `  ${key}: (await import('${mod}/server/schema')).default,`
    })
    .join('\n')

  return `// AUTO-GENERATED - DO NOT EDIT
import flattenSchemas from '@functions/utils/flattenSchema'

export const SCHEMAS = {
  user: (await import('@lib/user/schema')).default,
  api_keys: (await import('@lib/apiKeys/schema')).default,
${moduleSchemas}
}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
`
}
