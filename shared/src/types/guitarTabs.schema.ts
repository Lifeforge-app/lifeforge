/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: guitarTabs
 * Generated at: 2025-07-17T08:55:29.693Z
 * Contains: guitar_tabs__entries, guitar_tabs__authors_aggregated
 */

import { z } from "zod/v4";
const EntrySchema = z.object({
  name: z.string(),
  type: z.enum(["fingerstyle","singalong",""]),
  pageCount: z.string(),
  thumbnail: z.string(),
  author: z.string(),
  pdf: z.string(),
  audio: z.string(),
  musescore: z.string(),
  isFavourite: z.boolean(),
});

const AuthorAggregatedSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

type IEntry = z.infer<typeof EntrySchema>;
type IAuthorAggregated = z.infer<typeof AuthorAggregatedSchema>;

export {
  EntrySchema,
  AuthorAggregatedSchema,
};

export type {
  IEntry,
  IAuthorAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
