// AUTO-GENERATED - DO NOT EDIT
import { loadModuleSchemas } from '@functions/modules/loadModuleSchemas'
import flattenSchemas from '@functions/utils/flattenSchema'

import type generatedSchemas from '../generated/schemas'

const appSchemas = (
  process.env.NODE_ENV === 'production'
    ? await loadModuleSchemas()
    : (await import('../generated/schemas')).default
) as typeof generatedSchemas

export const SCHEMAS = {
  user: (await import('@lib/user/schema')).default,
  api_keys: (await import('@lib/apiKeys/schema')).default,
  ...appSchemas
}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
