import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { TodoListPrioritySchema } from "../schema";
import * as prioritiesService from "../services/priorities.service";

const todoListPrioritiesRouter = express.Router();

const getAllPriorities = forgeController
  .route("GET /")
  .description("Get all todo priorities")
  .schema({
    response: z.array(
      WithPBSchema(TodoListPrioritySchema.extend({ amount: z.number() })),
    ),
  })
  .callback(({ pb }) => prioritiesService.getAllPriorities(pb));

const createPriority = forgeController
  .route("POST /")
  .description("Create a new todo priority")
  .schema({
    body: TodoListPrioritySchema,
    response: WithPBSchema(
      TodoListPrioritySchema.extend({ amount: z.number() }),
    ),
  })
  .statusCode(201)
  .callback(({ pb, body }) => prioritiesService.createPriority(pb, body));

const updatePriority = forgeController
  .route("PATCH /:id")
  .description("Update an existing todo priority")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: TodoListPrioritySchema.pick({ name: true, color: true }),
    response: WithPBSchema(
      TodoListPrioritySchema.extend({ amount: z.number() }),
    ),
  })
  .existenceCheck("params", {
    id: "todo_list__priorities",
  })
  .callback(({ pb, params: { id }, body }) =>
    prioritiesService.updatePriority(pb, id, body),
  );

const deletePriority = forgeController
  .route("DELETE /:id")
  .description("Delete a todo priority")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "todo_list__priorities",
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    prioritiesService.deletePriority(pb, id),
  );

bulkRegisterControllers(todoListPrioritiesRouter, [
  getAllPriorities,
  createPriority,
  updatePriority,
  deletePriority,
]);

export default todoListPrioritiesRouter;
