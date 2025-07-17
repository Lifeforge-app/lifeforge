import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { TodoListEntrySchema, TodoListStatusCounterSchema } from "../schema";
import * as entriesService from "../services/entries.service";

const todoListEntriesRouter = express.Router();

const getStatusCounter = forgeController
  .route("GET /utils/status-counter")
  .description("Get status counter for todo entries")
  .schema({
    response: TodoListStatusCounterSchema,
  })
  .callback(async ({ pb }) => await entriesService.getStatusCounter(pb));

const getEntryById = forgeController
  .route("GET /:id")
  .description("Get todo entry by ID")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(TodoListEntrySchema),
  })
  .existenceCheck("params", {
    id: "todo_list__entries",
  })
  .callback(
    async ({ pb, params: { id } }) => await entriesService.getEntryById(pb, id),
  );

const getAllEntries = forgeController
  .route("GET /")
  .description("Get all todo entries with optional filters")
  .schema({
    query: z.object({
      list: z.string().optional(),
      status: z.string().optional().default("all"),
      priority: z.string().optional(),
      tag: z.string().optional(),
      query: z.string().optional(),
    }),
    response: z.array(WithPBSchema(TodoListEntrySchema)),
  })
  .existenceCheck("query", {
    tag: "[todo_list_tags]",
    list: "[todo_list_lists]",
    priority: "[todo_list_priorities]",
  })
  .callback(
    async ({ pb, query: { status, tag, list, priority } }) =>
      await entriesService.getAllEntries(pb, status, tag, list, priority),
  );

const createEntry = forgeController
  .route("POST /")
  .description("Create a new todo entry")
  .schema({
    body: TodoListEntrySchema.omit({
      completed_at: true,
      done: true,
    }),
    response: WithPBSchema(TodoListEntrySchema),
  })
  .existenceCheck("body", {
    list: "[todo_list_lists]",
    priority: "[todo_list_priorities]",
    tags: "[todo_list_tags]",
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => await entriesService.createEntry(pb, body));

const updateEntry = forgeController
  .route("PATCH /:id")
  .description("Update an existing todo entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: TodoListEntrySchema.omit({
      completed_at: true,
      done: true,
    }),
    response: WithPBSchema(TodoListEntrySchema),
  })
  .existenceCheck("params", {
    id: "todo_list__entries",
  })
  .existenceCheck("body", {
    list: "[todo_list_lists]",
    priority: "[todo_list_priorities]",
    tags: "[todo_list_tags]",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await entriesService.updateEntry(pb, id, body),
  );

const deleteEntry = forgeController
  .route("DELETE /:id")
  .description("Delete a todo entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "todo_list__entries",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id),
  );

const toggleEntry = forgeController
  .route("POST /toggle/:id")
  .description("Toggle completion status of a todo entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(TodoListEntrySchema),
  })
  .existenceCheck("params", {
    id: "todo_list__entries",
  })
  .callback(
    async ({ pb, params: { id } }) => await entriesService.toggleEntry(pb, id),
  );

bulkRegisterControllers(todoListEntriesRouter, [
  getEntryById,
  getAllEntries,
  getStatusCounter,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleEntry,
]);

export default todoListEntriesRouter;
