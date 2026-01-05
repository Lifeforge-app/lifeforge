// AUTO-GENERATED - DO NOT EDIT
import flattenSchemas from '@functions/utils/flattenSchema'

import appSchemas from '../generated/schemas'

export const SCHEMAS = {
  user: (await import('@lib/user/schema')).default,
  api_keys: (await import('@lib/apiKeys/schema')).default,
  ...appSchemas
}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
