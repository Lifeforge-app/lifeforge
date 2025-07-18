/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: apiKeys
 * Generated at: 2025-07-19T14:24:04.971Z
 * Contains: api_keys__entries
 */

import { z } from "zod/v4";

const Entry = z.object({
  keyId: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  key: z.string(),
});

type IEntry = z.infer<typeof Entry>;

export {
  Entry,
};

export type {
  IEntry,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
