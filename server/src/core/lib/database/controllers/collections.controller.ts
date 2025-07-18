import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import getPBWithSuperuser from "@functions/getPBWithSuperuser";
import express from "express";
import { z } from "zod/v4";

const databaseCollectionsRouter = express.Router();

const listCollections = forgeController
  .route("GET /")
  .description("List all collections")
  .schema({
    response: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["base", "view"]),
        fields: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
          }),
        ),
      }),
    ),
  })
  .callback(async () => {
    const pb = await getPBWithSuperuser();

    const collections = await pb.collections.getFullList();

    return collections
      .filter((e) => ["base", "view"].includes(e.type) && !e.system)
      .map((collection) => ({
        name: collection.name,
        type: collection.type as "base" | "view",
        fields: collection.fields
          .filter((e) => !e.system && !e.hidden)
          .map((field) => ({
            name: field.name,
            type: field.type,
            optional: !field.required,
            options: field.values || undefined,
          })),
      }));
  });

bulkRegisterControllers(databaseCollectionsRouter, [listCollections]);

export default databaseCollectionsRouter;
