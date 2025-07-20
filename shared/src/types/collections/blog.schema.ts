/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: blog
 * Generated at: 2025-07-20T12:17:56.585Z
 * Contains: entry, category
 */

import { z } from "zod/v4";

const Entry = z.object({
  content: z.string(),
  title: z.string(),
  media: z.array(z.string()),
  excerpt: z.string(),
  visibility: z.enum(["private","public","unlisted",""]),
  featured_image: z.string(),
  labels: z.any(),
  category: z.string(),
});

const Category = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
});

type IEntry = z.infer<typeof Entry>;
type ICategory = z.infer<typeof Category>;

export {
  Entry,
  Category,
};

export type {
  IEntry,
  ICategory,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
