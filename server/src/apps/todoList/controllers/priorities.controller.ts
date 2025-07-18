import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { TodoListControllersSchemas } from "shared/types/controllers";

import * as prioritiesService from "../services/priorities.service";

const todoListPrioritiesRouter = express.Router();

const getAllPriorities = forgeController
  .route("GET /")
  .description("Get all todo priorities")
  .schema(TodoListControllersSchemas.Priorities.getAllPriorities)
  .callback(({ pb }) => prioritiesService.getAllPriorities(pb));

const createPriority = forgeController
  .route("POST /")
  .description("Create a new todo priority")
  .schema(TodoListControllersSchemas.Priorities.createPriority)
  .statusCode(201)
  .callback(({ pb, body }) => prioritiesService.createPriority(pb, body));

const updatePriority = forgeController
  .route("PATCH /:id")
  .description("Update an existing todo priority")
  .schema(TodoListControllersSchemas.Priorities.updatePriority)
  .existenceCheck("params", {
    id: "todo_list__priorities",
  })
  .callback(({ pb, params: { id }, body }) =>
    prioritiesService.updatePriority(pb, id, body),
  );

const deletePriority = forgeController
  .route("DELETE /:id")
  .description("Delete a todo priority")
  .schema(TodoListControllersSchemas.Priorities.deletePriority)
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
