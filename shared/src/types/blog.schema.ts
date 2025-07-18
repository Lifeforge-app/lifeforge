/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: blog
 * Generated at: 2025-07-18T00:32:55.272Z
 * Contains: blog__entries, blog__categories
 */

import { z } from "zod/v4";
const EntrySchema = z.object({
  content: z.string(),
  title: z.string(),
  media: z.array(z.string()),
  excerpt: z.string(),
  visibility: z.enum(["private","public","unlisted",""]),
  featured_image: z.string(),
  labels: z.any(),
  category: z.string(),
});

const CategorySchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
});

type IEntry = z.infer<typeof EntrySchema>;
type ICategory = z.infer<typeof CategorySchema>;

export {
  EntrySchema,
  CategorySchema,
};

export type {
  IEntry,
  ICategory,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
