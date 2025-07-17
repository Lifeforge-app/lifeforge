import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { WishlistListSchema } from "../schema";
import * as listsService from "../services/lists.service";

const wishlistListsRouter = express.Router();

const getList = forgeController
  .route("GET /:id")
  .description("Get wishlist by ID")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(WishlistListSchema),
  })
  .existenceCheck("params", {
    id: "wishlist__lists",
  })
  .callback(
    async ({ pb, params: { id } }) => await listsService.getList(pb, id),
  );

const checkListExists = forgeController
  .route("GET /valid/:id")
  .description("Check if wishlist exists")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await listsService.checkListExists(pb, id),
  );

const getAllLists = forgeController
  .route("GET /")
  .description("Get all wishlists with statistics")
  .schema({
    response: z.array(
      WithPBSchema(
        WishlistListSchema.extend({
          total_count: z.number(),
          bought_count: z.number(),
          total_amount: z.number(),
          bought_amount: z.number(),
        }),
      ),
    ),
  })
  .callback(async ({ pb }) => await listsService.getAllLists(pb));

const createList = forgeController
  .route("POST /")
  .description("Create a new wishlist")
  .schema({
    body: WishlistListSchema,
    response: WithPBSchema(WishlistListSchema),
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => await listsService.createList(pb, body));

const updateList = forgeController
  .route("PATCH /:id")
  .description("Update an existing wishlist")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: WishlistListSchema,
    response: WithPBSchema(WishlistListSchema),
  })
  .existenceCheck("params", {
    id: "wishlist__lists",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await listsService.updateList(pb, id, body),
  );

const deleteList = forgeController
  .route("DELETE /:id")
  .description("Delete a wishlist")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "wishlist__lists",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await listsService.deleteList(pb, id),
  );

bulkRegisterControllers(wishlistListsRouter, [
  getList,
  checkListExists,
  getAllLists,
  createList,
  updateList,
  deleteList,
]);

export default wishlistListsRouter;
