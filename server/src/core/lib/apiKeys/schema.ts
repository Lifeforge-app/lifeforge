/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: apiKeys
 * Generated at: 2025-07-09T12:50:41.286Z
 * Contains: api_keys__entries
 */
import { z } from "zod/v4";

const ApiKeysEntrySchema = z.object({
  keyId: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  key: z.string(),
});

type IApiKeysEntry = z.infer<typeof ApiKeysEntrySchema>;

export { ApiKeysEntrySchema };

export type { IApiKeysEntry };

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
