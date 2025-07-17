import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { BooksLibraryLanguageSchema } from "../schema";
import * as LanguagesService from "../services/languages.service";

const booksLibraryLanguagesRouter = express.Router();

const getAllLanguages = forgeController
  .route("GET /")
  .description("Get all languages for the books library")
  .schema({
    response: z.array(BooksLibraryLanguageSchema),
  })
  .callback(({ pb }) => LanguagesService.getAllLanguages(pb));

const createLanguage = forgeController
  .route("POST /")
  .description("Create a new language for the books library")
  .schema({
    body: BooksLibraryLanguageSchema,
    response: WithPBSchema(BooksLibraryLanguageSchema),
  })
  .statusCode(201)
  .callback(
    async ({ pb, body }) => await LanguagesService.createLanguage(pb, body),
  );

const updateLanguage = forgeController
  .route("PATCH /:id")
  .description("Update an existing language for the books library")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: BooksLibraryLanguageSchema,
    response: WithPBSchema(BooksLibraryLanguageSchema),
  })
  .existenceCheck("params", {
    id: "books_library__languages",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await LanguagesService.updateLanguage(pb, id, body),
  );

const deleteLanguage = forgeController
  .route("DELETE /:id")
  .description("Delete an existing language for the books library")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "books_library__languages",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) =>
      await LanguagesService.deleteLanguage(pb, id),
  );

bulkRegisterControllers(booksLibraryLanguagesRouter, [
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
]);

export default booksLibraryLanguagesRouter;
