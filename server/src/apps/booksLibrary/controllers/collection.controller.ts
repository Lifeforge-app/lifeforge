import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { BooksLibraryCollectionSchema } from "../schema";
import * as CollectionsService from "../services/collections.service";

const booksLibraryCollectionsRouter = express.Router();

const getAllCollections = forgeController
  .route("GET /")
  .description("Get all collections for the books library")
  .schema({
    response: z.array(WithPBSchema(BooksLibraryCollectionSchema)),
  })
  .callback(({ pb }) => CollectionsService.getAllCollections(pb));

const createCollection = forgeController
  .route("POST /")
  .description("Create a new collection for the books library")
  .schema({
    body: BooksLibraryCollectionSchema,
    response: WithPBSchema(BooksLibraryCollectionSchema),
  })
  .statusCode(201)
  .callback(({ pb, body }) => CollectionsService.createCollection(pb, body));

const updateCollection = forgeController
  .route("PATCH /:id")
  .description("Update an existing collection for the books library")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: BooksLibraryCollectionSchema,
    response: WithPBSchema(BooksLibraryCollectionSchema),
  })
  .existenceCheck("params", {
    id: "books_library__collections",
  })
  .callback(({ pb, params: { id }, body }) =>
    CollectionsService.updateCollection(pb, id, body),
  );

const deleteCollection = forgeController
  .route("DELETE /:id")
  .description("Delete an existing collection for the books library")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "books_library__collections",
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    CollectionsService.deleteCollection(pb, id),
  );

bulkRegisterControllers(booksLibraryCollectionsRouter, [
  getAllCollections,
  createCollection,
  updateCollection,
  deleteCollection,
]);

export default booksLibraryCollectionsRouter;
