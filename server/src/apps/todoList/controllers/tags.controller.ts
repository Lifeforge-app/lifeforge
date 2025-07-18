import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { TodoListSchemas } from "shared/types";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import * as tagsService from "../services/tags.service";

const todoListTagsRouter = express.Router();

const getAllTags = forgeController
  .route("GET /")
  .description("Get all todo tags")
  .schema({
    response: z.array(
      WithPBSchema(TodoListSchemas.TagSchema.extend({ amount: z.number() })),
    ),
  })
  .callback(({ pb }) => tagsService.getAllTags(pb));

const createTag = forgeController
  .route("POST /")
  .description("Create a new todo tag")
  .schema({
    body: TodoListSchemas.TagSchema,
    response: WithPBSchema(
      TodoListSchemas.TagSchema.extend({ amount: z.number() }),
    ),
  })
  .statusCode(201)
  .callback(({ pb, body }) => tagsService.createTag(pb, body));

const updateTag = forgeController
  .route("PATCH /:id")
  .description("Update an existing todo tag")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: TodoListSchemas.TagSchema,
    response: WithPBSchema(
      TodoListSchemas.TagSchema.extend({ amount: z.number() }),
    ),
  })
  .existenceCheck("params", {
    id: "todo_list__tags",
  })
  .callback(({ pb, params: { id }, body }) =>
    tagsService.updateTag(pb, id, body),
  );

const deleteTag = forgeController
  .route("DELETE /:id")
  .description("Delete a todo tag")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "todo_list__tags",
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) => tagsService.deleteTag(pb, id));

bulkRegisterControllers(todoListTagsRouter, [
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
]);

export default todoListTagsRouter;
