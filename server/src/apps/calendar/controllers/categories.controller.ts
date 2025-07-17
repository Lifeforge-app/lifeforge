import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { CalendarCategorySchema } from "../schema";
import * as CategoriesService from "../services/categories.service";

const calendarCategoriesRouter = express.Router();

const getAllCategories = forgeController
  .route("GET /")
  .description("Get all calendar categories")
  .schema({
    response: z.array(WithPBSchema(CalendarCategorySchema)),
  })
  .callback(async ({ pb }) => await CategoriesService.getAllCategories(pb));

const getCategoryById = forgeController
  .route("GET /:id")
  .description("Get a calendar category by ID")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(CalendarCategorySchema),
  })
  .existenceCheck("params", {
    id: "calendar__categories",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await CategoriesService.getCategoryById(pb, id),
  );

const createCategory = forgeController
  .route("POST /")
  .description("Create a new calendar category")
  .schema({
    body: CalendarCategorySchema,
    response: WithPBSchema(CalendarCategorySchema),
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    if (body.name.startsWith("_")) {
      throw new ClientError("Category name cannot start with _");
    }

    if (
      await pb
        .collection("calendar__categories")
        .getFirstListItem(`name="${body.name}"`)
        .catch(() => null)
    ) {
      throw new ClientError("Category with this name already exists");
    }

    return await CategoriesService.createCategory(pb, body);
  });

const updateCategory = forgeController
  .route("PATCH /:id")
  .description("Update an existing calendar category")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: CalendarCategorySchema,
    response: WithPBSchema(CalendarCategorySchema),
  })
  .existenceCheck("params", {
    id: "calendar__categories",
  })
  .callback(async ({ pb, params: { id }, body }) => {
    if (body.name.startsWith("_")) {
      throw new ClientError("Category name cannot start with _");
    }

    if (
      await pb
        .collection("calendar__categories")
        .getFirstListItem(`name="${body.name}" && id != "${id}"`)
        .catch(() => null)
    ) {
      throw new ClientError("Category with this name already exists");
    }

    return await CategoriesService.updateCategory(pb, id, body);
  });

const deleteCategory = forgeController
  .route("DELETE /:id")
  .description("Delete an existing calendar category")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "calendar__categories",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) =>
      await CategoriesService.deleteCategory(pb, id),
  );

bulkRegisterControllers(calendarCategoriesRouter, [
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
]);

export default calendarCategoriesRouter;
