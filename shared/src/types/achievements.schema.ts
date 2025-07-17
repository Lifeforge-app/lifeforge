/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: achievements
 * Generated at: 2025-07-17T08:55:29.693Z
 * Contains: achievements__entries
 */

import { z } from "zod/v4";
const EntrySchema = z.object({
  title: z.string(),
  thoughts: z.string(),
  difficulty: z.enum(["easy","medium","hard","impossible"]),
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
