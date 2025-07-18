import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { BooksLibraryControllersSchemas } from "shared/types/controllers";

import * as libgenService from "../services/libgen.service";

const booksLibraryLibgenRouter = express.Router();

const getStatus = forgeController
  .route("GET /status")
  .description("Get libgen service status")
  .schema(BooksLibraryControllersSchemas.Libgen.getStatus)
  .callback(libgenService.getStatus);

const searchBooks = forgeController
  .route("GET /search")
  .description("Search books in libgen")
  .schema(BooksLibraryControllersSchemas.Libgen.searchBooks)
  .callback(async ({ query }) => await libgenService.searchBooks(query));

const getBookDetails = forgeController
  .route("GET /details/:md5")
  .description("Get book details from libgen")
  .schema(BooksLibraryControllersSchemas.Libgen.getBookDetails)
  .callback(
    async ({ params: { md5 } }) => await libgenService.getBookDetails(md5),
  );

const getLocalLibraryData = forgeController
  .route("GET /local-library-data/:md5")
  .description("Get local library data for a book")
  .schema(BooksLibraryControllersSchemas.Libgen.getLocalLibraryData)
  .callback(
    async ({ params: { md5, provider } }) =>
      await libgenService.getLocalLibraryData(provider, md5),
  );

const addToLibrary = forgeController
  .route("POST /add-to-library/:md5")
  .description("Add a book to the library from libgen")
  .schema(BooksLibraryControllersSchemas.Libgen.addToLibrary)
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
