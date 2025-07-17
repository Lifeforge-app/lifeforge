import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { GuitarTabsSchemas } from "shared";
import { z } from "zod/v4";

import {
  PBListResultSchema,
  WithPBSchema,
} from "@typescript/pocketbase_interfaces";

import { uploadMiddleware } from "@middlewares/uploadMiddleware";

import * as entriesService from "../services/entries.service";

const guitarTabsEntriesRouter = express.Router();

const getSidebarData = forgeController
  .route("GET /sidebar-data")
  .description("Get sidebar data for guitar tabs")
  .schema({
    response: GuitarTabsSchemas.GuitarTabsSidebarDataSchema,
  })
  .callback(async ({ pb }) => await entriesService.getSidebarData(pb));

const getEntries = forgeController
  .route("GET /")
  .description("Get guitar tabs entries")
  .schema({
    query: z.object({
      page: z
        .string()
        .optional()
        .transform((val) => parseInt(val ?? "1", 10) || 1),
      query: z.string().optional(),
      category: z.string().optional(),
      author: z.string().optional(),
      starred: z
        .string()
        .optional()
        .transform((val) => val === "true"),
      sort: z
        .enum(["name", "author", "newest", "oldest"])
        .optional()
        .default("newest"),
    }),
    response: PBListResultSchema(WithPBSchema(GuitarTabsSchemas.EntrySchema)),
  })
  .callback(
    async ({ pb, query }) => await entriesService.getEntries(pb, query),
  );

const getRandomEntry = forgeController
  .route("GET /random")
  .description("Get a random guitar tab entry")
  .schema({
    response: WithPBSchema(GuitarTabsSchemas.EntrySchema),
  })
  .callback(async ({ pb }) => await entriesService.getRandomEntry(pb));

const uploadFiles = forgeController
  .route("POST /upload")
  .description("Upload guitar tab files")
  .middlewares(uploadMiddleware)
  .schema({
    response: z.string(),
  })
  .statusCode(202)
  .callback(async ({ io, pb, req }) => {
    const files = req.files;

    if (!files) {
      throw new ClientError("No files provided");
    }

    return await entriesService.uploadFiles(
      io,
      pb,
      files as Express.Multer.File[],
    );
  });

const updateEntry = forgeController
  .route("PATCH /:id")
  .description("Update a guitar tab entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: GuitarTabsSchemas.EntrySchema.pick({
      name: true,
      author: true,
      type: true,
    }),
    response: WithPBSchema(GuitarTabsSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "guitar_tabs__entries",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await entriesService.updateEntry(pb, id, body),
  );

const deleteEntry = forgeController
  .route("DELETE /:id")
  .description("Delete a guitar tab entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "guitar_tabs__entries",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id),
  );

const toggleFavorite = forgeController
  .route("POST /favourite/:id")
  .description("Toggle favorite status of a guitar tab entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(GuitarTabsSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "guitar_tabs__entries",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await entriesService.toggleFavorite(pb, id),
  );

bulkRegisterControllers(guitarTabsEntriesRouter, [
  getSidebarData,
  getEntries,
  getRandomEntry,
  uploadFiles,
  updateEntry,
  deleteEntry,
  toggleFavorite,
]);

export default guitarTabsEntriesRouter;
