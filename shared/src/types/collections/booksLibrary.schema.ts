/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: booksLibrary
 * Generated at: 2025-07-19T14:07:18.233Z
 * Contains: books_library__collections, books_library__languages, books_library__entries, books_library__file_types, books_library__file_types_aggregated, books_library__languages_aggregated, books_library__collections_aggregated
 */

import { z } from "zod/v4";

const Collection = z.object({
  name: z.string(),
  icon: z.string(),
});

const Language = z.object({
  name: z.string(),
  icon: z.string(),
});

const Entry = z.object({
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

const FileType = z.object({
  name: z.string(),
});

const FileTypeAggregated = z.object({
  name: z.string(),
  amount: z.number(),
});

const LanguageAggregated = z.object({
  name: z.string(),
  icon: z.string(),
  amount: z.number(),
});

const CollectionAggregated = z.object({
  name: z.string(),
  icon: z.string(),
  amount: z.number(),
});

type ICollection = z.infer<typeof Collection>;
type ILanguage = z.infer<typeof Language>;
type IEntry = z.infer<typeof Entry>;
type IFileType = z.infer<typeof FileType>;
type IFileTypeAggregated = z.infer<typeof FileTypeAggregated>;
type ILanguageAggregated = z.infer<typeof LanguageAggregated>;
type ICollectionAggregated = z.infer<typeof CollectionAggregated>;

export {
  Collection,
  Language,
  Entry,
  FileType,
  FileTypeAggregated,
  LanguageAggregated,
  CollectionAggregated,
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

const BooksLibraryLibgenSearchResultSchema = z.object({
  provider: z.string(),
  query: z.string(),
  resultsCount: z.string(),
  data: z.record(z.string(), z.any()),
  page: z.number()
})

type IBooksLibraryLibgenSearchResult = z.infer<
  typeof BooksLibraryLibgenSearchResultSchema
>

export { BooksLibraryLibgenSearchResultSchema }

export type { IBooksLibraryLibgenSearchResult }
