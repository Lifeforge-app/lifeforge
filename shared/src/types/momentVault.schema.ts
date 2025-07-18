/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: momentVault
 * Generated at: 2025-07-18T00:32:55.271Z
 * Contains: moment_vault__entries
 */

import { z } from "zod/v4";
const EntrySchema = z.object({
  type: z.enum(["text","audio","video","photos",""]),
  file: z.array(z.string()),
  content: z.string(),
  transcription: z.string(),
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
