/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: blog
 * Generated at: 2025-07-09T12:50:41.283Z
 * Contains: blog__entries, blog__categories
 */
import { z } from "zod/v4";

const BlogEntrySchema = z.object({
  content: z.string(),
  title: z.string(),
  media: z.array(z.string()),
  excerpt: z.string(),
  visibility: z.enum(["private", "public", "unlisted", ""]),
  featured_image: z.string(),
  labels: z.any(),
  category: z.string(),
});

const BlogCategorySchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
});

type IBlogEntry = z.infer<typeof BlogEntrySchema>;
type IBlogCategory = z.infer<typeof BlogCategorySchema>;

export { BlogEntrySchema, BlogCategorySchema };

export type { IBlogEntry, IBlogCategory };

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
