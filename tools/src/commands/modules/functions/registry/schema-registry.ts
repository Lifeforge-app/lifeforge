import { extractModuleName } from './module-utils'

export function generateSchemaRegistry(modulesWithSchema: string[]): string {
  const moduleSchemas = modulesWithSchema
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
