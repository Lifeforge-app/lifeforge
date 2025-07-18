/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: booksLibrary
 * Generated at: 2025-07-18T00:32:55.275Z
 * Contains: books_library__collections, books_library__languages, books_library__entries, books_library__file_types, books_library__file_types_aggregated, books_library__languages_aggregated, books_library__collections_aggregated
 */

import { z } from "zod/v4";
const CollectionSchema = z.object({
  name: z.string(),
  icon: z.string(),
});

const LanguageSchema = z.object({
  name: z.string(),
  icon: z.string(),
});

const EntrySchema = z.object({
  title: z.string(),
  authors: z.string(),
  md5: z.string(),
  year_published: z.number(),
  publisher: z.string(),
  languages: z.array(z.string()),
  collection: z.string(),
  extension: z.string(),
  edition: z.string(),
  size: z.number(),
  isbn: z.string(),
  file: z.string(),
  thumbnail: z.string(),
  is_favourite: z.boolean(),
  is_read: z.boolean(),
  time_finished: z.string(),
});

const FileTypeSchema = z.object({
  name: z.string(),
});

const FileTypeAggregatedSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

const LanguageAggregatedSchema = z.object({
  name: z.string(),
  icon: z.string(),
  amount: z.number(),
});

const CollectionAggregatedSchema = z.object({
  name: z.string(),
  icon: z.string(),
  amount: z.number(),
});

type ICollection = z.infer<typeof CollectionSchema>;
type ILanguage = z.infer<typeof LanguageSchema>;
type IEntry = z.infer<typeof EntrySchema>;
type IFileType = z.infer<typeof FileTypeSchema>;
type IFileTypeAggregated = z.infer<typeof FileTypeAggregatedSchema>;
type ILanguageAggregated = z.infer<typeof LanguageAggregatedSchema>;
type ICollectionAggregated = z.infer<typeof CollectionAggregatedSchema>;

export {
  CollectionSchema,
  LanguageSchema,
  EntrySchema,
  FileTypeSchema,
  FileTypeAggregatedSchema,
  LanguageAggregatedSchema,
  CollectionAggregatedSchema,
};

export type {
  ICollection,
  ILanguage,
  IEntry,
  IFileType,
  IFileTypeAggregated,
  ILanguageAggregated,
  ICollectionAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
