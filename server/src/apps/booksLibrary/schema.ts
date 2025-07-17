/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: booksLibrary
 * Generated at: 2025-07-09T12:50:41.285Z
 * Contains: books_library__collections, books_library__languages, books_library__entries, books_library__file_types, books_library__file_types_aggregated, books_library__languages_aggregated, books_library__collections_aggregated
 */
import { z } from "zod/v4";

const BooksLibraryCollectionSchema = z.object({
  name: z.string(),
  icon: z.string(),
});

const BooksLibraryLanguageSchema = z.object({
  name: z.string(),
  icon: z.string(),
});

const BooksLibraryEntrySchema = z.object({
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

const BooksLibraryFileTypeSchema = z.object({
  name: z.string(),
});

const BooksLibraryFileTypeAggregatedSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

const BooksLibraryLanguageAggregatedSchema = z.object({
  name: z.string(),
  icon: z.string(),
  amount: z.number(),
});

const BooksLibraryCollectionAggregatedSchema = z.object({
  name: z.string(),
  icon: z.string(),
  amount: z.number(),
});

type IBooksLibraryCollection = z.infer<typeof BooksLibraryCollectionSchema>;
type IBooksLibraryLanguage = z.infer<typeof BooksLibraryLanguageSchema>;
type IBooksLibraryEntry = z.infer<typeof BooksLibraryEntrySchema>;
type IBooksLibraryFileType = z.infer<typeof BooksLibraryFileTypeSchema>;
type IBooksLibraryFileTypeAggregated = z.infer<
  typeof BooksLibraryFileTypeAggregatedSchema
>;
type IBooksLibraryLanguageAggregated = z.infer<
  typeof BooksLibraryLanguageAggregatedSchema
>;
type IBooksLibraryCollectionAggregated = z.infer<
  typeof BooksLibraryCollectionAggregatedSchema
>;

export {
  BooksLibraryCollectionSchema,
  BooksLibraryLanguageSchema,
  BooksLibraryEntrySchema,
  BooksLibraryFileTypeSchema,
  BooksLibraryFileTypeAggregatedSchema,
  BooksLibraryLanguageAggregatedSchema,
  BooksLibraryCollectionAggregatedSchema,
};

export type {
  IBooksLibraryCollection,
  IBooksLibraryLanguage,
  IBooksLibraryEntry,
  IBooksLibraryFileType,
  IBooksLibraryFileTypeAggregated,
  IBooksLibraryLanguageAggregated,
  IBooksLibraryCollectionAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

const BooksLibraryLibgenSearchResultSchema = z.object({
  provider: z.string(),
  query: z.string(),
  resultsCount: z.string(),
  data: z.record(z.string(), z.any()),
  page: z.number(),
});

type IBooksLibraryLibgenSearchResult = z.infer<
  typeof BooksLibraryLibgenSearchResultSchema
>;

export { BooksLibraryLibgenSearchResultSchema };

export type { IBooksLibraryLibgenSearchResult };
