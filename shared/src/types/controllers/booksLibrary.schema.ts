import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { BooksLibraryCollectionsSchemas } from "../collections";
import type { InferApiESchemaDynamic } from "../utils/inferSchema";

const Languages = {
  /**
   * @route       GET /
   * @description Get all languages for the books library
   */
  getAllLanguages: {
    response: z.array(
      SchemaWithPB(BooksLibraryCollectionsSchemas.LanguageAggregated)
    ),
  },

  /**
   * @route       POST /
   * @description Create a new language for the books library
   */
  createLanguage: {
    body: BooksLibraryCollectionsSchemas.Language,
    response: SchemaWithPB(BooksLibraryCollectionsSchemas.Language),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing language for the books library
   */
  updateLanguage: {
    params: z.object({
      id: z.string(),
    }),
    body: BooksLibraryCollectionsSchemas.Language,
    response: SchemaWithPB(BooksLibraryCollectionsSchemas.Language),
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing language for the books library
   */
  deleteLanguage: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const FileTypes = {
  /**
   * @route       GET /
   * @description Get all file types for the books library
   */
  getAllFileTypes: {
    response: z.array(
      SchemaWithPB(BooksLibraryCollectionsSchemas.FileTypeAggregated)
    ),
  },
};

const Collection = {
  /**
   * @route       GET /
   * @description Get all collections for the books library
   */
  getAllCollections: {
    response: z.array(
      SchemaWithPB(BooksLibraryCollectionsSchemas.CollectionAggregated)
    ),
  },

  /**
   * @route       POST /
   * @description Create a new collection for the books library
   */
  createCollection: {
    body: BooksLibraryCollectionsSchemas.Collection,
    response: SchemaWithPB(BooksLibraryCollectionsSchemas.Collection),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing collection for the books library
   */
  updateCollection: {
    params: z.object({
      id: z.string(),
    }),
    body: BooksLibraryCollectionsSchemas.Collection,
    response: SchemaWithPB(BooksLibraryCollectionsSchemas.CollectionAggregated),
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing collection for the books library
   */
  deleteCollection: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Entries = {
  /**
   * @route       GET /
   * @description Get all entries in the books library
   */
  getAllEntries: {
    response: z.array(SchemaWithPB(BooksLibraryCollectionsSchemas.Entry)),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing entry in the books library
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: BooksLibraryCollectionsSchemas.Entry.pick({
      title: true,
      authors: true,
      collection: true,
      edition: true,
      languages: true,
      isbn: true,
      publisher: true,
    }).extend({
      year_published: z.string().transform((val) => {
        const year = parseInt(val, 10);
        return isNaN(year) ? 0 : year;
      }),
    }),
    response: SchemaWithPB(BooksLibraryCollectionsSchemas.Entry),
  },

  /**
   * @route       POST /favourite/:id
   * @description Toggle the favourite status of an entry in the books library
   */
  toggleFavouriteStatus: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(BooksLibraryCollectionsSchemas.Entry),
  },

  /**
   * @route       POST /read/:id
   * @description Toggle the read status of an entry in the books library
   */
  toggleReadStatus: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(BooksLibraryCollectionsSchemas.Entry),
  },

  /**
   * @route       POST /send-to-kindle/:id
   * @description Send an entry to a Kindle email address
   */
  sendToKindle: {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      target: z.string().email().endsWith("@kindle.com"),
    }),
    response: z.void(),
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing entry in the books library
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Libgen = {
  /**
   * @route       GET /status
   * @description Get libgen service status
   */
  getStatus: {
    response: z.boolean(),
  },

  /**
   * @route       GET /search
   * @description Search books in libgen
   */
  searchBooks: {
    query: z.object({
      provider: z.string(),
      req: z.string(),
      page: z.string(),
    }),
    response:
      BooksLibraryCollectionsSchemas.BooksLibraryLibgenSearchResultSchema,
  },

  /**
   * @route       GET /details/:md5
   * @description Get book details from libgen
   */
  getBookDetails: {
    params: z.object({
      md5: z.string(),
    }),
    response: z.record(z.string(), z.any()),
  },

  /**
   * @route       GET /local-library-data/:md5
   * @description Get local library data for a book
   */
  getLocalLibraryData: {
    params: z.object({
      provider: z.string(),
      md5: z.string(),
    }),
    response: BooksLibraryCollectionsSchemas.Entry.omit({
      collection: true,
      file: true,
      is_favourite: true,
      is_read: true,
      time_finished: true,
    }),
  },

  /**
   * @route       POST /add-to-library/:md5
   * @description Add a book to the library from libgen
   */
  addToLibrary: {
    params: z.object({
      md5: z.string(),
    }),
    body: z.object({
      metadata: z.object({
        authors: z.string(),
        collection: z.string(),
        extension: z.string(),
        edition: z.string(),
        isbn: z.string(),
        languages: z.array(z.string()),
        md5: z.string(),
        publisher: z.string(),
        size: z.string().transform((val) => parseInt(val, 10)),
        thumbnail: z.string(),
        title: z.string(),
        year_published: z.string().transform((val) => parseInt(val, 10) || 0),
      }),
    }),
    response: z.string(),
  },
};

type ILanguages = InferApiESchemaDynamic<typeof Languages>;
type IFileTypes = InferApiESchemaDynamic<typeof FileTypes>;
type ICollection = InferApiESchemaDynamic<typeof Collection>;
type IEntries = InferApiESchemaDynamic<typeof Entries>;
type ILibgen = InferApiESchemaDynamic<typeof Libgen>;

export type { ILanguages, IFileTypes, ICollection, IEntries, ILibgen };
export { Languages, FileTypes, Collection, Entries, Libgen };
