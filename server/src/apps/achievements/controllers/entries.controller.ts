import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { AchievementsEntrySchema } from "../schema";

const achievementsEntriesRouter = express.Router();

const getAllEntriesByDifficulty = forgeController
  .route("GET /:difficulty")
  .description("Get all achievements entries by difficulty")
  .schema({
    params: z.object({
      difficulty: AchievementsEntrySchema.shape.difficulty,
    }),
    response: z.array(WithPBSchema(AchievementsEntrySchema)),
  })
  .callback(({ pb, params: { difficulty } }) =>
    pb.collection("achievements__entries").getFullList({
      filter: `difficulty = "${difficulty}"`,
      sort: "-created",
    }),
  );

const createEntry = forgeController
  .route("POST /")
  .description("Create a new achievements entry")
  .schema({
    body: AchievementsEntrySchema,
    response: WithPBSchema(AchievementsEntrySchema),
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.collection("achievements__entries").create(body),
  );

const updateEntry = forgeController
  .route("PATCH /:id")
  .description("Update an existing achievements entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: AchievementsEntrySchema,
    response: WithPBSchema(AchievementsEntrySchema),
  })
  .existenceCheck("params", {
    id: "achievements__entries",
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.collection("achievements__entries").update(id, body),
  );

const deleteEntry = forgeController
  .route("DELETE /:id")
  .description("Delete an existing achievements entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "achievements__entries",
  })
  .statusCode(204)
  .callback(async ({ pb, params: { id } }) => {
    await pb.collection("achievements__entries").delete(id);
  });

bulkRegisterControllers(achievementsEntriesRouter, [
  getAllEntriesByDifficulty,
  createEntry,
  updateEntry,
  deleteEntry,
]);

export default achievementsEntriesRouter;
