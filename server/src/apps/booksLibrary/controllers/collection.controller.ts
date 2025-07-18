import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { BooksLibrarySchemas } from "shared/types";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import * as CollectionsService from "../services/collections.service";

const booksLibraryCollectionsRouter = express.Router();

const getAllCollections = forgeController
  .route("GET /")
  .description("Get all collections for the books library")
  .schema({
    response: z.array(
      WithPBSchema(BooksLibrarySchemas.CollectionAggregatedSchema),
    ),
  })
  .callback(({ pb }) => CollectionsService.getAllCollections(pb));

const createCollection = forgeController
  .route("POST /")
  .description("Create a new collection for the books library")
  .schema({
    body: BooksLibrarySchemas.CollectionSchema,
    response: WithPBSchema(BooksLibrarySchemas.CollectionSchema),
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
    body: BooksLibrarySchemas.CollectionSchema,
    response: WithPBSchema(BooksLibrarySchemas.CollectionAggregatedSchema),
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
