import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import fs from "fs";
import { WishlistSchemas } from "shared/types";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import * as entriesService from "../services/entries.service";

const wishlistEntriesRouter = express.Router();

const getCollectionId = forgeController
  .route("GET /collection-id")
  .description("Get wishlist entries collection ID")
  .schema({
    response: z.string(),
  })
  .callback(async ({ pb }) => await entriesService.getCollectionId(pb));

const getEntriesByListId = forgeController
  .route("GET /:id")
  .description("Get wishlist entries by list ID")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    query: z.object({
      bought: z
        .string()
        .optional()
        .transform((val) => val === "true"),
    }),
    response: z.array(WithPBSchema(WishlistSchemas.EntrySchema)),
  })
  .existenceCheck("params", {
    id: "wishlist__lists",
  })
  .callback(
    async ({ pb, params: { id }, query: { bought } }) =>
      await entriesService.getEntriesByListId(pb, id, bought),
  );

const scrapeExternal = forgeController
  .route("POST /external")
  .description("Scrape external website for wishlist entry data")
  .schema({
    body: z.object({
      url: z.string(),
      provider: z.string(),
    }),
    response: z.any(),
  })
  .callback(
    async ({ pb, body: { url, provider } }) =>
      await entriesService.scrapeExternal(pb, provider, url),
  );

const createEntry = forgeController
  .route("POST /")
  .description("Create a new wishlist entry")
  .schema({
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().transform((val) => parseFloat(val) || 0 || 0),
      list: z.string(),
      image: z.any().optional(),
    }),
    response: WithPBSchema(WishlistSchemas.EntrySchema),
  })
  .middlewares(singleUploadMiddleware)
  .existenceCheck("body", {
    list: "wishlist__lists",
  })
  .statusCode(201)
  .callback(async ({ pb, body, req }) => {
    const { file } = req;

    let imageFile: File | undefined;

    if (file) {
      const fileBuffer = fs.readFileSync(file.path);
      imageFile = new File([fileBuffer], file.originalname);
      fs.unlinkSync(file.path);
    } else if (typeof body.image === "string") {
      const response = await fetch(body.image);
      const buffer = await response.arrayBuffer();
      imageFile = new File([buffer], "image.jpg");
    }

    const data = {
      ...body,
      bought: false,
      image: imageFile,
    };

    return await entriesService.createEntry(pb, data);
  });

const updateEntry = forgeController
  .route("PATCH /:id")
  .description("Update an existing wishlist entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().transform((val) => parseFloat(val) || 0 || 0),
      list: z.string(),
      imageRemoved: z.string().optional(),
    }),
    response: z.union([
      WithPBSchema(WishlistSchemas.EntrySchema),
      z.literal("removed"),
    ]),
  })
  .middlewares(singleUploadMiddleware)
  .existenceCheck("params", {
    id: "wishlist__entries",
  })
  .existenceCheck("body", {
    list: "wishlist__lists",
  })
  .callback(
    async ({
      pb,
      params: { id },
      body: { list, name, url, price, imageRemoved },
      req,
    }) => {
      const { file } = req;
      let finalFile: null | File = null;

      if (imageRemoved === "true") {
        finalFile = null;
      }

      if (file) {
        const fileBuffer = fs.readFileSync(file.path);
        finalFile = new File([fileBuffer], file.originalname);
        fs.unlinkSync(file.path);
      }

      const oldEntry = await entriesService.getEntry(pb, id);

      const entry = await entriesService.updateEntry(pb, id, {
        list,
        name,
        url,
        price,
        ...(imageRemoved === "true" || finalFile ? { image: finalFile } : {}),
      });

      return oldEntry.list === list ? entry : "removed";
    },
  );

const updateEntryBoughtStatus = forgeController
  .route("PATCH /bought/:id")
  .description("Update wishlist entry bought status")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(WishlistSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "wishlist__entries",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await entriesService.updateEntryBoughtStatus(pb, id),
  );

const deleteEntry = forgeController
  .route("DELETE /:id")
  .description("Delete a wishlist entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "wishlist__entries",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id),
  );

bulkRegisterControllers(wishlistEntriesRouter, [
  getCollectionId,
  getEntriesByListId,
  scrapeExternal,
  createEntry,
  updateEntry,
  updateEntryBoughtStatus,
  deleteEntry,
]);

export default wishlistEntriesRouter;
