import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { IdeaBoxTagSchema } from "../schema";
import * as tagsService from "../services/tags.service";

const ideaBoxTagsRouter = express.Router();

const getTags = forgeController
  .route("GET /:container")
  .description("Get tags for a container")
  .schema({
    params: z.object({
      container: z.string(),
    }),
    response: z.array(WithPBSchema(IdeaBoxTagSchema)),
  })
  .existenceCheck("params", {
    container: "idea_box__containers",
  })
  .callback(
    async ({ pb, params: { container } }) =>
      await tagsService.getTags(pb, container),
  );

const createTag = forgeController
  .route("POST /:container")
  .description("Create a new tag")
  .schema({
    body: IdeaBoxTagSchema,
    params: z.object({
      container: z.string(),
    }),
    response: WithPBSchema(IdeaBoxTagSchema),
  })
  .existenceCheck("params", {
    container: "idea_box__containers",
  })
  .callback(
    async ({ pb, params: { container }, body }) =>
      await tagsService.createTag(pb, container, body),
  )
  .statusCode(201);

const updateTag = forgeController
  .route("PATCH /:id")
  .description("Update a tag")
  .schema({
    body: IdeaBoxTagSchema,
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(IdeaBoxTagSchema),
  })
  .existenceCheck("params", {
    id: "idea_box__tags",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await tagsService.updateTag(pb, id, body),
  );

const deleteTag = forgeController
  .route("DELETE /:id")
  .description("Delete a tag")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "idea_box__tags",
  })
  .callback(
    async ({ pb, params: { id } }) => await tagsService.deleteTag(pb, id),
  )
  .statusCode(204);

bulkRegisterControllers(ideaBoxTagsRouter, [
  getTags,
  createTag,
  updateTag,
  deleteTag,
]);

export default ideaBoxTagsRouter;
