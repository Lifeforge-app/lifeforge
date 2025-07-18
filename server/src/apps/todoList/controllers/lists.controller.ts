import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { TodoListSchemas } from "shared/types";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import * as listsService from "../services/lists.service";

const todoListListsRouter = express.Router();

const getAllLists = forgeController
  .route("GET /")
  .description("Get all todo lists")
  .schema({
    response: z.array(
      WithPBSchema(TodoListSchemas.ListSchema.extend({ amount: z.number() })),
    ),
  })
  .callback(({ pb }) => listsService.getAllLists(pb));

const createList = forgeController
  .route("POST /")
  .description("Create a new todo list")
  .schema({
    body: TodoListSchemas.ListSchema.pick({
      name: true,
      icon: true,
      color: true,
    }),
    response: WithPBSchema(
      TodoListSchemas.ListSchema.extend({ amount: z.number() }),
    ),
  })
  .statusCode(201)
  .callback(({ pb, body }) => listsService.createList(pb, body));

const updateList = forgeController
  .route("PATCH /:id")
  .description("Update an existing todo list")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: TodoListSchemas.ListSchema.pick({
      name: true,
      icon: true,
      color: true,
    }),
    response: WithPBSchema(
      TodoListSchemas.ListSchema.extend({ amount: z.number() }),
    ),
  })
  .existenceCheck("params", {
    id: "todo_list__lists",
  })
  .callback(({ pb, params: { id }, body }) =>
    listsService.updateList(pb, id, body),
  );

const deleteList = forgeController
  .route("DELETE /:id")
  .description("Delete a todo list")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "todo_list__lists",
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) => listsService.deleteList(pb, id));

bulkRegisterControllers(todoListListsRouter, [
  getAllLists,
  createList,
  updateList,
  deleteList,
]);

export default todoListListsRouter;
