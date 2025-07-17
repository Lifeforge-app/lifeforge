import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { BooksLibrarySchemas } from "shared";
import { z } from "zod/v4";

import * as libgenService from "../services/libgen.service";

const booksLibraryLibgenRouter = express.Router();

const getStatus = forgeController
  .route("GET /status")
  .description("Get libgen service status")
  .schema({
    response: z.boolean(),
  })
  .callback(libgenService.getStatus);

const searchBooks = forgeController
  .route("GET /search")
  .description("Search books in libgen")
  .schema({
    query: z.object({
      provider: z.string(),
      req: z.string(),
      page: z.string(),
    }),
    response: BooksLibrarySchemas.BooksLibraryLibgenSearchResultSchema,
  })
  .callback(async ({ query }) => await libgenService.searchBooks(query));

const getBookDetails = forgeController
  .route("GET /details/:md5")
  .description("Get book details from libgen")
  .schema({
    params: z.object({
      md5: z.string(),
    }),
    response: z.record(z.string(), z.any()),
  })
  .callback(
    async ({ params: { md5 } }) => await libgenService.getBookDetails(md5),
  );

const getLocalLibraryData = forgeController
  .route("GET /local-library-data/:md5")
  .description("Get local library data for a book")
  .schema({
    params: z.object({
      provider: z.string(),
      md5: z.string(),
    }),
    response: BooksLibrarySchemas.EntrySchema.omit({
      collection: true,
      file: true,
      is_favourite: true,
      is_read: true,
      time_finished: true,
    }),
  })
  .callback(
    async ({ params: { md5, provider } }) =>
      await libgenService.getLocalLibraryData(provider, md5),
  );

const addToLibrary = forgeController
  .route("POST /add-to-library/:md5")
  .description("Add a book to the library from libgen")
  .schema({
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
  })
  .statusCode(202)
  .callback(
    async ({ io, pb, params: { md5 }, body: { metadata } }) =>
      await libgenService.addToLibrary(io, pb, md5, metadata),
  );

bulkRegisterControllers(booksLibraryLibgenRouter, [
  getStatus,
  searchBooks,
  getBookDetails,
  getLocalLibraryData,
  addToLibrary,
]);

export default booksLibraryLibgenRouter;
