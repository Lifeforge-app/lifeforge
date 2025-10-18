import flattenSchemas from '@functions/utils/flattenSchema';
export const SCHEMAS = {
  user: (await import('@lib/user/schema')).default,
  api_keys: (await import('@lib/apiKeys/schema')).default,
  achievements: (await import('@lib/achievements/server/schema')).default
};
const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS);
export default COLLECTION_SCHEMAS;