/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: passwords
 * Generated at: 2025-07-18T00:32:55.271Z
 * Contains: passwords__entries
 */

import { z } from "zod/v4";
const EntrySchema = z.object({
  name: z.string(),
  website: z.string(),
  username: z.string(),
  password: z.string(),
  icon: z.string(),
  color: z.string(),
  pinned: z.boolean(),
});

type IEntry = z.infer<typeof EntrySchema>;

export {
  EntrySchema,
};

export type {
  IEntry,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
