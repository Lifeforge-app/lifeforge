import flattenSchemas from '@functions/utils/flattenSchema'

export const SCHEMAS = {}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
